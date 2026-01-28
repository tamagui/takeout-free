#!/usr/bin/env bun

/**
 * @description Run TypeScript type checking
 * @args --watch
 */

import { parseArgs } from 'node:util'

import { $ } from 'bun'

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    watch: { type: 'boolean' },
  },
})

if (values.watch) {
  await $`tsc --noEmit --watch`
} else {
  await $`tsc --noEmit`
}
