'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { motion } from 'framer-motion'
import { Edit2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FileUploader } from '@/components/patterns/file-upload/file-uploader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useUploadFile } from '@/hooks/use-upload-file'
import { api } from '@/trpc/react'

const schema = z.object({
  images: z.array(z.instanceof(File))
})

type Schema = z.infer<typeof schema>

export function AvatarSelection() {
  const session = useSession()
  const utils = api.useUtils()
  const [loading, setLoading] = useState(false)
  const getUserQuery = api.user.getUser.useQuery()
  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate()
    }
  })
  const { uploadFiles, progresses, isUploading } = useUploadFile(
    'imageUploader',
    { defaultUploadedFiles: [] }
  )
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: []
    }
  })

  async function onSubmit(input: Schema) {
    setLoading(true)
    const toastId = toast.loading('Uploading files...')
    const res = await uploadFiles(input.images)
    toast.dismiss(toastId)

    if (res && res?.length > 0 && res[0]?.url) {
      toast.success('File uploaded successfully')
      updateUserMutation.mutate({
        image: res[0]?.url
      })
      form.reset()
    }
    if (res?.length === 0) {
      toast.error('Something went wrong during upload')
    }

    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        {session.status === 'authenticated' && getUserQuery.data && (
          <motion.div
            initial={{ y: '-5rem' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative mx-auto mt-[-60px] rounded-full bg-background p-2"
          >
            <Avatar className="mb ">
              <AvatarImage
                className="size-[100px] rounded-full"
                src={getUserQuery.data.image ?? undefined}
                alt="avatar"
              />
              <AvatarFallback>
                <div className="flex size-[100px] items-center justify-center rounded-full border-2 text-xl font-bold ">
                  {getUserQuery.data.name?.charAt(0) ??
                    getUserQuery.data.email?.charAt(0)}
                </div>
              </AvatarFallback>
            </Avatar>
            <Edit2 className="absolute bottom-4 right-3 size-6 rounded-full border-2 bg-background p-2 " />
          </motion.div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
          <DialogDescription>
            Drag and drop your image here or click browse filesystem.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={1 * 1024 * 1024}
                        progresses={progresses}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <Button className="w-fit" disabled={loading}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
