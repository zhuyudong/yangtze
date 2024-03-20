import nextMDX from '@next/mdx'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // https://nextjs.org/docs/messages/next-image-unconfigured-host
  images: {
    remotePatterns: [
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
      }
    ]
  },
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
    const { isServer } = context
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    // NOTE: ignore python files
    config.module.rules.push({
      test: /\.py$/,
      loader: 'ignore-loader'
    })
    return config
  }
}

export default withSearch(withMDX(nextConfig))
