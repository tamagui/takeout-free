import {
  router,
  useLinkTo,
  useNavigation,
  type Href,
  type LinkProps as OneLinkProps,
} from 'one'
import { SizableText, useDebounce, type SizableTextProps } from 'tamagui'

type ResetStackConfig = {
  index?: number
  routes: Array<{ key: string; name: string; params?: any }>
}

export type LinkProps = OneLinkProps<Href> &
  SizableTextProps & {
    delayNavigation?: number | boolean
    resetStack?: boolean | ResetStackConfig
    hideExternalIcon?: boolean
    linkMeta?: LinkMeta
  }

export type LinkMeta =
  | { type: 'none' }
  | {
      type: 'open-thread'
      threadId: string
    }

let lastLinkMeta: LinkMeta = { type: 'none' }
let lastLinkMetaAt = 0

export function getLastLinkMeta() {
  return {
    ...lastLinkMeta,
    at: lastLinkMetaAt,
    get recent() {
      return Date.now() - lastLinkMetaAt < 2000
    },
  }
}

export const Link = ({
  href,
  replace,
  asChild,
  disabled,
  passThrough,
  delayNavigation,
  resetStack,
  linkMeta,
  target,
  children,
  ...props
}: LinkProps) => {
  const linkProps = useLinkTo({ href: href as string, replace })
  const navigation = useNavigation()

  const handlePress = useDebounce(
    (e) => {
      props.onPress?.(e)

      if (e.defaultPrevented) {
        return
      }

      if (resetStack) {
        e.preventDefault()

        if (typeof resetStack === 'object') {
          navigation.reset({
            index: resetStack.index ?? 0,
            routes: resetStack.routes as any,
          })
        } else {
          const routeName = href.toString().replace(/^\//, '')
          navigation.reset({
            index: 0,
            routes: [{ key: routeName, name: routeName } as any],
          })
        }
        return
      }

      if (delayNavigation) {
        e.preventDefault()
        setTimeout(
          () => {
            if (replace) {
              router.replace(href)
            } else {
              router.navigate(href)
            }
          },
          typeof delayNavigation === 'number' ? delayNavigation : 50
        )
        return
      }

      if (replace) {
        e.preventDefault()
        router.replace(href)
        return
      }

      linkProps.onPress(e)
    },
    1000,
    {
      leading: true,
    }
  )

  if (passThrough) {
    return children
  }

  return (
    <SizableText
      disabled={!!disabled}
      asChild={asChild ? 'except-style' : false}
      {...props}
      {...linkProps}
      onPressIn={() => {
        lastLinkMeta = linkMeta || { type: 'none' }
        lastLinkMetaAt = Date.now()
      }}
      onPress={handlePress}
    >
      {children}
    </SizableText>
  )
}
