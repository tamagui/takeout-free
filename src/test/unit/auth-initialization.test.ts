import { describe, expect, it } from 'vitest'

/**
 * Auth initialization order tests
 *
 * These tests verify that the auth system initializes correctly
 * and that the storage driver is properly set before auth code runs.
 */

describe('auth initialization requirements', () => {
  describe('storage driver must be set before auth storage is accessed', () => {
    it('storage operations should work when driver is set first', async () => {
      // simulate the correct initialization order
      const { setStorageDriver, createStorage } = await import('@take-out/helpers')

      // set up mock driver
      const mockData = new Map<string, string>()
      setStorageDriver({
        getItem: (key) => mockData.get(key) ?? null,
        setItem: (key, value) => mockData.set(key, value),
        removeItem: (key) => mockData.delete(key),
        getAllKeys: () => Array.from(mockData.keys()),
      })

      // create storage
      const storage = createStorage<'token', string>(`auth-init-test-${Date.now()}`)

      // operations should work
      storage.setItem('token', 'test-session-token')
      expect(storage.getItem('token')).toBe('test-session-token')
    })
  })

  describe('vite.config.ts setupFile configuration', () => {
    it('should have native setup file configured', async () => {
      const { readFileSync } = await import('node:fs')
      const { resolve } = await import('node:path')

      const viteConfigPath = resolve(process.cwd(), 'vite.config.ts')
      const viteConfig = readFileSync(viteConfigPath, 'utf-8')

      // verify native setup file is configured
      expect(viteConfig).toMatch(/native:\s*['"`]\.\/src\/setupClient\.ts['"`]/)
    })
  })

  describe('setupClient.ts imports', () => {
    it('should import crypto polyfill', async () => {
      const { readFileSync } = await import('node:fs')
      const { resolve } = await import('node:path')

      const setupClientPath = resolve(process.cwd(), 'src/setupClient.ts')
      const setupClient = readFileSync(setupClientPath, 'utf-8')

      // verify it imports crypto polyfill
      expect(setupClient).toMatch(/import\s+['"`]~\/helpers\/crypto\/polyfill['"`]/)
    })
  })

  describe('platformClient.native.ts', () => {
    it('should use createStorage for expo auth', async () => {
      const { readFileSync, existsSync } = await import('node:fs')
      const { resolve } = await import('node:path')

      const clientPath = resolve(
        process.cwd(),
        'src/features/auth/client/platformClient.native.ts'
      )
      expect(existsSync(clientPath)).toBe(true)

      const platformClient = readFileSync(clientPath, 'utf-8')

      // verify it uses createStorage (not direct SecureStore)
      expect(platformClient).toMatch(/createStorage/)
      // verify it passes storage to expoClient
      expect(platformClient).toMatch(/storage:\s*expoStorage/)
    })
  })
})

describe('regression: d75c598 storage change', () => {
  // this commit changed from expo-secure-store to createStorage
  // which introduced a dependency on the storage driver being set

  it('platformClient should not use expo-secure-store directly', async () => {
    const { readFileSync } = await import('node:fs')
    const { resolve } = await import('node:path')

    const clientPath = resolve(
      process.cwd(),
      'src/features/auth/client/platformClient.native.ts'
    )
    const platformClient = readFileSync(clientPath, 'utf-8')

    // expo-secure-store was the old approach that didn't need setup
    // createStorage approach requires setupStorage to run first
    expect(platformClient).not.toMatch(/from\s+['"`]expo-secure-store['"`]/)
  })
})
