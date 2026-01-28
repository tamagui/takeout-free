import { H1, H2, ScrollView, SizableText, YStack } from 'tamagui'

import { APP_NAME } from '~/constants/app'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <ScrollView flex={1}>
        <YStack p="$4" gap="$4" maxW={800} mx="auto">
          <H1>Privacy Policy</H1>
          <SizableText color="$color10">Last updated: January 2025</SizableText>

          <H2>1. Information We Collect</H2>
          <SizableText>
            We collect information you provide directly to us, such as when you create an
            account, use our services, or contact us for support.
          </SizableText>

          <H2>2. How We Use Your Information</H2>
          <SizableText>
            We use the information we collect to provide, maintain, and improve our
            services, and to communicate with you.
          </SizableText>

          <H2>3. Information Sharing</H2>
          <SizableText>
            We do not sell or share your personal information with third parties except as
            described in this policy.
          </SizableText>

          <H2>4. Data Security</H2>
          <SizableText>
            We implement appropriate security measures to protect your personal
            information.
          </SizableText>

          <H2>5. Your Rights</H2>
          <SizableText>
            You have the right to access, correct, or delete your personal information at
            any time.
          </SizableText>

          <H2>6. Contact Us</H2>
          <SizableText>
            If you have questions about this Privacy Policy, please contact us.
          </SizableText>
        </YStack>
      </ScrollView>
    </PageLayout>
  )
}
