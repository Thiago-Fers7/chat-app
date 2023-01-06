import { Center, Container, Tab, TabList, TabPanel, TabPanels, Tabs, } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { useEffect } from "react";
import { IUserData } from "../@types/user";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../contexts/authContext";
import auth from "../services/queries/auth";

interface ILoginProps {
  user: IUserData;
}

export default function Login({ user }: ILoginProps) {
  const { setUser } = useAuth()

  useEffect(() => {
    if (user) setUser(user);
  }, [setUser, user])

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'chat@token': token } = parseCookies(context)

  if (!token) {
    return {
      props: {},
    }
  }

  console.log("page: Login", token)


  const { data, isError } = await auth.loginWithToken(token)

  if (isError) {
    destroyCookie(context, 'chat@token')
  }

  if (data) {
    return {
      props: {
        user: data.user,
      },
      redirect: {
        destination: '/',
      }
    }
  }

  return {
    props: {},
  }
}
