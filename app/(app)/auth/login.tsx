import { router } from 'one'
import { useState } from 'react'
import { Circle, isWeb, SizableText, Spinner, View, XStack, YStack } from 'tamagui'

import {
  APP_NAME,
  EULA_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from '~/constants/app'
import { signInAsDemo } from '~/features/auth/client/signInAsDemo'
import { isDemoMode } from '~/helpers/isDemoMode'
import { Link } from '~/interface/app/Link'
import { LogoIcon } from '~/interface/app/LogoIcon'
import { Button } from '~/interface/buttons/Button'
import { AppleIcon } from '~/interface/icons/AppleIcon'
import { GoogleIcon } from '~/interface/icons/GoogleIcon'
import { H2 } from '~/interface/text/Headings'
import { showToast } from '~/interface/toast/helpers'

export const LoginPage = () => {
  const [demoLoading, setDemoLoading] = useState<boolean>(false)

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    showToast(`${provider} login coming soon!`, { type: 'info' })
  }

  return (
    <XStack flex={1} flexBasis="auto" position="relative">
      <YStack flex={1} justify="center" items="center">
        <Circle
          size={80}
          my="$4"
          transition="medium"
          enterStyle={{ scale: 0.95, opacity: 0 }}
        >
          <LogoIcon size={42} />
        </Circle>

        <YStack
          gap="$6"
          width="100%"
          items="center"
          bg="$background"
          rounded="$8"
          p={isWeb ? '$6' : '$4'}
          maxW={isWeb ? 400 : '90%'}
        >
          <H2 text="center">Login to {APP_NAME}</H2>

          <YStack
            key="welcome-content"
            gap="$4"
            items="center"
            width="100%"
            transition="medium"
            enterStyle={{ opacity: 0, y: 10 }}
            exitStyle={{ opacity: 0, y: -10 }}
            position="relative"
            overflow="hidden"
          >
            <YStack width="100%" gap="$3">
              <Link
                href="/auth/signup/email"
                $platform-web={{
                  display: 'contents',
                }}
              >
                <Button
                  size="$5"
                  theme="blue"
                  variant="floating"
                  pressStyle={{
                    scale: 0.97,
                    opacity: 0.9,
                  }}
                  transition="200ms"
                  enterStyle={{ opacity: 0, scale: 0.95 }}
                >
                  Continue with Email
                </Button>
              </Link>

              {/* DEMO mode - enabled in dev or when VITE_DEMO_MODE=1 */}
              {isDemoMode && (
                <Button
                  variant="outlined"
                  size="$5"
                  onPress={async () => {
                    setDemoLoading(true)
                    const { error } = await signInAsDemo()
                    setDemoLoading(false)
                    if (error) {
                      showToast('Demo login failed', { type: 'error' })
                      return
                    }
                    router.replace('/home/feed')
                  }}
                  disabled={demoLoading}
                  width="100%"
                  data-testid="login-as-demo"
                  pressStyle={{
                    scale: 0.97,
                  }}
                  transition="200ms"
                  enterStyle={{ opacity: 0, scale: 0.95 }}
                >
                  {demoLoading ? <Spinner size="small" /> : 'Login as Demo User'}
                </Button>
              )}
            </YStack>

            <XStack width="100%" gap="$3" justify="center" overflow="visible">
              <Button
                size="$5"
                onPress={() => handleSocialLogin('google')}
                pressStyle={{
                  scale: 0.97,
                  bg: '$color2',
                }}
                hoverStyle={{
                  bg: '$color2',
                }}
                transition="200ms"
                enterStyle={{ opacity: 0, scale: 0.95 }}
                icon={<GoogleIcon size={18} />}
              />

              <Button
                size="$5"
                onPress={() => handleSocialLogin('apple')}
                pressStyle={{
                  scale: 0.97,
                  bg: '$color2',
                }}
                hoverStyle={{
                  bg: '$color2',
                }}
                transition="200ms"
                enterStyle={{ opacity: 0, scale: 0.95 }}
                icon={<AppleIcon size={20} />}
              />
            </XStack>
          </YStack>
          <YStack items="center" gap="$2" mt="$4">
            <SizableText size="$3" text="center" color="$color10">
              {` By continuing, you agree to our\n`}
              <Link href={TERMS_OF_SERVICE_URL}>Terms of Service</Link>,{' '}
              <Link href={PRIVACY_POLICY_URL}>Privacy Policy</Link> and{' '}
              <Link href={EULA_URL}>EULA.</Link>
            </SizableText>
          </YStack>
        </YStack>
      </YStack>
    </XStack>
  )
}
