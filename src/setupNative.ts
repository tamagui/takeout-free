// setup tamagui native
import '@tamagui/native/setup-gesture-handler'
import '@tamagui/native/setup-expo-linear-gradient'
import '@tamagui/native/setup-keyboard-controller'
// setup global side effects
import '~/features/storage/setupStorage'
import '~/helpers/crypto/polyfill'

import { setupDev } from 'tamagui'

console.info(`[native] start (SHA: ${process.env.GIT_SHA})`)

if (process.env.NODE_ENV === 'development') {
  setupDev({
    visualizer: true,
  })
}
