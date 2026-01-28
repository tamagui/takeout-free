import { H1, H2, ScrollView, SizableText, YStack } from 'tamagui'

import { APP_NAME } from '~/constants/app'
import { Link } from '~/interface/app/Link'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function HelpPage() {
  return (
    <PageLayout>
      <ScrollView flex={1}>
        <YStack p="$4" gap="$4" maxW={800} mx="auto">
          <H1>Help & Support</H1>

          <H2>Getting Started</H2>
          <SizableText>
            Welcome to {APP_NAME}! Here are some quick tips to get you started.
          </SizableText>

          <H2>Creating Todos</H2>
          <SizableText>
            Use the input field at the top of the home screen to add new todos. Simply
            type what you need to do and press Add.
          </SizableText>

          <H2>Completing Todos</H2>
          <SizableText>
            Tap the checkbox next to any todo to mark it as complete. You can also delete
            todos by tapping the X button.
          </SizableText>

          <H2>Real-time Sync</H2>
          <SizableText>
            Your todos sync in real-time across all your devices. Sign in with the same
            account to see your todos everywhere.
          </SizableText>

          <H2>Need More Help?</H2>
          <YStack gap="$2">
            <Link href="https://github.com/tamagui/takeout/issues" target="_blank">
              <SizableText color="$blue10">Report an issue on GitHub →</SizableText>
            </Link>
          </YStack>
        </YStack>
      </ScrollView>
    </PageLayout>
  )
}
