import { Link, router } from 'one'
import { memo, useState } from 'react'
import { H3, Separator, Sheet, Spacer, View, XStack, YStack } from 'tamagui'

import { useAuth } from '~/features/auth/client/authClient'
import { useLogout } from '~/features/auth/useLogout'
import { Logo } from '~/interface/app/Logo'
import { Avatar } from '~/interface/avatars/Avatar'
import { ButtonSimple } from '~/interface/buttons/ButtonSimple'
import { ScrollHeader } from '~/interface/headers/ScrollHeader'
import { DoorIcon } from '~/interface/icons/phosphor/DoorIcon'
import { GearIcon } from '~/interface/icons/phosphor/GearIcon'
import { ListIcon } from '~/interface/icons/phosphor/ListIcon'
import { PageContainer } from '~/interface/layout/PageContainer'
import { ThemeSwitch } from '~/interface/theme/ThemeSwitch'

import { NavigationTabs } from './NavigationTabs'

export const MainHeader = () => {
  const { user } = useAuth()
  return (
    <ScrollHeader>
      <PageContainer>
        <YStack width="100%" py="$2.5">
          <XStack position="relative" width="100%" px="$2" items="center">
            <XStack gap="$2" items="center">
              <Link href="/" aria-label="Home">
                <Logo height={20} />
              </Link>
            </XStack>

            <Spacer flex={1} />

            <XStack
              position="absolute"
              inset={0}
              pointerEvents="none"
              items="center"
              justify="center"
            >
              <View pointerEvents="auto">
                <NavigationTabs />
              </View>
            </XStack>

            <XStack gap="$2.5" items="center" display="none" $md={{ display: 'flex' }}>
              {user && (
                <ButtonSimple size="medium" circular cursor="pointer">
                  <Avatar
                    disableBorder
                    size={28}
                    image={user.image}
                    name={user.name ?? 'User'}
                  />
                </ButtonSimple>
              )}

              <ThemeSwitch />
              <ButtonSimple
                size="medium"
                circular
                onPress={() => router.push('/home/settings')}
                icon={<GearIcon size={18} />}
                aria-label="Settings"
              />
            </XStack>

            <MainHeaderMenu />
          </XStack>
        </YStack>
      </PageContainer>
    </ScrollHeader>
  )
}

export const MainHeaderMenu = memo(() => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
    setOpen(false)
  }
  return (
    <>
      <ButtonSimple
        size="large"
        variant="transparent"
        circular
        icon={<ListIcon size="$1" />}
        aria-label="Menu"
        onPress={() => setOpen(true)}
        $md={{ display: 'none' }}
      />
      <Sheet
        open={open}
        onOpenChange={setOpen}
        transition="medium"
        modal
        dismissOnSnapToBottom
        snapPoints={[50]}
      >
        <Sheet.Overlay
          bg="$shadow6"
          transition="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame bg="$color2" boxShadow="0 0 10px $shadow4">
          <YStack flex={1} gap="$2">
            <XStack p="$4" pb="$3" justify="space-between" items="center">
              <XStack gap="$3" items="center">
                <Logo height={32} />
              </XStack>
              <ThemeSwitch />
            </XStack>

            <Separator />

            <YStack flex={1} p="$3" gap="$2">
              <XStack
                p="$3"
                rounded="$4"
                gap="$3"
                items="center"
                hoverStyle={{ bg: '$color3' }}
                pressStyle={{ bg: '$color4' }}
                cursor="pointer"
                onPress={() => {
                  setOpen(false)
                  router.push('/home/settings')
                }}
              >
                <GearIcon />
                <H3 size="$3">Settings</H3>
              </XStack>

              <XStack
                p="$3"
                rounded="$4"
                gap="$3"
                items="center"
                hoverStyle={{ bg: '$color3' }}
                pressStyle={{ bg: '$color4' }}
                cursor="pointer"
                onPress={handleLogout}
              >
                <DoorIcon />
                <H3 size="$3">Logout</H3>
              </XStack>
            </YStack>

            {user && (
              <XStack p="$4" pt="$2" gap="$3" items="center">
                <Avatar size={40} image={user.image} name={user.name ?? 'User'} />
                <YStack flex={1}>
                  <H3 size="$3" fontWeight="600">
                    {user.name || user.email}
                  </H3>
                </YStack>
              </XStack>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
})
