#!/usr/bin/env bun

/**
 * @description npm postinstall tasks
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { $ } from 'bun'

// patch @o/scripts package.json to add missing "." export (vite strict exports)
try {
  const scriptsPackagePath = require.resolve('@o/scripts/package.json')
  const pkg = JSON.parse(readFileSync(scriptsPackagePath, 'utf-8'))
  if (!pkg.exports['.']) {
    pkg.exports['.'] = { types: './src/run.ts', default: './src/run.ts' }
    writeFileSync(scriptsPackagePath, JSON.stringify(pkg, null, 2))
    console.info('Patched @o/scripts package.json exports')
  }
} catch {
  // ignore if package not found
}

await Promise.all([$`bun tko run env-update`.nothrow(), $`bun run one patch`.nothrow()])

// fix @o/helpers asyncContext.native.js - published version has dynamic import bug
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
  const helpersPath = require.resolve('@o/helpers')
  const asyncContextPath = join(helpersPath, '../../esm/async/asyncContext.native.js')
  writeFileSync(asyncContextPath, asyncContextNativeFix)
  console.info('Patched @o/helpers asyncContext.native.js')
} catch {
  // ignore if package not found
}
