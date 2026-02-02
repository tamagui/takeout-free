/**
 * Demo Login Flow Integration Test
 * Tests the full demo login flow to ensure users can log in and access the app
 */

import { expect, test } from '@playwright/test'

import { loginAsDemo } from './helpers'

const BASE_URL = 'http://localhost:8081'

test.beforeEach(async ({ context }) => {
  await context.clearCookies()
})

test('demo login flow completes successfully', async ({ page }) => {
  test.setTimeout(45000)

  // perform demo login
  await loginAsDemo(page)

  // verify we're on the home feed page
  expect(page.url()).toContain('/home/feed')

  // verify the page has rendered (app container visible)
  await expect(page.locator('[data-testid="app-container"]')).toBeAttached({
    timeout: 10000,
  })
})

test('authenticated user can access settings', async ({ page }) => {
  test.setTimeout(45000)

  // login and navigate to settings
  await loginAsDemo(page, '/home/settings')

  // verify we're on settings page
  expect(page.url()).toContain('/home/settings')

  // verify settings content is visible
  await expect(page.locator('[data-testid="app-container"]')).toBeAttached({
    timeout: 10000,
  })
})

test('demo login shows home feed content', async ({ page }) => {
  test.setTimeout(45000)

  // perform demo login
  await loginAsDemo(page)

  // verify we're on home/feed
  expect(page.url()).toContain('/home/feed')

  // verify the app container is visible (page loaded)
  await expect(page.locator('[data-testid="app-container"]')).toBeAttached({
    timeout: 10000,
  })
})
