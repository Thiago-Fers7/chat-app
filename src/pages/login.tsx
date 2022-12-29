import { Center, Container, Tab, TabList, TabPanel, TabPanels, Tabs, } from "@chakra-ui/react";
import { LoginForm } from "../Components/LoginForm";
import { RegisterForm } from "../Components/RegisterForm";

export default function Login() {
  return (
    <Center height="100vh" w="100vw">
      <Container maxWidth="27rem" height="34rem">
        <Tabs variant="enclosed">
          <TabList>
            <Tab flex="1">Entrar</Tab>
            <Tab flex="1">Criar</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <LoginForm />
            </TabPanel>

            <TabPanel>
              <RegisterForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Center>
  )
}