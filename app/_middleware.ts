import { createMiddleware } from 'one'

/**
 * Simple middleware - can be extended for auth checks, redirects, etc.
 */

export default createMiddleware(async ({ request, next }) => {
  const response = await next()

  // log errors in development
  if (response && response.status >= 400 && process.env.NODE_ENV === 'development') {
    const url = new URL(request.url)
    console.error(`[middleware] ${request.method} ${url.pathname} - ${response.status}`)
  }

  return response
})
