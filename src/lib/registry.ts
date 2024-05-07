import { lazy } from 'react'

export const styles: { name: string; label: string }[] = []
export type Style = (typeof styles)[number]

// e.g
export const Index: Record<string, any> = {
  default: {
    alert: {
      name: 'alert',
      type: 'components:ui',
      registryDependencies: undefined,
      component: lazy(() =>
        import('@/components/ui/alert').then(m => ({ default: m.Alert }))
      ),
      source: '',
      files: ['registry/default/ui/alert.tsx'],
      category: 'undefined',
      subcategory: 'undefined',
      chunks: []
    }
  }
}
