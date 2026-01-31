import { Link, type Href } from 'one'
import { Linking, Platform } from 'react-native'
import { isWeb, ScrollView, SizableText, View, XStack, YStack } from 'tamagui'

import { APP_NAME_LOWERCASE, DOMAIN } from '~/constants/app'
import { useLogout } from '~/features/auth/useLogout'
import { CaretRightIcon } from '~/interface/icons/phosphor/CaretRightIcon'
import { DoorIcon } from '~/interface/icons/phosphor/DoorIcon'
import { UserIcon } from '~/interface/icons/phosphor/UserIcon'
import { PageLayout } from '~/interface/pages/PageLayout'
import { SepHeading } from '~/interface/text/Headings'

import type { IconComponent } from '~/interface/icons/types'

interface SettingItem {
  id: string
  title: string
  icon?: IconComponent
  onPress?: () => void
  href?: Href
  external?: boolean
}

interface SettingSection {
  title: string
  items: SettingItem[]
}

function SettingRow({ item }: { item: SettingItem }) {
  const Icon = item.icon

  const content = (
    <XStack
      cursor="pointer"
      height={56}
      px="$4"
      items="center"
      justify="space-between"
      hoverStyle={{ bg: '$color2' }}
      {...(item.onPress && { onPress: item.onPress })}
    >
      <XStack gap="$3" items="center" flex={1}>
        {Icon && (
          <View width={24} items="center" justify="center">
            <Icon size={20} color="$color11" />
          </View>
        )}
        <SizableText size="$5">{item.title}</SizableText>
      </XStack>
      <CaretRightIcon size={16} color="$color8" />
    </XStack>
  )

  if (item.onPress) {
    return content
  }

  if (item.href) {
    if (item.external && !isWeb) {
      return (
        <XStack
          cursor="pointer"
          height={56}
          px="$4"
          items="center"
          justify="space-between"
          hoverStyle={{ bg: '$color2' }}
          onPress={() => Linking.openURL(`https://${DOMAIN}${item.href}`)}
        >
          <XStack gap="$3" items="center" flex={1}>
            {Icon && (
              <View width={24} items="center" justify="center">
                <Icon size={20} color="$color11" />
              </View>
            )}
            <SizableText size="$5">{item.title}</SizableText>
          </XStack>
          <CaretRightIcon size={16} color="$color8" />
        </XStack>
      )
    }

    return (
      <Link href={item.href} target={item.external ? '_blank' : undefined} asChild>
        {content}
      </Link>
    )
  }

  return null
}

export function ProfileSettingsPage() {
  const { logout } = useLogout()

  const sections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          icon: UserIcon,
          href: '/home/settings/edit-profile',
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          id: 'logout',
          title: 'Log Out',
          icon: DoorIcon,
          onPress: logout,
        },
      ],
    },
  ]

  return (
    <PageLayout useImage>
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <YStack flex={1} flexBasis="auto" pb="$10">
          {sections.map((section) => (
            <YStack key={section.title} mb="$6" ml="$4">
              <SepHeading>{section.title}</SepHeading>
              <YStack>
                {section.items.map((item) => (
                  <SettingRow key={item.id} item={item} />
                ))}
              </YStack>
            </YStack>
          ))}

          <LogoAndVersion />
        </YStack>
      </ScrollView>
    </PageLayout>
  )
}

function LogoAndVersion() {
  return (
    <YStack items="center" pb={100} pt="$4">
      <XStack items="center" gap="$2">
        <SizableText color="$color10" fontWeight="bold">
          {APP_NAME_LOWERCASE}
        </SizableText>
      </XStack>
      <SizableText size="$1" color="$color10" mt="$2">
        v1.0.0
      </SizableText>
    </YStack>
  )
}
