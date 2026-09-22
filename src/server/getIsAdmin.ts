import { ensure } from '@o/helpers'

import { ADMIN_WHITELIST } from '~/server/constants-server'

import type { AuthData } from '~/features/auth/types'

export const getIsAdmin = (authData: AuthData | null | undefined) =>
  authData && (authData.role === 'admin' || ADMIN_WHITELIST.has(authData.email || ''))

export function ensureAdmin(authData: AuthData | null | undefined) {
  ensure(getIsAdmin(authData), 'not admin')
}
