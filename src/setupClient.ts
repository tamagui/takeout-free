import '~/helpers/crypto/polyfill'

import { setupDev } from 'tamagui'

import { initializeSplashScreen } from '~/interface/splash/initializeSplashScreen'

console.info(`[client] start (SHA: ${process.env.GIT_SHA})`)

initializeSplashScreen()

if (process.env.NODE_ENV === 'development') {
  // hold down option in dev mode to see Tamagui dev visualizer
  setupDev({
    visualizer: true,
  })
}
