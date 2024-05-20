/* eslint-disable no-console */
import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'filenet',
    version: '1.0.0',
    description: 'Filenet CLI',
  },
  setup() {
    console.log('Setup')
  },
  cleanup() {
    console.log('Cleanup')
  },
  subCommands: {
    serve: () => import('./commands/serve').then(r => r.default),
  },
})

runMain(main)
