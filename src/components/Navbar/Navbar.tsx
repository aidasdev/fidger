import React from 'react'
import { Flex, useDisclosure, Image } from '@chakra-ui/react'
import { Button, Container, WalletModal } from 'components'
import { useWallet } from 'providers/WalletProvider'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { account } = useWallet()
  const { isOpen: isWalletOpen, onOpen: onWalletOpen, onClose: onWalletClose } = useDisclosure()

  return (
    <>
      <Container>
        <Flex justifyContent="space-between" alignItems="center" w="100%" h="80px">
          <Link to="/">
            <Image src="/images/logo.svg" h="40px" />
          </Link>
          <Flex justifyContent="end" alignItems="center" gap={3}>
            <Button colorScheme="gray" onClick={onWalletOpen}>
              {account ? 'My Wallet' : 'Connect Wallet'}
            </Button>
          </Flex>
        </Flex>
      </Container>
      <WalletModal isOpen={isWalletOpen} onClose={onWalletClose} />
    </>
  )
}

export default Navbar
