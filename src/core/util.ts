import type { Socket } from 'node:net'

export function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`
}

export function humanFileSizeToBytes(fileSizeString: string) {
  const fileSize = Number.parseFloat(fileSizeString)
  const units = fileSizeString.trim().slice(-1)
  const multiplier = {
    K: 1024,
    M: 1024 * 1024,
    G: 1024 * 1024 * 1024,
    T: 1024 * 1024 * 1024 * 1024,
  }[units.toUpperCase()]

  return fileSize * (multiplier ?? 1)
}

export function getSocketName(sock: Socket) {
  return `${sock.remoteAddress}:${sock.remotePort}`
}
