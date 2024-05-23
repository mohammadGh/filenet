#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'

const main = defineCommand({
  meta: {
    name: 'filenet',
    version: '0.0.1',
    description: 'Citty playground CLI',
  },
  setup() {
  },
  cleanup() {
  },
  subCommands: {
    serve: () => import('./commands/serve').then(r => r.default),
  },
})

runMain(main)
