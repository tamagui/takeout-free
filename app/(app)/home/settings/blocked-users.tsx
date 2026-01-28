import { useRouter } from 'one'
import { H1, SizableText, YStack } from 'tamagui'

import { ButtonSimple } from '~/interface/buttons/ButtonSimple'
import { PageLayout } from '~/interface/pages/PageLayout'

export default function BlockedUsersPage() {
  const router = useRouter()

  return (
    <PageLayout>
      <YStack flex={1} p="$4" gap="$4" items="center" justify="center">
        <H1>Blocked Users</H1>
        <SizableText color="$color10" text="center">
          You haven't blocked any users.
        </SizableText>
        <ButtonSimple size="large" onPress={() => router.back()}>
          Go Back
        </ButtonSimple>
      </YStack>
    </PageLayout>
  )
}
