import { generateReactHelpers } from '@uploadthing/react'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { z } from 'zod'

import type { OurFileRouter } from '@/app/[locale]/(unauth)/api/uploadthing/core'

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.'

  if (err instanceof z.ZodError) {
    const errors = err.issues.map(issue => {
      return issue.message
    })
    return errors.join('\n')
  }
  if (err instanceof Error) {
    return err.message
  }
  if (isRedirectError(err)) {
    throw err
  } else {
    return unknownError
  }
}
