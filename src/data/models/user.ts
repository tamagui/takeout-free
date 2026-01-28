import { number, string, table } from '@rocicorp/zero'
import { mutations, serverWhere } from 'over-zero'

import type { TableInsertRow } from 'over-zero'

export type User = TableInsertRow<typeof schema>

export const schema = table('userPublic')
  .columns({
    id: string(),
    name: string().optional(),
    username: string().optional(),
    image: string().optional(),
    joinedAt: number(),
  })
  .primaryKey('id')

const permissions = serverWhere('userPublic', (_, auth) => {
  return _.or(_.cmpLit(auth?.role || '', '=', 'admin'), _.cmp('id', auth?.id || ''))
})

export const mutate = mutations(schema, permissions, {
  update: async ({ authData, can, tx }, user: Partial<User> & { id: string }) => {
    if (!authData) throw new Error('Unauthorized')
    await can(permissions, authData.id)
    await tx.mutate.userPublic.update(user)
  },
})
