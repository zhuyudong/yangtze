import withBundleAnalyzer from '@next/bundle-analyzer'
// import { withContentlayer } from 'next-contentlayer'
import nextMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'
import { createSecureHeaders } from 'next-secure-headers'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import './src/env.mjs'
// equivalent to
await import('./src/env.mjs')
const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins
  }
})

/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {Array<((config: NextConfig) => NextConfig)>} NextConfigPlugins
 */

/** @type {NextConfigPlugins} */
// const plugins = []

/** @type {NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs', 'mdx'],
  eslint: {
    dirs: ['.']
  },
  // compress: false,
  // swcMinify: true,
  cleanDistDir: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Related to Pino error with RSC: https://github.com/orgs/vercel/discussions/3150
    serverComponentsExternalPackages: ['pino']
  },
  // https://nextjs.org/docs/messages/next-image-unconfigured-host
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yangtze.zeabur.app',
        port: '',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'cn.bing.com',
        port: '',
        pathname: '/th**'
      },
      {
        protocol: 'https',
        hostname: 'yet-another-react-lightbox.com',
        port: '',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  // output: 'standalone',
  // output: process.env.NEXT_OUTPUT_MODE,
  /**
   *
   * @param {import('webpack').Configuration} config
   * @param {import('next/dist/server/config-shared').WebpackConfigContext} context
   * @returns {import('webpack').Configuration}
   */
  webpack: (config, context) => {
    // if (process.env.NEXT_OUTPUT_MODE !== 'export' || !config.module) {
    //   return config
    // }
    // const { isServer } = context
    // if (!isServer) {
    //   config.resolve.fallback.fs = false
    // }
    // config.externals is needed to resolve the following errors:
    // Module not found: Can't resolve 'bufferutil'
    // Module not found: Can't resolve 'utf-8-validate'
    config.externals.push({
      'bufferutil': 'bufferutil',
      'utf-8-validate': 'utf-8-validate'
    })
    // config.optimization.minimize = false
    // NOTE: ignore python files
    config.module.rules.push({
      test: /\.py$/,
      loader: 'ignore-loader'
    })
    return config
  }
}

// plugins.push(
//   nextMDX({
//     options: {
//       remarkPlugins,
//       rehypePlugins,
//       recmaPlugins
//     }
//   })
// )
// export default () => plugins.reduce((_, plugin) => plugin(_), nextConfig)

export default bundleAnalyzer(withNextIntl(withSearch(withMDX(nextConfig))))
// export default bundleAnalyzer(
//   withNextIntl(withSearch(withContentlayer(withMDX(nextConfig))))
// )
