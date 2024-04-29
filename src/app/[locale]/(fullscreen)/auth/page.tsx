'use client'

import { redirect } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

import { GitHubIcon } from '@/components/icons/GithubIcon'
import { Input } from '@/components/Input'
import axios from '@/lib/axios'

const Auth = () => {
  // status: 'loading' | 'authenticated' | 'unauthenticated'
  const { data: session } = useSession()
  if (session) {
    redirect('/')
  }

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
    } catch (error) {
      console.log(error)
    }
  }, [email, password])

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
    <div className="relative size-full min-h-screen bg-[url('/images/OHR.BorromeanIslands_ZH-CN0480730115_1920x1080.jpg&rf=LaDigue_1920x1080.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="size-full bg-black/10">
        {/* <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav> */}
        <div className="flex min-h-screen justify-center">
          <div className="mt-2 w-full self-center rounded-md bg-black/35 p-16 lg:w-2/5 lg:max-w-lg">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address" // or phone number
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
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
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="hover:opacity/80 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition"
              >
                <FcGoogle size={32} />
              </div>
              <div
                onClick={() => signIn('github', { callbackUrl: '/' })}
                className="hover:opacity/80 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition"
              >
                {/* <FaGithub size={32} /> */}
                <GitHubIcon className="size-8" />
              </div>
            </div>
            <p className="mt-12 text-neutral-300">
              {variant === 'login'
                ? 'First time using Yangtze?'
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
