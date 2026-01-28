import { addProcessHandler, setExitCleanupState, type ProcessType } from './run'

const processes = new Set<ProcessType>()

interface HandleProcessExitOptions {
  onExit?: () => Promise<void>
}

export function handleProcessExit(options: HandleProcessExitOptions = {}) {
  const { onExit } = options

  addProcessHandler((proc) => {
    processes.add(proc)
  })

  const cleanup = async (signal: string) => {
    setExitCleanupState(true)
    console.info(`\n${signal} received, cleaning up...`)

    // kill all tracked processes
    for (const proc of processes) {
      try {
        proc.kill()
      } catch {
        // ignore
      }
    }

    // run custom cleanup
    if (onExit) {
      try {
        await onExit()
      } catch {
        // ignore cleanup errors
      }
    }
  }

  const signals = ['SIGINT', 'SIGTERM'] as const
  for (const signal of signals) {
    process.on(signal, async () => {
      await cleanup(signal)
      process.exit(1)
    })
  }

  return {
    exit: (code: number) => {
      process.exit(code)
    },
  }
}
