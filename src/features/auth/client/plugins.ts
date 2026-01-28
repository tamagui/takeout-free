import { adminClient, magicLinkClient } from 'better-auth/client/plugins'

import { platformClient } from './platformClient'

import type { BetterAuthClientPlugin } from 'better-auth'

export const plugins = [
  adminClient(),
  magicLinkClient(),
  platformClient(),
] satisfies BetterAuthClientPlugin[]
