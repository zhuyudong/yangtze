'use client'

import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

const LoginLogoutButton = () => {
  const session = useSession()
  const isAuthenticated =
    session.status !== 'loading' && session.status === 'authenticated'

  const router = useRouter()

  return (
    <DropdownMenuItem
      onClick={() => (isAuthenticated ? signOut() : router.push('/app/login'))}
    >
      {isAuthenticated ? 'Logout' : 'Login'}
    </DropdownMenuItem>
  )
}

export default LoginLogoutButton
