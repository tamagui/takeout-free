import { boolean, string, table } from '@rocicorp/zero'
import { mutations, serverWhere } from 'over-zero'

import type { TableInsertRow } from 'over-zero'

export type UserState = TableInsertRow<typeof schema>

export const schema = table('userState')
  .columns({
    userId: string(),
    darkMode: boolean(),
  })
  .primaryKey('userId')

const permissions = serverWhere('userState', (_, auth) => {
  return _.cmp('userId', auth?.id || '')
})

export const mutate = mutations(schema, permissions)
