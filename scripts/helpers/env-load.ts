/**
 * load environment variables for deployment
 * assumes env is already loaded by dotenvx or similar
 */

type LoadEnvOptions = {
  optional?: string[]
}

export async function loadEnv(
  _stage: string,
  options: LoadEnvOptions = {}
): Promise<Record<string, string>> {
  const { optional = [] } = options

  // collect relevant env vars from process.env
  // assumes dotenvx has already loaded the appropriate .env files
  const serverEnvKeys = [
    'BETTER_AUTH_SECRET',
    'CLOUDFLARE_R2_ENDPOINT',
    'CLOUDFLARE_R2_ACCESS_KEY',
    'CLOUDFLARE_R2_SECRET_KEY',
    'CLOUDFLARE_R2_PUBLIC_URL',
    'POSTMARK_SERVER_TOKEN',
    'APNS_ENDPOINT',
    'APNS_TEAM_ID',
    'APNS_KEY_ID',
    'APNS_KEY',
    'VITE_POSTHOG_API_KEY',
    'VITE_POSTHOG_HOST',
    ...optional,
  ]

  const env: Record<string, string> = {}

  for (const key of serverEnvKeys) {
    const value = process.env[key]
    if (value) {
      env[key] = value
    }
  }

  return env
}
