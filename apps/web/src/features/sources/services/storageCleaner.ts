import { createClient } from '@supabase/supabase-js'

const getSupabaseServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase URL or Anon Key.')
  }
  return createClient(url, key)
}

export const storageCleaner = {
  async deleteFile(fileKey: string): Promise<void> {
    try {
      const supabase = getSupabaseServer()
      const { error } = await supabase.storage.from('sources').remove([fileKey])
      if (error) {
        console.warn(`Storage cleaner warning for key [${fileKey}]:`, error.message)
      } else {
        console.log(
          `Storage cleaner: Successfully purged temporary file payload [${fileKey}] from bucket storage.`,
        )
      }
    } catch (err) {
      console.error(`Storage cleaner: Failed to delete file [${fileKey}]:`, err)
    }
  },
}
