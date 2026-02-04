import { Stack } from 'one'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { TamaguiRootProvider } from '~/tamagui/TamaguiRootProvider'

export function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiRootProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)" />
          </Stack>
        </SafeAreaProvider>
      </TamaguiRootProvider>
    </GestureHandlerRootView>
  )
}
