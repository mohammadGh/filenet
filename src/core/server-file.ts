/* eslint-disable node/prefer-global/process */
import { createServer } from 'node:net'
import type { Socket } from 'node:net'
import readline from 'node:readline'
import consola from 'consola'

const port = 7070
const host = '127.0.0.1'

consola.log('create node server instance')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const server = createServer()
const sockets: Socket[] = []

server.listen(port, host, () => {
  consola.log(`TCP Server is running on port ${port}.`)
  rl.question(`write close/exist to terminate the server.\n`, async (txt) => {
    consola.log(txt)
    if (txt === 'close') {
      consola.log(`Server is terminating...`)
      for (const sock of sockets) {
        consola.log('closing sockets ')
        sock.destroy()
      }
      server.close()
    }
  })
})

server.on('close', () => {
})

server.on('connection', (sock) => {
  consola.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`)
  sockets.push(sock)

  sock.on('data', (data) => {
    consola.log(`DATA ${sock.remoteAddress}: ${data}`)
    // Write the data back to all the connected, the client will receive it as data from the server
    sockets.forEach((sock, _index, _array) => {
      sock.write(`${sock.remoteAddress}:${sock.remotePort} said ${data}\n`)
    })
  })

  // Add a 'close' event handler to this instance of socket
  sock.on('close', (_data) => {
    const index = sockets.findIndex((o) => {
      return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort
    })
    if (index !== -1)
      sockets.splice(index, 1)
    consola.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}`)
  })
})
