import { BlurView } from 'expo-blur'
import { memo } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SizableText, useTheme, XStack } from 'tamagui'

import { useIsDark } from '~/features/theme/useIsDark'

import { isSmallScreen } from '../dimensions'
import { GradientBlurView } from '../effects/GradientBlurView'

const HEADER_HEIGHT = 44

interface AnimatedHomeHeaderProps {
  scrollY: SharedValue<number>
}

export const AnimatedHomeHeader = memo(({ scrollY }: AnimatedHomeHeaderProps) => {
  const insets = useSafeAreaInsets()
  const isDark = useIsDark()
  const totalHeaderHeight = HEADER_HEIGHT + insets.top
  const prevScrollY = useSharedValue(0)
  const headerOffset = useSharedValue(0)
  const theme = useTheme()

  // track scroll direction and update header offset
  useDerivedValue(() => {
    const diff = scrollY.value - prevScrollY.value
    prevScrollY.value = scrollY.value

    // at top - always show
    if (scrollY.value <= 0) {
      headerOffset.value = withTiming(0, { duration: 200 })
      return
    }

    // scrolling down (finger moving up, content going up) - hide
    if (diff > 2) {
      headerOffset.value = withTiming(-totalHeaderHeight, { duration: 200 })
    }
    // scrolling up (finger moving down, content going down) - show
    else if (diff < -2) {
      headerOffset.value = withTiming(0, { duration: 200 })
    }
  })

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerOffset.value }],
    }
  })

  return (
    <>
      <GradientBlurView
        intensity={20}
        tint={isDark ? 'dark' : 'light'}
        width="100%"
        height={isSmallScreen ? 30 : 60}
        inverted
        t={0}
        z={999}
      />
      <Animated.View
        style={[
          { backgroundColor: theme.background04.val },
          { paddingTop: insets.top, height: totalHeaderHeight, zIndex: 999 },
          StyleSheet.absoluteFillObject,
          animatedHeaderStyle,
        ]}
      >
        <BlurView
          intensity={60}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <XStack flex={1} items="center" justify="center" px="$3" pb="$2">
          <SizableText fontSize="$6" fontWeight="700" color="$color">
            Takeout
          </SizableText>
        </XStack>
      </Animated.View>
    </>
  )
})
