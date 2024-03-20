import '@/styles/tailwind.css'

// import glob from 'fast-glob'
import { type Metadata } from 'next'

// import { Providers } from '@/app/providers'
// import { Layout } from '@/components/Layout'
// import { type Section } from '@/components/SectionProvider'

export const metadata: Metadata = {
  title: {
    template: '%s - Yangtze Snippet',
    default: 'Yangtze Snippet'
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png'
    },
    {
      rel: 'icon',
      url: '/favicon.ico'
    }
  ]
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // const pages = await glob('**/*.mdx', { cwd: 'src/app' })
  // NOTE: sections inject by mdx/rehype.mjs rehypePlugins
  // const allSectionsEntries = (await Promise.all(
  //   pages.map(async filename => [
  //     `/${filename.replace(/(^|\/)page\.mdx$/, '')}`,
  //     (await import(`./${filename}`)).sections
  //   ])
  // )) as Array<[string, Array<Section>]>
  // const allSections = Object.fromEntries(allSectionsEntries)

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full justify-center bg-white antialiased dark:bg-zinc-900">
        {/* <Providers>
          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers> */}
        {children}
      </body>
    </html>
  )
}
