import pino from 'pino'

import { env } from '../env.mjs'

let options = {}

if (env.LOGTAIL_SOURCE_TOKEN) {
  options = {
    transport: {
      target: '@logtail/pino',
      options: { sourceToken: env.LOGTAIL_SOURCE_TOKEN }
    }
  }
} else {
  options = {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
}

export const logger = pino(options)
