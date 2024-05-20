import consola from 'consola'
import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'serve',
    description: 'serve the file on a ip:port',
  },
  args: {
    verbose: {
      type: 'boolean',
      description: 'Output more detailed debugging information',
    },
    feature: {
      type: 'string',
      default: 'database-query',
      description: 'Only debug a specific function',
    },
  },
  run({ args }) {
    consola.log('Debug')
    consola.log('Parsed args:', args)
  },
})
