import type { Socket } from 'node:net'

export function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`
}

export function getSocketName(sock: Socket) {
  return `${sock.remoteAddress}:${sock.remotePort}`
}
