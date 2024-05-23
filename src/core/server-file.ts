import { createServer } from 'node:net'
import type { Socket } from 'node:net'
import fs from 'node:fs'
import consola from 'consola'
import { ProgressBars } from './progress-bars'
import { getSocketName } from './util'
import { SocketChunker } from './socket-chunker'

const progressBars = new ProgressBars()

const port = 7070
const host = '127.0.0.1'

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

const server = createServer()
const sockets: Socket[] = []

server.listen(port, host, () => {
  consola.start(`TCP File Server is running on port ${port}. \n`)
  // rl.question(`write close/exist to terminate the server.\n`, async (txt) => {
  //   consola.log(txt)
  //   if (txt === 'close') {
  //     consola.log(`Server is terminating...`)
  //     for (const sock of sockets) {
  //       consola.log('closing sockets ')
  //       sock.destroy()
  //     }
  //     server.close()
  //   }
  // })
})

server.on('close', () => {
})

server.on('connection', (sock) => {
  const clientName = getSocketName(sock)
  sockets.push(sock)

  const file = '/tmp/file'
  const chunkSize = 10 * 1024 * 1024

  const fileStat = fs.statSync(file)
  const fileSize = fileStat.size
  progressBars.add(clientName, Math.ceil(fileSize / chunkSize))

  const chunker = new SocketChunker(sock, { file, chunkSize, delay: 1000, progress: humanSize => progressBars.increment(clientName, { humanSize }) })
  chunker.nextChunk()

  sock.on('data', () => {
    // consola.log(`DATA received by client ${sock.remoteAddress}: ${data}`)
  })

  // Add a 'close' event handler to this instance of socket
  sock.on('close', (_data) => {
    const index = sockets.findIndex((o) => {
      return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort
    })
    if (index !== -1)
      sockets.splice(index, 1)
    progressBars.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`)
  })
})
