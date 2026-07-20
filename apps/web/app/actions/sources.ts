'use server'

import { prisma } from '@companio/db'
import { createClient } from '@supabase/supabase-js'

const getSupabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Anon Key for server connection.')
  }
  return createClient(url, key)
}

async function getVerifiedUserId(accessToken: string) {
  if (!accessToken) {
    throw new Error('Missing access token for authorization.')
  }

  const supabase = getSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken)

  if (error || !user) {
    throw new Error('Invalid or expired session token. Please sign in again.')
  }

  return user
}

export async function getSources(accessToken: string) {
  try {
    const verifiedUser = await getVerifiedUserId(accessToken)

    const sources = await prisma.source.findMany({
      where: { userId: verifiedUser.id },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, sources }
  } catch (error: any) {
    console.error('Error in getSources server action:', error)
    return { success: false, error: error.message || 'Failed to retrieve sources' }
  }
}

export async function createSourceRecord(
  accessToken: string,
  payload: { fileName: string; fileKey: string; fileSize: number; fileType: string },
) {
  try {
    const verifiedUser = await getVerifiedUserId(accessToken)

    const supabase = getSupabaseServer()

    // Auto-create private 'sources' bucket if missing
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      if (buckets && !buckets.some((b) => b.name === 'sources')) {
        await supabase.storage.createBucket('sources', {
          public: false,
          allowedMimeTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown',
          ],
          fileSizeLimit: 10485760,
        })
        console.log("Automatically created private Supabase storage bucket 'sources'.")
      }
    } catch (bucketErr) {
      console.warn('Storage bucket auto-creation check bypassed:', bucketErr)
    }

    const newSource = await prisma.source.create({
      data: {
        userId: verifiedUser.id,
        fileName: payload.fileName,
        fileKey: payload.fileKey,
        fileSize: payload.fileSize,
        fileType: payload.fileType,
        status: 'PENDING',
      },
    })

    console.log(`Successfully created source record ${newSource.id} for user: ${verifiedUser.id}`)
    return { success: true, source: newSource }
  } catch (error: any) {
    console.error('Error in createSourceRecord server action:', error)
    return { success: false, error: error.message || 'Failed to create source record' }
  }
}

export async function renameSource(accessToken: string, sourceId: string, newName: string) {
  try {
    const verifiedUser = await getVerifiedUserId(accessToken)

    if (!newName || newName.trim().length < 1) {
      throw new Error('Filename cannot be empty.')
    }

    const existingSource = await prisma.source.findUnique({
      where: { id: sourceId },
    })

    if (!existingSource || existingSource.userId !== verifiedUser.id) {
      throw new Error('Access denied. You do not own this source.')
    }

    const updatedSource = await prisma.source.update({
      where: { id: sourceId },
      data: { fileName: newName.trim() },
    })

    console.log(`User ${verifiedUser.id} renamed source ${sourceId} to '${newName.trim()}'`)
    return { success: true, source: updatedSource }
  } catch (error: any) {
    console.error('Error in renameSource server action:', error)
    return { success: false, error: error.message || 'Failed to rename source' }
  }
}

export async function deleteSource(accessToken: string, sourceId: string) {
  try {
    const verifiedUser = await getVerifiedUserId(accessToken)

    const existingSource = await prisma.source.findUnique({
      where: { id: sourceId },
    })

    if (!existingSource || existingSource.userId !== verifiedUser.id) {
      throw new Error('Access denied. You do not own this source.')
    }

    const supabase = getSupabaseServer()
    const { error: storageError } = await supabase.storage
      .from('sources')
      .remove([existingSource.fileKey])

    if (storageError) {
      console.warn('Storage deletion warning (might not exist):', storageError)
    }

    await prisma.source.delete({
      where: { id: sourceId },
    })

    console.log(`Successfully deleted source ${sourceId} for user: ${verifiedUser.id}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteSource server action:', error)
    return { success: false, error: error.message || 'Failed to delete source' }
  }
}

export async function processDocument(accessToken: string, sourceId: string) {
  try {
    const verifiedUser = await getVerifiedUserId(accessToken)

    const source = await prisma.source.findUnique({
      where: { id: sourceId },
    })

    if (!source || source.userId !== verifiedUser.id) {
      throw new Error('Access denied. You do not own this source.')
    }

    await prisma.source.update({
      where: { id: sourceId },
      data: { status: 'PROCESSING', errorMsg: null },
    })

    const supabase = getSupabaseServer()
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('sources')
      .download(source.fileKey)

    if (downloadError || !fileData) {
      throw new Error(
        `Failed to download file from storage: ${downloadError?.message || 'File empty'}`,
      )
    }

    const fileBuffer = Buffer.from(await fileData.arrayBuffer())

    const { parseDocument } = await import('@/features/sources/utils/documentParser')
    const parsedDoc = await parseDocument(fileBuffer, source.fileType)

    await prisma.$transaction([
      prisma.documentContent.upsert({
        where: { sourceId: source.id },
        update: { content: parsedDoc.content },
        create: {
          sourceId: source.id,
          content: parsedDoc.content,
        },
      }),
      prisma.source.update({
        where: { id: source.id },
        data: {
          status: 'COMPLETED',
          wordCount: parsedDoc.wordCount,
          pageCount: parsedDoc.pageCount,
          processedAt: new Date(),
          errorMsg: null,
        },
      }),
    ])

    console.log(`Document ${sourceId} processed successfully: status COMPLETED`)
    return { success: true }
  } catch (error: any) {
    console.error(`Error processing document ${sourceId}:`, error)

    try {
      await prisma.source.update({
        where: { id: sourceId },
        data: {
          status: 'FAILED',
          errorMsg: error.message || 'Unknown error during text extraction',
        },
      })
    } catch (dbErr) {
      console.error('Failed to write FAILED status to database:', dbErr)
    }

    return { success: false, error: error.message || 'Failed to process document' }
  }
}
