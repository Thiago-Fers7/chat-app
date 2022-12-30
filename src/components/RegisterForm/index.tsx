import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";

export function RegisterForm() {
  return (
    <VStack as="form" spacing="4">
      <FormControl>
        <FormLabel>Novo usuário</FormLabel>
        <Input type="text" placeholder="ex: joao_mb" />
      </FormControl>

      <FormControl>
        <FormLabel>Senha</FormLabel>
        <Input type="password" />
      </FormControl>

      <FormControl>
        <FormLabel>Confirmar Senha</FormLabel>
        <Input type="password" />
      </FormControl>

      <Button w="full" >Criar</Button>
    </VStack>
  )
}