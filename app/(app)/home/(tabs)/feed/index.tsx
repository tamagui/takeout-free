import { memo, useState } from 'react'
import { SizableText, Spinner, XStack, YStack } from 'tamagui'

import { useTodos } from '~/features/todo/useTodos'
import { ButtonSimple } from '~/interface/buttons/ButtonSimple'
import { Input } from '~/interface/forms/Input'
import { H3, H5 } from '~/interface/text/Headings'

export const HomePage = memo(() => {
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo } = useTodos()
  const [newTodoText, setNewTodoText] = useState('')

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return
    addTodo(newTodoText.trim())
    setNewTodoText('')
  }

  return (
    <YStack
      position="relative"
      flexBasis="auto"
      bg="$background"
      width="100vw"
      ml="50%"
      transform="translateX(-50%)"
    >
      <YStack pb="$10" gap="$4" mx="auto" px="$4" width="100%" $xl={{ maxW: 560 }}>
        <H3 mt="$4">Todo Demo</H3>

        <XStack gap="$2" width="100%">
          <Input
            flex={1}
            placeholder="What needs to be done?"
            value={newTodoText}
            onChangeText={setNewTodoText}
            onSubmitEditing={handleAddTodo}
          />
          <ButtonSimple onPress={handleAddTodo} theme="blue">
            Add
          </ButtonSimple>
        </XStack>

        {isLoading ? (
          <YStack p="$4" items="center" justify="center">
            <Spinner size="small" />
          </YStack>
        ) : todos.length === 0 ? (
          <YStack p="$4" items="center" justify="center" mt="$4">
            <H5>No todos yet - add one above!</H5>
          </YStack>
        ) : (
          <YStack gap="$2">
            {todos.map((todo) => (
              <XStack
                key={todo.id}
                p="$3"
                bg="$color2"
                rounded="$4"
                items="center"
                gap="$3"
                pressStyle={{ opacity: 0.8 }}
              >
                <ButtonSimple
                  size="small"
                  circular
                  theme={todo.completed ? 'green' : 'gray'}
                  onPress={() => toggleTodo(todo.id, !todo.completed)}
                >
                  {todo.completed ? '✓' : ' '}
                </ButtonSimple>
                <YStack flex={1}>
                  <XStack
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      opacity: todo.completed ? 0.6 : 1,
                    }}
                  >
                    {todo.text}
                  </XStack>
                </YStack>
                <ButtonSimple
                  size="small"
                  theme="red"
                  onPress={() => deleteTodo(todo.id)}
                >
                  ✕
                </ButtonSimple>
              </XStack>
            ))}
          </YStack>
        )}

        <YStack mt="$4" p="$3" bg="$color2" rounded="$4">
          <H5 mb="$2">About this demo</H5>
          <YStack gap="$1" opacity={0.7}>
            <SizableText>This is a simple todo list demonstrating:</SizableText>
            <SizableText>• Zero real-time sync (changes sync across devices)</SizableText>
            <SizableText>• Better Auth authentication</SizableText>
            <SizableText>• Tamagui UI components</SizableText>
            <SizableText>• One.js universal routing</SizableText>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  )
})
