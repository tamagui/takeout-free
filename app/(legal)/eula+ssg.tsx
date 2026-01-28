import { H1, H2, ScrollView, SizableText, YStack } from 'tamagui'

import { APP_NAME } from '~/constants/app'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function EULA() {
  return (
    <PageLayout>
      <ScrollView flex={1}>
        <YStack p="$4" gap="$4" maxW={800} mx="auto">
          <H1>End User License Agreement</H1>
          <SizableText color="$color10">Last updated: January 2025</SizableText>

          <H2>1. License Grant</H2>
          <SizableText>
            {APP_NAME} grants you a limited, non-exclusive, non-transferable license to
            use the application.
          </SizableText>

          <H2>2. Restrictions</H2>
          <SizableText>
            You may not copy, modify, distribute, sell, or lease any part of our services
            or software.
          </SizableText>

          <H2>3. Updates</H2>
          <SizableText>
            We may update the application from time to time. Continued use constitutes
            acceptance of any updates.
          </SizableText>

          <H2>4. Termination</H2>
          <SizableText>
            This license is effective until terminated. Your rights under this license
            will terminate automatically if you fail to comply with any of its terms.
          </SizableText>
        </YStack>
      </ScrollView>
    </PageLayout>
  )
}
