import { Container, Box, Heading, VStack, Button } from '@chakra-ui/react'
import { destroyCookie, parseCookies } from 'nookies';
import { useEffect, useRef, useState } from 'react'
import { Input, MessageList, MessageType } from 'react-chat-elements'
import { flushSync } from 'react-dom'
import randomName from 'random-name'
import * as Socket from 'socket.io-client'

import "react-chat-elements/dist/main.css"
import { GetServerSideProps } from 'next'
import auth from '../services/queries/auth';
import { useAuth } from '../contexts/authContext';
import { IUserData } from '../@types/user';

const userId = Math.random().toString()
const userName = randomName.place()

interface IHomeProps {
  user: IUserData;
}

export default function Home({ user }: IHomeProps) {
  const { setUser } = useAuth()

  useEffect(() => {
    if (user) setUser(user);
  }, [setUser, user])

  const [dataSource, setDataSource] = useState<MessageType[]>([])

  const messageListRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSendMessage() {
    const inputValue = inputRef.current?.value

    if (!messageListRef.current || !inputValue) return;

    const newMessage: MessageType = {
      id: userId,
      type: 'text',
      position: 'right',
      text: inputValue,
      title: userName,
      focus: false,
      date: new Date(),
      titleColor: 'blue',
      forwarded: false,
      replyButton: false,
      removeButton: false,
      status: 'received',
      notch: false,
      retracted: false,
    }

    fetch('http://localhost:3000/api/createMessage', {
      method: 'POST',
      body: JSON.stringify(newMessage),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    flushSync(() => {
      setDataSource(prev => [...prev, newMessage])
    })

    messageListRef.current.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const socket = Socket.connect('http://localhost:3000', {
      path: '/api/socketio',
    })

    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('message', (message: MessageType) => {
      if (message.id === userId) return;

      message.position = 'left'

      flushSync(() => {
        setDataSource(prev => [...prev, message])
      })

      messageListRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return (
    <Container h="100vh" w="full" maxW="43.75rem" mx="auto" py="3rem" px="1.5rem">
      <VStack spacing="0" h="full">
        <Box as="header" w="full">
          <Heading bgColor="blackAlpha.300" textAlign="center" borderTopLeftRadius="0.3rem" borderTopRightRadius="0.3rem" py="0.5rem">
            Chat
          </Heading>
        </Box>

        <Box
          as="main"
          w="full"
          bgColor="blackAlpha.100"
          p="1rem"
          flex="1"
          borderBottomLeftRadius="0.3rem"
          borderBottomRightRadius="0.3rem"
          overflowY="auto"
        >
          <MessageList
            referance={messageListRef}
            lockable={true}
            dataSource={dataSource}
          />
        </Box>

        <Box as="footer" w="full" py="0.5rem">
          <Input
            maxHeight={100}
            placeholder="Escrever uma mensagem..."
            referance={inputRef}
            multiline={true}
            rightButtons={(
              <Button colorScheme="green" onClick={handleSendMessage}>
                Enviar
              </Button>
            )}
            inputStyle={{
              minHeight: '41px',
              backgroundColor: 'rgba(0,0,0,16%)',
            }}
          />
        </Box>
      </VStack>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'chat@token': token } = parseCookies(context)


  if (!token) {
    return {
      props: {},
      redirect: {
        destination: '/login',
      },
    }
  }

  console.log("page: Home", token)

  const { data, isError } = await auth.loginWithToken(token)

  if (isError) {
    destroyCookie(context, 'chat@token')

    return {
      props: {},
      redirect: {
        destination: '/login',
      }
    }
  }

  if (data) {
    return {
      props: {
        user: data.user,
      }
    }
  }

  return {
    props: {},
  }
}
