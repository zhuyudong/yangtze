'use client'

import Error from 'next/error'

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

// not-found.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  )
}
// import { Button } from '@/components/button'
// import { HeroPattern } from '@/components/hero-pattern'

// export default function NotFound() {
//   return (
//     <>
//       <HeroPattern />
//       <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
//         <p className="text-sm font-semibold text-zinc-900 dark:text-white">
//           404
//         </p>
//         <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
//           Page not found
//         </h1>
//         <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
//           Sorry, we couldn’t find the page you’re looking for.
//         </p>
//         <Button href="/" arrow="right" className="mt-8">
//           Back to home
//         </Button>
//       </div>
//     </>
//   )
// }
