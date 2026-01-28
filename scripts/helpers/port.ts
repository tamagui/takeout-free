import { Socket } from 'node:net'

export function checkPort(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = new Socket()

    tester.once('connect', () => {
      tester.destroy()
      resolve(true)
    })

    tester.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ECONNREFUSED') {
        resolve(false)
      } else {
        resolve(true)
      }
    })

    tester.connect(port, host)
  })
}

interface WaitForPortOptions {
  host?: string
  intervalMs?: number
  timeoutMs?: number
  retries?: number
}

export async function waitForPort(
  port: number,
  options: WaitForPortOptions = {}
): Promise<void> {
  const {
    host = '127.0.0.1',
    intervalMs = 1000,
    timeoutMs = 30000,
    retries = Math.floor(timeoutMs / intervalMs),
  } = options

  for (let i = 0; i < retries; i++) {
    const isOpen = await checkPort(port, host)
    if (isOpen) {
      return
    }

    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  throw new Error(`Port ${port} on ${host} did not become available after ${timeoutMs}ms`)
}
