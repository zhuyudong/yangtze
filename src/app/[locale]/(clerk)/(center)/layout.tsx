// https://github.com/orgs/clerk/discussions/2721
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

export default function CenteredLayout(props: { children: ReactNode }) {
  const { userId } = auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  )
}
