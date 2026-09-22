import { assertString } from '@o/helpers'
import { createZeroServer } from 'on-zero/server'

import { models } from '~/data/generated/models'
import { queries } from '~/data/generated/syncedQueries'
import { schema } from '~/data/schema'
import { createServerActions } from '~/data/server/createServerActions'

const ZERO_UPSTREAM_DB = process.env.ZERO_UPSTREAM_DB

export const zeroServer = createZeroServer({
  schema,
  models,
  createServerActions,
  queries,
  // use imported value (bracket notation) to prevent build-time inlining
  database: assertString(ZERO_UPSTREAM_DB, `no ZERO_UPSTREAM_DB`),
  defaultAllowAdminRole: 'all',
})
