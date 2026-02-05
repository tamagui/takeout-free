import { useEmitter } from '@take-out/helpers'
import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  SlideInUp,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN } from 'react-native-worklets'
import {
  SizableText,
  Theme,
  useTheme,
  View,
  XStack,
  YStack,
  type ThemeName,
} from 'tamagui'

import { toastEmitter } from './emitter'

import type { ToastData, ToastType } from './types'

const BANNER_HEIGHT = 78
const TOP_OFFSET = 12
const DEFAULT_DURATION = 3000
const DISMISS_THRESHOLD = BANNER_HEIGHT / 2
const VELOCITY_THRESHOLD = 500
const SLIDE_UP_DISTANCE = BANNER_HEIGHT + TOP_OFFSET
const RESISTANCE_FACTOR = 0.15

function getThemeForType(type?: ToastType): ThemeName | null {
  switch (type) {
    case 'error':
      return 'red'
    case 'warn':
      return 'yellow'
    case 'success':
      return 'green'
    case 'info':
    default:
      return null
  }
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const createEnteringAnimation = () =>
  SlideInUp.withInitialValues({
    originY: -SLIDE_UP_DISTANCE * 2,
  }).springify()

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastData | null>(null)
  const toastIdRef = useRef(0)

  useEmitter(toastEmitter, (val) => {
    if (val.type === 'hide') {
      setToast(null)
    } else {
      setToast({ ...val.toast, id: toastIdRef.current++ })
    }
  })

  return (
    <>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {toast && (
          <ToastBanner key={toast.id} toast={toast} onHide={() => setToast(null)} />
        )}
      </View>
    </>
  )
}

interface ToastBannerProps {
  toast: ToastData
  onHide: () => void
}

const ToastBanner = memo(({ toast, onHide }: ToastBannerProps) => {
  const { top } = useSafeAreaInsets()
  const theme = useTheme()

  const translateY = useSharedValue(0)
  const hidden = useSharedValue(false)
  const isDragging = useSharedValue(false)
  const scheduleHide = useSharedValue(0)
  const mounted = useSharedValue(false)

  const duration = toast.duration ?? DEFAULT_DURATION
  const toastType = toast.type
  const themeName = getThemeForType(toastType)
  const action = toast.action

  useEffect(() => {
    mounted.value = true
    return () => {
      mounted.value = false
    }
  }, [mounted])

  const hide = useCallback(() => {
    onHide()
  }, [onHide])

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .maxPointers(1)
    .onBegin(() => {
      isDragging.value = true
    })
    .onUpdate((e) => {
      if (hidden.value) return
      if (e.translationY > 0) {
        translateY.value = e.translationY * RESISTANCE_FACTOR
      } else {
        translateY.value = e.translationY
      }
    })
    .onEnd((e) => {
      isDragging.value = false
      if (translateY.value < -DISMISS_THRESHOLD || e.velocityY < -VELOCITY_THRESHOLD) {
        hidden.value = true
      } else {
        translateY.value = withSpring(0)
      }
    })

  useAnimatedReaction(
    () => isDragging.value,
    (current) => {
      if (hidden.value) return
      if (current) {
        scheduleHide.value = 0
      } else {
        scheduleHide.value = withTiming(1, { duration }, (finished) => {
          if (finished) {
            hidden.value = true
          }
        })
      }
    }
  )

  useAnimatedReaction(
    () => hidden.value,
    (current) => {
      if (current) {
        translateY.value = withSpring(
          -SLIDE_UP_DISTANCE - top - TOP_OFFSET,
          { damping: 20, stiffness: 300 },
          (finished) => {
            if (finished) {
              scheduleOnRN(hide)
            }
          }
        )
      }
    }
  )

  const animatedStyle = useAnimatedStyle(() => {
    const isHidden = hidden.value

    return {
      transform: [{ translateY: translateY.value }],
      opacity: withTiming(isHidden && mounted.value ? 0 : 1, { duration: 200 }),
      pointerEvents: isHidden ? 'none' : 'auto',
      height: BANNER_HEIGHT,
    }
  })

  const handlePress = () => {
    if (action) {
      hidden.value = true
      action.onPress()
    }
  }

  return (
    <Theme name={themeName}>
      <GestureHandlerRootView style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View
          entering={createEnteringAnimation()}
          style={[
            {
              top: top + TOP_OFFSET,
              position: 'absolute',
              left: 16,
              right: 16,
              zIndex: 9999,
            },
            animatedStyle,
          ]}
        >
          <GestureDetector gesture={panGesture}>
            <Pressable onPress={handlePress} style={{ flex: 1 }}>
              <YStack
                flex={1}
                bg="$color2"
                rounded="$6"
                borderWidth={1}
                borderColor="$color4"
                justify="center"
                px="$4"
                py="$3"
                gap="$1"
              >
                <SizableText
                  size="$4"
                  fontWeight="600"
                  color="$color12"
                  numberOfLines={1}
                >
                  {toast.title}
                </SizableText>
                {toast.message && (
                  <SizableText size="$3" color="$color11" numberOfLines={2}>
                    {toast.message}
                  </SizableText>
                )}
                {action && (
                  <XStack pr="$3" items="center">
                    <SizableText size="$3" color="$color10" fontWeight="500">
                      {action.label}
                    </SizableText>
                  </XStack>
                )}
              </YStack>
            </Pressable>
          </GestureDetector>
        </Animated.View>
      </GestureHandlerRootView>
    </Theme>
  )
})
