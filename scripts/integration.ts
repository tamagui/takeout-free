#!/usr/bin/env bun

/**
 * @description Simple integration test runner
 *
 * runs docker, waits for migrations, builds, starts server, runs playwright tests
 */

import { Socket } from 'node:net'

// --- config ---
const FRONTEND_PORT = 8081
const DOCKER_TIMEOUT = 120_000 // 2 min
const BUILD_TIMEOUT = 300_000 // 5 min
const TEST_TIMEOUT = 120_000 // 2 min

// --- state ---
const processes: Bun.Subprocess[] = []

// --- helpers ---

async function $(cmd: string, opts?: { silent?: boolean; timeout?: number }) {
  if (!opts?.silent) console.info(`$ ${cmd}`)
  const proc = Bun.spawn(['bash', '-c', cmd], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  processes.push(proc)

  const timeoutMs = opts?.timeout || 60_000
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      proc.kill()
      reject(new Error(`command timed out after ${timeoutMs}ms: ${cmd}`))
    }, timeoutMs)
  })

  const exitCode = await Promise.race([proc.exited, timeoutPromise])
  if (exitCode !== 0) {
    throw new Error(`command failed with exit ${exitCode}: ${cmd}`)
  }
}

async function spawn(cmd: string) {
  console.info(`$ ${cmd} &`)
  const proc = Bun.spawn(['bash', '-c', cmd], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  processes.push(proc)
  proc.unref()
  return proc
}

function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = new Socket()
    sock.once('connect', () => {
      sock.destroy()
      resolve(true)
    })
    sock.once('error', () => resolve(false))
    sock.connect(port, '127.0.0.1')
  })
}

async function waitForPort(port: number, timeoutMs = 30_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await checkPort(port)) return
    await Bun.sleep(500)
  }
  throw new Error(`port ${port} not available after ${timeoutMs}ms`)
}

async function waitForMigrations(timeoutMs = DOCKER_TIMEOUT) {
  console.info('waiting for migrations...')
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const proc = Bun.spawn(
        ['docker', 'compose', 'ps', '--all', '--format', 'json', 'migrate'],
        { stdout: 'pipe', stderr: 'pipe' }
      )
      const text = await new Response(proc.stdout).text()
      await proc.exited

      const status = JSON.parse(text)
      if (status.State === 'exited') {
        if (status.ExitCode === 0) {
          console.info('migrations complete')
          return
        }
        throw new Error(`migrations failed with exit ${status.ExitCode}`)
      }
    } catch (err: unknown) {
      const message = String(err)
      if (!message.includes('JSON')) throw err
    }

    await Bun.sleep(1000)
  }

  throw new Error('migrations timed out')
}

async function cleanup() {
  console.info('\ncleaning up...')
  for (const p of processes) {
    try {
      p.kill()
    } catch {}
  }
  await $('docker compose down', { silent: true, timeout: 30_000 }).catch(() => {})
}

// --- main ---

async function main() {
  console.info('integration test runner\n')

  // ensure port clear
  if (await checkPort(FRONTEND_PORT)) {
    console.error(`port ${FRONTEND_PORT} in use`)
    process.exit(1)
  }

  try {
    // clean start
    await $('docker compose down', { silent: true, timeout: 30_000 }).catch(() => {})

    // build migrations
    console.info('\nbuilding migrations...')
    await $('bun run tko migrate build', { timeout: BUILD_TIMEOUT })

    // start docker
    console.info('\nstarting docker...')
    await spawn('docker compose up --remove-orphans')
    await waitForMigrations()

    // install playwright
    console.info('\ninstalling playwright...')
    await $('bunx playwright install chromium', { timeout: BUILD_TIMEOUT })

    // build
    console.info('\nbuilding...')
    await $('bun run build', { timeout: BUILD_TIMEOUT })

    // start frontend
    console.info('\nstarting frontend...')
    await spawn('bun ./scripts/ci/start-frontend.ts')
    await waitForPort(FRONTEND_PORT, 60_000)

    // run tests
    console.info('\nrunning tests...')
    await $('cd src/test && bunx playwright test', { timeout: TEST_TIMEOUT })

    console.info('\n✓ integration tests passed')
  } finally {
    await cleanup()
  }
}

main().catch((err) => {
  console.error('\n✗ integration tests failed:', err.message)
  process.exit(1)
})
