import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, VStack } from "@chakra-ui/react";
import { ArrowImport20Filled } from "@fluentui/react-icons";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  username: z.string().min(1, 'Informe seu usuário'),
  password: z.string().min(1, 'Informe sua senha'),
})

type ILoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ILoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function handleLogin(data: ILoginForm) {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    await delay(2000)
    console.log(data)
  }

  const usernameErrorMessage = errors['username']?.message
  const passwordErrorMessage = errors['password']?.message

  return (
    <VStack as="form" spacing="4" onSubmit={handleSubmit(handleLogin)}>
      <FormControl isInvalid={!!usernameErrorMessage}>
        <FormLabel>Usuário</FormLabel>
        <Input {...register('username')} type="text" />
        <FormErrorMessage>{usernameErrorMessage}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!passwordErrorMessage}>
        <FormLabel>Senha</FormLabel>
        <Input {...register('password')} type="password" />
        <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
      </FormControl>

      <Button type="submit" w="full" disabled={isSubmitting}>
        Entrar
        <Icon
          as={ArrowImport20Filled}
          boxSize="1.3rem"
          ml="0.4rem"
          mt="0.2rem"
        />
      </Button>
    </VStack>
  )
}