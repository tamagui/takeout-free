import type * as schema from './tables'
import type { TableInsertRow, TableUpdateRow } from 'over-zero'

export type Todo = TableInsertRow<typeof schema.todo>
export type TodoUpdate = TableUpdateRow<typeof schema.todo>

export type User = TableInsertRow<typeof schema.userPublic>
export type UserUpdate = TableUpdateRow<typeof schema.userPublic>

export type UserState = TableInsertRow<typeof schema.userState>
export type UserStateUpdate = TableUpdateRow<typeof schema.userState>
