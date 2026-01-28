import { H1, H2, ScrollView, SizableText, YStack } from 'tamagui'

import { APP_NAME } from '~/constants/app'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function TermsOfService() {
  return (
    <PageLayout>
      <ScrollView flex={1}>
        <YStack p="$4" gap="$4" maxW={800} mx="auto">
          <H1>Terms of Service</H1>
          <SizableText color="$color10">Last updated: January 2025</SizableText>

          <H2>1. Acceptance of Terms</H2>
          <SizableText>
            By accessing and using {APP_NAME}, you agree to be bound by these Terms of
            Service and all applicable laws and regulations.
          </SizableText>

          <H2>2. Use of Service</H2>
          <SizableText>
            You agree to use the service only for lawful purposes and in accordance with
            these Terms.
          </SizableText>

          <H2>3. User Accounts</H2>
          <SizableText>
            You are responsible for maintaining the confidentiality of your account and
            password.
          </SizableText>

          <H2>4. Content</H2>
          <SizableText>
            You retain ownership of any content you submit. By submitting content, you
            grant us a license to use, modify, and display that content.
          </SizableText>

          <H2>5. Termination</H2>
          <SizableText>
            We may terminate or suspend your account at any time for violations of these
            Terms.
          </SizableText>

          <H2>6. Contact</H2>
          <SizableText>
            If you have questions about these Terms, please contact us.
          </SizableText>
        </YStack>
      </ScrollView>
    </PageLayout>
  )
}
