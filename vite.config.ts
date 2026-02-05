import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { one } from 'one/vite'
import { visualizer } from 'rollup-plugin-visualizer'

import type { UserConfig } from 'vite'

export default {
  server: {
    allowedHosts: ['host.docker.internal'],
  },

  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
    },

    include: ['async-retry'],
    // @hot-updater/cli-tools contains native .node binaries (oxc-transform)
    // that esbuild can't handle - exclude from optimization
    exclude: ['@hot-updater/cli-tools'],
  },

  ssr: {
    // we set this as it generally improves compatability by optimizing all deps for node
    noExternal: true,
    // @rocicorp/zero must be external to prevent Symbol mismatch between
    // @rocicorp/zero and @rocicorp/zero/server - they share queryInternalsTag
    // Symbol that must be the same instance for query transforms to work
    external: ['on-zero', '@vxrn/mdx', '@rocicorp/zero', 'retext', 'retext-smartypants'],
  },

  plugins: [
    tamaguiPlugin(
      // see tamagui.build.ts for configuration
    ),

    one({
      setupFile: {
        client: './src/setupClient.ts',
        native: './src/setupNative.ts',
        server: './src/setupServer.ts',
      },

      react: {
        compiler: process.env.NODE_ENV === 'production',
      },

      native: {
        bundler: 'metro',
        bundlerOptions: {
          watchman: false,
          babelConfigOverrides: (config) => {
            return {
              ...config,
              plugins: [
                // react compiler for automatic memoization - must run first
                'babel-plugin-react-compiler',
                ...(config?.plugins || []),
                // reanimated worklet compilation - MUST be last
                'react-native-reanimated/plugin',
              ],
            }
          },
        },
      },

      router: {
        experimental: {
          typedRoutesGeneration: 'runtime',
        },
      },

      web: {
        experimental_scriptLoading: 'after-lcp-aggressive',
        inlineLayoutCSS: true,
        defaultRenderMode: 'spa',
        sitemap: {
          priority: 0.5,
          changefreq: 'weekly',
          exclude: [
            '/login/**',
            '/signup/**',
            '/profile-setup',
            '/avatar-setup',
            '/settings/**',
          ],
        },
      },

      deps: {
        pg: true,
      },

      build: {
        api: {
          config: {
            build: {
              rollupOptions: {
                external: [
                  '@rocicorp/zero',
                  'better-auth',
                  'better-auth/plugins',
                  'sharp',
                ],
              },
            },
          },
        },
      },
    }),

    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: 'bundle_stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
          visualizer({
            filename: 'bundle_stats.json',
            template: 'raw-data',
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
        ]
      : []),
  ],
} satisfies UserConfig
