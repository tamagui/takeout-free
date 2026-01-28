#!/usr/bin/env bun

/**
 * @description Run full CI/CD pipeline with builds, tests, and deployment
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

import { checkPort, waitForPort } from '../helpers/port'
import { handleProcessExit } from '../helpers/process'
import {
  printTiming,
  run,
  runInline,
  runParallel,
  sleep,
  time,
  waitForRun,
} from '../helpers/run'

const { exit } = handleProcessExit({
  onExit: async () => {
    try {
      await run('docker compose down --no-color', {
        silent: true,
        timeout: time.ms.minutes(1),
      })
    } catch {
      // ignore errors during cleanup
    }
  },
})

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'skip-checks': {
      type: 'boolean',
      default: false,
    },
    'skip-tests': {
      type: 'boolean',
      default: false,
    },
    'skip-build': {
      type: 'boolean',
      default: false,
    },
    dev: {
      type: 'boolean',
      default: false,
    },
    'skip-web-build': {
      type: 'boolean',
      default: false,
    },
    'skip-deploy': {
      type: 'boolean',
      default: false,
    },
    'dry-run': {
      type: 'boolean',
      default: false,
    },
    redeploy: {
      type: 'boolean',
      default: false,
    },
  },
})

// --dry-run is an alias for --skip-deploy
if (values['dry-run']) {
  values['skip-deploy'] = true
}

if (values.redeploy) {
  values['skip-checks'] = true
  values['skip-build'] = true
  values['skip-tests'] = true
}

console.info('🏃 CI/CD')
console.info(`Node version: ${process.version}`)
console.info(`Bun version: ${Bun.version}`)

const failures: Array<{ task: string; error: any }> = []
const SEPARATOR = '\n' + '='.repeat(80)

try {
  await ensurePortClear(8081)

  await runParallel([
    {
      name: 'checks',
      condition: () => !values['skip-checks'],
      async fn() {
        await run('bun check && bun lint', {
          prefix: 'checks',
          timeout: time.ms.minutes(3),
          timing: 'checks',
        })
      },
    },
    {
      name: 'playwright-install',
      condition: () => !values['skip-tests'],
      async fn() {
        await run('npx playwright install chromium', {
          prefix: 'playwright',
          timeout: time.ms.minutes(5),
          timing: 'playwright install',
        })
      },
    },
    {
      name: 'unit-tests',
      condition: () => !values['skip-tests'],
      fn: async () => {
        await setupBackend()
        await runUnitTests()
      },
    },
    {
      name: 'build',
      condition: () => !values['skip-build'],
      fn: async () => {
        try {
          if (!values['skip-web-build']) {
            await run('bun run build', {
              prefix: 'web-build',
              timeout: time.ms.minutes(5),
              timing: 'web:build',
            })
          }
          await printTiming('production build tests', () => runIntegrationTests())
        } catch (error) {
          failures.push({ task: 'build', error })
          throw error
        }
      },
    },
  ])

  if (!values['skip-deploy']) {
    await printTiming('deploy to production', () => deployProduction())
  }

  console.info('\n✅ CI completed successfully!')
  exit(0)
} catch (error) {
  if (failures.some((t) => t.task.includes('docker'))) {
    await printDockerLogs()
  }

  if (failures.length > 0) {
    console.error(SEPARATOR)
    console.error('CI FAILURES')
    console.error('='.repeat(80))

    for (const failure of failures) {
      console.error(`\nTask: ${failure.task}`)
      console.error('-'.repeat(40))
      const errorMessage = failure.error?.message || String(failure.error)
      console.error('Error:', errorMessage)
      console.error('')
    }
  } else {
    console.error('\nCI failed:', error)
  }

  process.exit(1)
}

async function setupBackend() {
  await runInline('backend', async () => {
    // make sure any existing running stuff is down first
    await run('docker compose down', { silent: true }).catch(() => {})
    void run('docker compose up --remove-orphans', {
      detached: true,
    })
    await waitForBackend()
  })
}

async function printDockerLogs() {
  try {
    console.info(SEPARATOR)
    console.info('DOCKER LOGS')
    console.info(SEPARATOR)
    const { stdout: psOutput } = await run('docker compose ps', {
      captureOutput: true,
      silent: true,
      timeout: time.ms.minutes(1),
    })
    const { stdout: logsOutput } = await run(
      'docker compose logs --tail=300 --no-color',
      {
        captureOutput: true,
        silent: true,
        timeout: time.ms.minutes(1),
      }
    )
    console.info(`Docker ps:\n${psOutput}\n\nDocker logs:\n${logsOutput}`)
    console.info('='.repeat(80))
  } catch (logError) {
    console.error('Failed to capture docker logs:', logError)
  }
}

async function waitForBackend() {
  console.info('Waiting for migrations to complete...')

  for (let i = 0; i < 120; i++) {
    await sleep(2000)

    const { stdout } = await run('docker compose ps --all --format json migrate', {
      silent: true,
      captureOutput: true,
    })

    try {
      const status = JSON.parse(stdout)

      if (status.State === 'exited') {
        if (status.ExitCode === 0) {
          console.info('✅ Migrations completed successfully!')
          return
        }
        throw new Error(`Migrations failed with exit code ${status.ExitCode}`)
      }

      if (i % 5 === 0) {
        console.info('Migrations still running...')
      }
    } catch (err) {
      if (`${err}`.includes('JSON Parse')) {
        continue
      }
      throw err
    }
  }

  throw new Error('Migrations failed to complete within timeout')
}

async function runUnitTests() {
  if (values['skip-tests']) {
    return
  }

  try {
    await run('bun run test:unit', {
      prefix: 'tests',
      timeout: time.ms.minutes(5),
      timing: 'test suite',
    })
  } catch (error) {
    failures.push({ task: 'tests', error })
    throw error
  }
}

async function runIntegrationTests() {
  if (values['skip-tests']) {
    return
  }

  console.info('\nRunning production integration tests...')

  try {
    await waitForRun('playwright install')

    // start frontend serving dist with proper env vars
    void run('bun ./scripts/ci/start-frontend.ts', {
      detached: true,
    })

    await waitForPort(8081, { timeoutMs: 60000 })

    await run('cd src/test && bunx playwright test', {
      prefix: 'e2e',
      timeout: time.ms.minutes(5),
      timing: 'playwright tests',
    })
  } catch (error) {
    failures.push({ task: 'integration tests', error })
    throw error
  }
}

async function deployProduction() {
  console.info('\nDeploying to production...')
  console.info('Using deployment platform: uncloud')
  await deployUncloud()
}

async function deployUncloud() {
  console.info('\n📦 deploying to uncloud...')
  console.info()

  const isConfigured = Boolean(process.env.DEPLOY_HOST && process.env.DEPLOY_DB)
  if (!isConfigured) {
    console.info('⚠ uncloud deployment not fully configured')
    console.info('\nmissing required variables:')
    if (!process.env.DEPLOY_HOST) {
      console.info('  - DEPLOY_HOST')
    }
    if (!process.env.DEPLOY_DB) {
      console.info('  - DEPLOY_DB')
    }
    console.info('\nskipping deployment (builds succeeded)')
    return
  }

  // install uncloud cli if needed
  const UNCLOUD_VERSION = '0.15.0'
  try {
    await run('uc --version', { silent: true, timeout: time.ms.seconds(5) })
  } catch {
    console.info(`installing uncloud cli v${UNCLOUD_VERSION}...`)
    await run(
      `curl -fsS https://get.uncloud.run/install.sh | sh -s -- --version ${UNCLOUD_VERSION}`,
      { timeout: time.ms.seconds(30) }
    )
  }

  // setup ssh key
  await setupSSHKey()

  // run deployment
  try {
    await run('bun scripts/uncloud/deploy-prod.ts', {
      prefix: 'deploy',
      timeout: time.ms.minutes(15),
      timing: 'uncloud deploy',
    })
  } catch (error) {
    failures.push({ task: 'deploy', error })
    throw error
  }

  // health check
  try {
    await run('bun scripts/uncloud/check-deployment.ts', {
      prefix: 'health',
      timeout: time.ms.minutes(5),
      timing: 'uncloud health check',
    })
  } catch (error) {
    failures.push({ task: 'health check', error })
    throw error
  }

  console.info('\n🎉 uncloud deployment successful!')
  const deployHost = process.env.DEPLOY_HOST
  if (deployHost) {
    console.info(`\nweb app: https://${deployHost}`)
  }
}

async function setupSSHKey() {
  if (!process.env.DEPLOY_SSH_KEY) {
    return
  }

  const sshKeyValue = process.env.DEPLOY_SSH_KEY

  if (existsSync(sshKeyValue)) {
    return
  }

  console.info('🔑 setting up ssh key from environment...')
  const sshDir = join(homedir(), '.ssh')
  const keyPath = join(sshDir, 'uncloud_deploy')

  if (!existsSync(sshDir)) {
    await mkdir(sshDir, { recursive: true })
  }

  await writeFile(keyPath, sshKeyValue, { mode: 0o600 })

  if (process.env.DEPLOY_HOST) {
    try {
      await run(
        `ssh-keyscan -H ${process.env.DEPLOY_HOST} >> ${join(sshDir, 'known_hosts')}`,
        { silent: true, timeout: time.ms.seconds(10) }
      )
    } catch {
      // ignore
    }
  }

  process.env.DEPLOY_SSH_KEY = keyPath
}

async function ensurePortClear(port: number) {
  const isPortTaken = await checkPort(port)
  if (isPortTaken) {
    console.error(
      `❌ Port ${port} is already in use. Please stop the existing server before running CI.`
    )
    process.exit(1)
  }
}
