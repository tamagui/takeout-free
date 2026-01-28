import { H1, ScrollView, SizableText, YStack } from 'tamagui'

import { Link } from '~/interface/app/Link'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function DocsIntroduction() {
  return (
    <PageLayout>
      <ScrollView flex={1}>
        <YStack p="$4" gap="$4" maxW={800} mx="auto">
          <H1>Documentation</H1>

          <SizableText size="$5" color="$color11">
            Takeout is a production-ready starter for building real-time, cross-platform
            applications with React Native and web.
          </SizableText>

          <YStack gap="$3" mt="$4">
            <SizableText size="$4" fontWeight="bold">
              Key Features:
            </SizableText>
            <SizableText>• Zero real-time sync across devices</SizableText>
            <SizableText>• Better Auth authentication</SizableText>
            <SizableText>• Tamagui UI components</SizableText>
            <SizableText>• One.js universal routing</SizableText>
            <SizableText>• Uncloud self-hosted deployment</SizableText>
          </YStack>

          <YStack gap="$3" mt="$4">
            <SizableText size="$4" fontWeight="bold">
              Learn more:
            </SizableText>
            <Link href="https://github.com/tamagui/takeout" target="_blank">
              <SizableText color="$blue10">GitHub Repository →</SizableText>
            </Link>
          </YStack>
        </YStack>
      </ScrollView>
    </PageLayout>
  )
}
