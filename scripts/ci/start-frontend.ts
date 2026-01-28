#!/usr/bin/env bun

/**
 * @description Start frontend in production mode for CI
 */

import { getTestEnv } from '../helpers/get-test-env'
import { run } from '../helpers/run'

const testEnv = await getTestEnv()

await run(`bun one serve --port 8081`, {
  prefix: 'web-serve',
  env: {
    ...testEnv,
    IS_TESTING: '1',
    ONE_SERVER_URL: 'http://localhost:8081',
    BETTER_AUTH_URL: 'http://localhost:8081',
  },
})
