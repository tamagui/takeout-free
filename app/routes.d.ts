// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/auth` | `/(app)/auth/login` | `/(app)/auth/login/password` | `/(app)/auth/signup/otp` | `/(app)/home` | `/(app)/home/(tabs)` | `/(app)/home/(tabs)/feed` | `/(app)/home/(tabs)/feed/` | `/(app)/home/feed` | `/(app)/home/feed/` | `/(app)/home/settings` | `/(app)/home/settings/` | `/(app)/home/settings/blocked-users` | `/(app)/home/settings/edit-profile` | `/(legal)/eula` | `/(legal)/privacy-policy` | `/(legal)/terms-of-service` | `/_sitemap` | `/auth` | `/auth/login` | `/auth/login/password` | `/auth/signup/otp` | `/docs/introduction` | `/eula` | `/help` | `/home` | `/home/(tabs)` | `/home/(tabs)/feed` | `/home/(tabs)/feed/` | `/home/feed` | `/home/feed/` | `/home/settings` | `/home/settings/` | `/home/settings/blocked-users` | `/home/settings/edit-profile` | `/privacy-policy` | `/terms-of-service`
      DynamicRoutes: `/(app)/auth/signup/${OneRouter.SingleRoutePart<T>}` | `/auth/signup/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: `/(app)/auth/signup/[method]` | `/auth/signup/[method]`
      IsTyped: true
      RouteTypes: {
        '/(app)/auth/signup/[method]': RouteInfo<{ method: string }>
        '/auth/signup/[method]': RouteInfo<{ method: string }>
      }
    }
  }
}

/**
 * Helper type for route information
 */
type RouteInfo<Params = Record<string, never>> = {
  Params: Params
  LoaderProps: { path: string; params: Params; request?: Request }
}