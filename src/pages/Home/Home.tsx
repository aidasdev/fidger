import React from 'react'
import { Box, Heading, useDisclosure } from '@chakra-ui/react'
import { Button, Container, WalletModal } from 'components'
import Generator from './components/Generator'

const Home = () => {
  const { isOpen: isWalletOpen, onOpen: onWalletOpen, onClose: onWalletClose } = useDisclosure()

  return (
    <Container>
      <Box textAlign="center" py={24}>
        <Heading size="3xl">Fidger</Heading>
        <Heading mt={6} color="purple.600">
          Connecting to wallet made easy
        </Heading>
        <Button onClick={onWalletOpen} mt={6}>
          Try it!
        </Button>
      </Box>
      <Generator />
      <WalletModal isOpen={isWalletOpen} onClose={onWalletClose} />
    </Container>
  )
}

export default Home
