import { createEmitter } from '@o/helpers'

import type { ToastOptions } from './types'

export const toastEmitter = createEmitter<
  { type: 'show'; toast: ToastOptions } | { type: 'hide' }
>('toast', {
  type: 'hide',
})
