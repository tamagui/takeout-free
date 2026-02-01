import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { one, resolvePath } from 'one/vite'
import { visualizer } from 'rollup-plugin-visualizer'

import type { UserConfig } from 'vite'

export default {
  envPrefix: ['VITE_'],

  server: {
    allowedHosts: ['host.docker.internal'],
    port: 8081,
  },

  optimizeDeps: {
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
    external: ['on-zero', '@vxrn/mdx', '@rocicorp/zero'],
  },

  plugins: [
    tamaguiPlugin({
      optimize: true,
      disableExtraction: process.env.NODE_ENV !== 'production',
      useReactNativeWebLite: true,
      components: ['tamagui'],
      config: './src/tamagui/tamagui.config.ts',
      outputCSS: './src/tamagui/tamagui.generated.css',
    }),

    one({
      setupFile: {
        client: './src/setupClient.ts',
        native: './src/setupClient.ts',
        server: './src/setupServer.ts',
      },

      react: {
        compiler: true,
      },

      ssr: {
        autoDepsOptimization: {
          // TODO: add in ONE
          exclude: ['*/react-native-fast-squircle/*'],
        },
      },

      native: process.env.DISABLE_METRO
        ? {}
        : {
            bundler: 'metro',
            bundlerOptions: {
              watchman: false, // had some slowness using this
              babelConfigOverrides: (config) => {
                return {
                  ...config,
                  plugins: [
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
        defaultRenderMode: 'spa',
        inlineLayoutCSS: true,
        sitemap: {
          priority: 0.5,
          changefreq: 'weekly',
          exclude: [
            '/login/**',
            '/signup/**',
            '/profile-setup',
            '/avatar-setup',
            '/waiting-list',
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
