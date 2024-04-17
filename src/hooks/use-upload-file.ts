import { useState } from 'react'
import { toast } from 'sonner'
import type {
  ClientUploadedFileData,
  UploadFilesOptions
} from 'uploadthing/types'

import type { OurFileRouter } from '@/app/[locale]/api/uploadthing/core'
import { getErrorMessage, uploadFiles } from '@/lib/uploadthing'

type UploadedFile<T = unknown> = ClientUploadedFileData<T>

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    'headers' | 'onUploadBegin' | 'onUploadProgress' | 'skipPolling'
  > {
  defaultUploadedFiles?: UploadedFile[]
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = useState(false)

  async function uploadThings(files: File[]) {
    setIsUploading(true)
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses(prev => {
            return {
              ...prev,
              [file]: progress
            }
          })
        }
      })

      setUploadedFiles(prev => (prev ? [...prev, ...res] : res))
      return res
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setProgresses({})
      setIsUploading(false)
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles: uploadThings,
    isUploading
  }
}
