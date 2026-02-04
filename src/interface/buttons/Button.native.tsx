import { Button as TamaguiButton, styled, type GetProps } from 'tamagui'

export const Button = styled(TamaguiButton, {
  borderWidth: 0,

  variants: {
    variant: {
      default: {
        bg: '$color3',
        hoverStyle: { bg: '$color4' },
        pressStyle: { bg: '$color2', opacity: 0.8 },
      },
      outlined: {
        bg: 'transparent',
        borderWidth: 2,
        borderColor: '$color6',
        hoverStyle: { borderColor: '$color8' },
        pressStyle: { borderColor: '$color4', opacity: 0.8 },
      },
      transparent: {
        bg: 'transparent',
        hoverStyle: { bg: '$color2' },
        pressStyle: { bg: '$color1', opacity: 0.8 },
      },
      floating: {
        bg: '$color4',
        shadowColor: '$shadow2',
        shadowRadius: 5,
        shadowOffset: { height: 2, width: 0 },
        hoverStyle: { bg: '$color5' },
        pressStyle: { bg: '$color3', opacity: 0.9 },
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
  },
})

export type ButtonProps = GetProps<typeof Button>
