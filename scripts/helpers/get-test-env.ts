import { loadEnv as vxrnLoadEnv } from 'vxrn/loadEnv'

import { getDockerHost } from './get-docker-host'

export async function getTestEnv() {
  // load development environment
  await vxrnLoadEnv('development')

  const dockerHost = getDockerHost()
  const dockerDbBase = `postgresql://user:password@127.0.0.1:5533`

  return {
    CI: 'true',
    DO_NOT_TRACK: '1',
    ZERO_LOG_LEVEL: process.env.DEBUG_BACKEND ? 'info' : 'warn',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'test-secret',
    BETTER_AUTH_URL: 'http://localhost:8081',
    ONE_SERVER_URL: 'http://localhost:8081',
    POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN || 'test-token',
    VITE_DEMO_MODE: '1',
    VITE_PUBLIC_ZERO_SERVER: 'http://localhost:4948',
    ZERO_MUTATE_URL: `http://${dockerHost}:8081/api/zero/push`,
    ZERO_QUERY_URL: `http://${dockerHost}:8081/api/zero/pull`,
    ZERO_UPSTREAM_DB: `${dockerDbBase}/postgres`,
    ZERO_CVR_DB: `${dockerDbBase}/zero_cvr`,
    ZERO_CHANGE_DB: `${dockerDbBase}/zero_cdb`,
  }
}
