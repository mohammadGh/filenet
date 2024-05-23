import type { Socket } from 'node:net'
import { readChunk } from 'read-chunk'
import { getSocketName } from './util'

export class SocketChunker {
  file: string
  chunkSize: number
  delay: number
  socket: Socket
  progress?: (current: number) => void
  _position = 0
  _socketName = ''

  constructor(socket: Socket, params: { file: string, chunkSize: number, delay: number, progress?: (current: number) => void }) {
    this.socket = socket
    this.file = params.file
    this.chunkSize = params.chunkSize
    this.delay = params.delay
    this.progress = params.progress
    this._socketName = getSocketName(socket)
  }

  async nextChunk() {
    const buffer = await readChunk(this.file, { length: this.chunkSize, startPosition: this._position })
    this.socket.write(buffer)
    this._position += buffer.byteLength

    this.progress && this.progress(this._position)

    if (!buffer || buffer.byteLength < this.chunkSize) {
      // end of file reached
      this.socket.end()
      this.socket.destroy()
      return
    }

    setTimeout(() => this.nextChunk(), this.delay)
  }
}
