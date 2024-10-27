import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// import type { Style } from '@/registry/styles'
// import type { Theme } from '@/registry/themes'

interface Config {
  style: string // Style['name']
  theme: string // Theme['name']
  radius: number
}

const configAtom = atomWithStorage<Config>('config', {
  style: 'default',
  theme: 'zinc',
  radius: 0.5
})

export function useConfig() {
  return useAtom(configAtom)
}
