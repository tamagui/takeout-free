import { relationships } from '@rocicorp/zero'

import * as tables from './generated/tables'

export const userRelationships = relationships(tables.userPublic, ({ many, one }) => ({
  state: one({
    sourceField: ['id'],
    destSchema: tables.userState,
    destField: ['userId'],
  }),
  todos: many({
    sourceField: ['id'],
    destSchema: tables.todo,
    destField: ['userId'],
  }),
}))

export const todoRelationships = relationships(tables.todo, ({ one }) => ({
  user: one({
    sourceField: ['userId'],
    destSchema: tables.userPublic,
    destField: ['id'],
  }),
}))

export const userStateRelationships = relationships(tables.userState, ({ one }) => ({
  user: one({
    sourceField: ['userId'],
    destSchema: tables.userPublic,
    destField: ['id'],
  }),
}))

export const allRelationships = [
  userRelationships,
  todoRelationships,
  userStateRelationships,
]
