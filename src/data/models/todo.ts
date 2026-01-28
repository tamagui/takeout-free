import { boolean, number, string, table } from '@rocicorp/zero'
import { mutations, serverWhere } from 'over-zero'

import type { TableInsertRow } from 'over-zero'

export type Todo = TableInsertRow<typeof schema>

export const schema = table('todo')
  .columns({
    id: string(),
    userId: string(),
    text: string(),
    completed: boolean(),
    createdAt: number(),
  })
  .primaryKey('id')

const permissions = serverWhere('todo', (_, auth) => {
  return _.cmp('userId', auth?.id || '')
})

export const mutate = mutations(schema, permissions)
