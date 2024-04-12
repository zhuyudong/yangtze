'use client'

import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

// import { FaGithub } from 'react-icons/fa';
import { Input } from '@/components/Input'

const Auth = () => {
  // const session = await getSession();
  // status: 'loading' | 'authenticated' | 'unauthenticated'
  const { data: session } = useSession()
  // const session = await getServerSession();
  console.log('Auth: ', session)
  if (session) {
    redirect('/')
  }

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [variant, setVariant] = useState('login')

  const toggleVariant = useCallback(() => {
    setVariant(currentVariant =>
      currentVariant === 'login' ? 'register' : 'login'
    )
  }, [])

  const login = useCallback(async () => {
    try {
      // NOTE: 此处 'credentials' 在 api/auth/[...nextauth].ts 的 Credentials 函数中定义
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      })

      router.push('/movies')
    } catch (error) {
      console.log(error)
    }
  }, [email, password, router])

  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      })

      login()
    } catch (error) {
      console.log(error)
    }
  }, [email, name, password, login])

  return (
    <div className="relative size-full bg-[url('/images/hero.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="lg:bg-opacity/50 size-full bg-black">
        {/* <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav> */}
        <div className="flex justify-center">
          <div className="bg-opacity/70 mt-2 w-full self-center rounded-md bg-black p-16 lg:w-2/5 lg:max-w-lg">
            <h2 className="mb-8 text-4xl font-semibold text-white">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={variant === 'login' ? login : register}
              className="mt-10 w-full rounded-md bg-red-600 py-3 text-white transition hover:bg-red-700"
            >
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="mt-8 flex flex-row items-center justify-center gap-4">
              <div
                onClick={() => signIn('google', { callbackUrl: '/movies' })}
                className="hover:opacity/80 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition"
              >
                <FcGoogle size={32} />
              </div>
              {/* <div onClick={() => signIn('github', { callbackUrl: '/movies' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity/80 transition">
                <FaGithub size={32} />
              </div> */}
            </div>
            <p className="mt-12 text-neutral-500">
              {variant === 'login'
                ? 'First time using Netflix?'
                : 'Already have an account?'}
              <span
                onClick={toggleVariant}
                className="ml-1 cursor-pointer text-white hover:underline"
              >
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
