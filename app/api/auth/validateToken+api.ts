import { isValidJWT } from '@o/better-auth-utils/server'

import type { Endpoint } from 'one'

export const POST: Endpoint = async (req) => {
  const body = await req.json()
  if (body && typeof body.token === 'string') {
    try {
      const valid = await isValidJWT(body.token, {})
      return Response.json({ valid })
    } catch (err) {
      console.error(`Error validating token`, err)
    }
    return Response.json({ valid: false })
  }

  return Response.json({ valid: false })
}
