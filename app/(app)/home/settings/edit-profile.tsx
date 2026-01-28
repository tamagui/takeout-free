import { useRouter } from 'one'
import { H1, SizableText, YStack } from 'tamagui'

import { ButtonSimple } from '~/interface/buttons/ButtonSimple'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function EditProfilePage() {
  const router = useRouter()

  return (
    <PageLayout>
      <YStack flex={1} p="$4" gap="$4" items="center" justify="center">
        <H1>Edit Profile</H1>
        <SizableText color="$color10" text="center">
          Profile editing coming soon.
        </SizableText>
        <ButtonSimple size="large" onPress={() => router.back()}>
          Go Back
        </ButtonSimple>
      </YStack>
    </PageLayout>
  )
}
