// simplified analytics - logs in development only
export const analyticsActions = () => {
  return {
    logEvent: async (
      userId: string,
      event: string,
      properties?: Record<string, unknown>
    ) => {
      if (process.env.NODE_ENV === 'development') {
        console.info(`[Analytics] User ${userId}: ${event}`, properties)
      }
    },

    identifyUser: async (userId: string, traits?: Record<string, unknown>) => {
      if (process.env.NODE_ENV === 'development') {
        console.info(`[Analytics] Identify user ${userId}`, traits)
      }
    },

    trackException: async (
      error: Error,
      userId?: string,
      context?: Record<string, unknown>
    ) => {
      console.error(`[Analytics] Exception for ${userId || 'anonymous'}:`, error, context)
    },
  }
}
