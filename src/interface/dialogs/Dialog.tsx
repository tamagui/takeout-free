import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { AlertDialog, Button, XStack, YStack } from 'tamagui'

type DialogState = {
  type: 'error' | 'confirm' | null
  title: string
  description: string
  resolve?: (value: boolean) => void
}

let globalShowDialog: ((state: Omit<DialogState, 'resolve'> & { resolve?: (value: boolean) => void }) => void) | null = null

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({ type: null, title: '', description: '' })

  const showDialog = (newState: Omit<DialogState, 'resolve'> & { resolve?: (value: boolean) => void }) => {
    setState({ ...newState, resolve: newState.resolve } as DialogState)
  }

  useEffect(() => {
    globalShowDialog = showDialog
    return () => {
      globalShowDialog = null
    }
  }, [])

  const handleClose = (confirmed: boolean) => {
    state.resolve?.(confirmed)
    setState({ type: null, title: '', description: '' })
  }

  return (
    <>
      {children}
      <AlertDialog open={state.type !== null} onOpenChange={(open) => !open && handleClose(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
            width="90%"
            maxW={400}
          >
            <YStack gap="$4">
              <AlertDialog.Title size="$6">{state.title}</AlertDialog.Title>
              <AlertDialog.Description size="$3" color="$color11">
                {state.description}
              </AlertDialog.Description>

              <XStack gap="$3" justify="flex-end">
                {state.type === 'confirm' ? (
                  <>
                    <AlertDialog.Cancel asChild>
                      <Button onPress={() => handleClose(false)}>Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button theme="blue" onPress={() => handleClose(true)}>
                        Confirm
                      </Button>
                    </AlertDialog.Action>
                  </>
                ) : (
                  <AlertDialog.Action asChild>
                    <Button theme="blue" onPress={() => handleClose(false)}>
                      OK
                    </Button>
                  </AlertDialog.Action>
                )}
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </>
  )
}

export const showError = (error: unknown, title = 'Error') => {
  let description = 'An unexpected error occurred'

  if (error instanceof Error) {
    description = error.message
  } else if (typeof error === 'string') {
    description = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    description = String(error.message)
  }

  if (globalShowDialog) {
    globalShowDialog({ type: 'error', title, description })
  } else {
    console.error(`${title}: ${description}`)
  }
}

export const dialogConfirm = async (props: {
  title?: string
  description?: string
}): Promise<boolean> => {
  const { title = 'Confirm', description = 'Are you sure?' } = props

  if (!globalShowDialog) {
    console.warn('DialogProvider not mounted, returning false')
    return false
  }

  return new Promise<boolean>((resolve) => {
    globalShowDialog!({
      type: 'confirm',
      title,
      description,
      resolve,
    })
  })
}
