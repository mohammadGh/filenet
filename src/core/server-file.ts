import { createServer } from 'node:net'
import type { Socket } from 'node:net'
import fs from 'node:fs'
import consola from 'consola'
import { readChunk } from 'read-chunk'

import cliProgress from 'cli-progress'

class ProgressBars {
  progressBars: any
  bars: any
  constructor() {
    // create new container
    this.progressBars = new cliProgress.MultiBar({
      format: ' {bar} {percentage}% | to ⇒ {name} | {value}/{total} | {humanSize}',
      hideCursor: true,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',

      // only the bars will be cleared, not the logged content
      clearOnComplete: false,
      stopOnComplete: true,

      // important! redraw everything to avoid "empty" completed bars
      forceRedraw: true,
    })
    this.bars = {}
  }

  add(name: string, size: number) {
    this.bars[name] = this.progressBars.create(size, 0, { name })
  }

  increment(name: string) {
    this.bars[name].increment()
  }

  update(name: string, values: any) {
    this.bars[name].update(values)
  }

  log(msg: string) {
    this.progressBars.log(msg)
  }
}

const progressBars = new ProgressBars()

const port = 7070
const host = '127.0.0.1'

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

const server = createServer()
const sockets: Socket[] = []

function getClientName(sock: Socket) {
  return `${sock.remoteAddress}:${sock.remotePort}`
}

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
  const clientName = getClientName(sock)
  sockets.push(sock)

  const filePath = '/home/mgh/Downloads/file.mp4'
  const chunkSize = 10 * 1024 * 1024

  const fileStat = fs.statSync(filePath)
  const fileSize = fileStat.size
  progressBars.add(clientName, Math.ceil(fileSize / chunkSize))

  const chunker = new Chunker(sock, filePath, chunkSize, 1000)
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

class Chunker {
  file: string
  chunkSize: number
  delay: number
  socket: Socket
  _position = 0
  _socketName = ''

  constructor(socket: Socket, file: string, chunkSize: number, delay: number) {
    this.socket = socket
    this.file = file
    this.chunkSize = chunkSize
    this.delay = delay
    this._socketName = getClientName(socket)
  }

  async nextChunk() {
    const buffer = await readChunk(this.file, { length: this.chunkSize, startPosition: this._position })
    this.socket.write(buffer)
    this._position += buffer.byteLength
    progressBars.increment(this._socketName)
    progressBars.update(this._socketName, { humanSize: humanFileSize(this._position) })

    if (!buffer || buffer.byteLength < this.chunkSize) {
      // end of file reached
      this.socket.end()
      this.socket.destroy()
      return
    }

    setTimeout(() => this.nextChunk(), this.delay)
  }
}

function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`
}
