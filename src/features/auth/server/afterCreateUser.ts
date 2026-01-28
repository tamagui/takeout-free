import { eq } from 'drizzle-orm'

import { DEMO_EMAIL } from '~/constants/app'
import { getDb } from '~/database'
import { user as userTable } from '~/database/schema-private'
import { userPublic, userState } from '~/database/schema-public'

export async function afterCreateUser(user: { id: string; email: string }) {
  try {
    const db = getDb()
    const userId = user.id
    const email = user.email

    console.info(`[afterCreateUser] Creating user records for ${email}`)

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
      console.info(`[afterCreateUser] User ${email} already exists`)
      return userPrivate
    }

    if (!userPrivate) {
      console.error(`[afterCreateUser] No user data found in private table for ${email}`)
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

    // Demo users are auto-onboarded for easier testing
    const isDemoUser = email === DEMO_EMAIL

    const userRow = {
      id: userId,
      name: name || '',
      username: isDemoUser ? 'demo' : username || '',
      image: image || '',
      joinedAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
    }

    console.info(`[afterCreateUser] Creating userPublic record`)
    await db.insert(userPublic).values(userRow)

    console.info(`[afterCreateUser] ✅ User ${email} setup complete`)
    return userPrivate
  } catch (error) {
    console.error(`[afterCreateUser] ❌ Error creating user records:`, error)
    throw error
  }
}
