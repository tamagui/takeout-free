#!/usr/bin/env bun

/**
 * @description npm postinstall tasks
 */

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { $ } from 'bun'

// "tko" wont work until this runs so referencing it directly:
const buildInitialLocation = require.resolve('@take-out/scripts/build-initial')
await $`bun run ${buildInitialLocation}`

await $`bun tko run update-local-env`
await $`bun run one patch`

// fix @take-out/helpers asyncContext.native.js - published version has dynamic import bug
const asyncContextNativeFix = `// react native implementation - no node:async_hooks available
export function createAsyncContext() {
  var currentContext = undefined;
  var contextStack = [];

  return {
    get: function() {
      return currentContext;
    },
    run: async function(value, fn) {
      var prevContext = currentContext;
      currentContext = value;
      contextStack.push(prevContext);

      try {
        return await fn();
      } finally {
        currentContext = contextStack.pop();
      }
    }
  };
}

var globalContext = null;

export function getAsyncContext() {
  if (!globalContext) {
    globalContext = createAsyncContext();
  }
  return globalContext;
}
`

try {
  const helpersPath = require.resolve('@take-out/helpers')
  const asyncContextPath = join(helpersPath, '../../esm/async/asyncContext.native.js')
  writeFileSync(asyncContextPath, asyncContextNativeFix)
  console.info('✅ Patched @take-out/helpers asyncContext.native.js')
} catch {
  // ignore if package not found
}
