import { getAuthDataFromRequest } from '@o/better-auth-utils/server'
import { authServer } from '~/features/auth/server/authServer'
import { zeroServer } from '~/zero/server'

// this sets up custom server-side mutators
// see: https://zero.rocicorp.dev/docs/custom-mutators

import type { Endpoint } from 'one'

export const POST: Endpoint = async (request) => {
  try {
    const authData = await getAuthDataFromRequest(authServer, request)

    const { response } = await zeroServer.handleMutationRequest({
      authData,
      request,
    })

    return Response.json(response)
  } catch (err) {
    console.error(`[zero] push+api error`, err)
    return Response.json({ err }, { status: 500 })
  }
}
