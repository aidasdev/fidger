import React, { useState } from 'react'
import { Box, Flex, Heading, Input } from '@chakra-ui/react'
import { Button } from 'components'
import QRCode from 'react-qr-code'
import { generateWallet } from 'utils/wallet'
import { useWallet } from 'providers/WalletProvider'

const Generator = () => {
  const { getAttestation, createAttestation } = useWallet()
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState<string | null>(null)
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState<string | null>(null)

  const handleSubmit = async () => {
    const { encryptedPrivateKey: encryptedKey, address: walletAddress } = generateWallet(password)
    try {
      await getAttestation()
      await createAttestation(walletAddress)
    } catch {
      console.error('Failed to create attestation')
    }
    setAddress(walletAddress)
    setEncryptedPrivateKey(encryptedKey)
  }

  return (
    <Box textAlign="center" my={16} py={6} px={4} backgroundColor="gray.100" borderRadius="xl">
      <Heading>Generate a new wallet</Heading>
      <Box mt={3}>Create a password</Box>
      <Box mt={2}>
        <Input
          onChange={e => setPassword(e.target.value)}
          backgroundColor="white"
          textAlign="center"
          maxW="md"
          placeholder="Password"
          type="password"
        />
      </Box>
      <Button mt={4} onClick={handleSubmit}>
        Create Wallet
      </Button>
      {address && encryptedPrivateKey && (
        <Box my={6} mx={4} p={6} backgroundColor="white" borderRadius="xl">
          <Heading>Your Wallet</Heading>
          <Flex justifyContent="center" mt={6}>
            <QRCode value={encryptedPrivateKey} />
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default Generator
