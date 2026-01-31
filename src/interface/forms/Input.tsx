import { Input as TamaguiInput, styled, type GetProps, type TamaguiElement } from 'tamagui'

export const Input = styled(TamaguiInput, {
  height: 50,
  size: '$5',
  borderWidth: 0.5,
  placeholderTextColor: '$color8',

  focusVisibleStyle: {
    outlineWidth: 3,
    outlineStyle: 'solid',
    outlineColor: '$background04',
    outlineOffset: 1,
    borderWidth: 0.5,
    borderColor: '$color5',
  },
})

export type InputProps = GetProps<typeof Input>
