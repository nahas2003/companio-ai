export interface Source {
  id: string
  userId: string
  fileName: string
  fileKey: string
  fileSize: number
  fileType: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreateSourcePayload {
  fileName: string
  fileKey: string
  fileSize: number
  fileType: string
}
