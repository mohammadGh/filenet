import consola from 'consola'
import { defineCommand } from 'citty'
import { serveFile } from '..'
import { humanFileSizeToBytes } from '../core/util'

export default defineCommand({
  meta: {
    name: 'serve',
    description: 'Serve the file from current directory to network',
  },
  args: {
    port: {
      type: 'string',
      default: '6016',
      description: 'server port',
    },
    host: {
      type: 'string',
      default: '127.0.0.1',
      description: 'server host',
    },
    chunksize: {
      type: 'string',
      default: `1M`,
      description: 'Chunksize in bytes or with postfix K/M/G like 2M, 10K, 1.5M and so on',
    },
    delay: {
      type: 'string',
      default: '1000',
      description: 'delay in ms',
    },
    file: {
      type: 'positional',
      description: 'path to file',
    },
  },
  run({ args }) {
    consola.debug('Serve command running')
    consola.debug('Parsed args:', args)
    serveFile(Number.parseInt(args.port), args.host, args.file, { chunksize: humanFileSizeToBytes(args.chunksize), delay: Number.parseInt(args.delay) })
  },
})
