import { createServerHelpers } from '@o/database/postgres'

import { database } from './database'

export const { sql, getDBClient } = createServerHelpers(database)
