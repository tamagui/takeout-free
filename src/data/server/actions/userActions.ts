import { eq } from 'drizzle-orm'

import { getDb } from '~/database'
import { user as userTable } from '~/database/schema-private'
import { todo, userPublic, userState } from '~/database/schema-public'

import type { AuthData } from '~/features/auth/types'

export const userActions = {
  onboardUser,
  deleteAccount,
}

async function onboardUser(authData: AuthData, userId: string) {
  if (!authData) return

  const db = getDb()

  // check if user exists in userPublic table
  const existingUser = await db
    .select()
    .from(userPublic)
    .where(eq(userPublic.id, userId))
    .limit(1)

  // get user data from private user table
  const [userPrivate] = await db
    .select({
      name: userTable.name,
      username: userTable.username,
      email: userTable.email,
      image: userTable.image,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .where(eq(userTable.id, userId))

  if (existingUser.length === 1) {
    return userPrivate
  }

  if (!userPrivate) {
    return
  }

  // check if userState exists, if not create it with defaults
  const existingUserState = await db
    .select()
    .from(userState)
    .where(eq(userState.userId, userId))
    .limit(1)

  if (existingUserState.length === 0) {
    await db.insert(userState).values({
      userId,
      darkMode: false,
    })
  }

  const { name, username, image, createdAt } = userPrivate

  const userRow = {
    id: userId,
    name: name || '',
    username: username || '',
    image: image || '',
    joinedAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
  }

  await db.insert(userPublic).values(userRow)

  return userPrivate
}

async function deleteAccount(userId: string) {
  const db = getDb()

  try {
    // delete all user's todos
    await db.delete(todo).where(eq(todo.userId, userId))

    // delete user state
    await db.delete(userState).where(eq(userState.userId, userId))

    // delete user from private user table (authentication data)
    await db.delete(userTable).where(eq(userTable.id, userId))

    // delete user from userPublic table (public profile)
    await db.delete(userPublic).where(eq(userPublic.id, userId))
  } catch (error) {
    console.error(`Failed to delete account for user ${userId}:`, error)
    throw new Error('Failed to delete account')
  }
}
