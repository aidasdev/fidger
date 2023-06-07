import React from 'react'
import { Box, Heading, SimpleGrid, useDisclosure } from '@chakra-ui/react'
import { Button, Container, WalletModal } from 'components'
import Generator from './components/Generator'

const Home = () => {
  const { isOpen: isWalletOpen, onOpen: onWalletOpen, onClose: onWalletClose } = useDisclosure()

  return (
    <Container>
      <Box textAlign="center" py={24}>
        <Heading size="3xl">Fidger</Heading>
        <Heading mt={6} color="purple.600">
          Helping Web3 projects to react crypto newcomers
        </Heading>
        <Button onClick={onWalletOpen} mt={6}>
          Try it!
        </Button>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        <Box textAlign="center">
          <Box className="fas fa-person fa-4x" mb={3} />
          <Heading size="lg">Onboard Easily</Heading>
          <Box mt={2}>Provide your users an easy access to your platform</Box>
        </Box>
        <Box textAlign="center">
          <Box className="fas fa-key fa-4x" mb={3} />
          <Heading size="lg">Validate Authenticity</Heading>
          <Box mt={2}>Avoid bots and validate authenticity of your client using EAS</Box>
        </Box>
        <Box textAlign="center">
          <Box className="fas fa-gift fa-4x" mb={3} />
          <Heading size="lg">Connect Physically</Heading>
          <Box mt={2}>Establish better trust with users by providing them physical card</Box>
        </Box>
      </SimpleGrid>
      <Generator />
      <WalletModal isOpen={isWalletOpen} onClose={onWalletClose} />
    </Container>
  )
}

export default Home
