import React, { useState } from 'react'
import { Box, Heading, Input, useToast } from '@chakra-ui/react'
import { Button, Modal } from 'components'
import QrReader from 'react-qr-reader'
import { decryptMessage, encryptAuth } from 'utils/encryption'
import { useWallet } from 'providers/WalletProvider'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const QrLogin = ({ isOpen, onClose }: Props) => {
  const toast = useToast()
  const { connectWithPrivateKey } = useWallet()
  const [qrData, setQrData] = useState<string | null>(null)
  const [password, setPassword] = useState<string>('')

  const handleSubmit = () => {
    const tempQrData =
      'U2FsdGVkX1/Dmu6ktPjNaIhqZJJ1l/yGVpqE7wMWoiE6r5x4HUYVbERHWSx/Ok0bQ7EmjEr8OyojSs7Lm1bnOMvpDcGL3nFTNo9q/qdFBG5pGzybuhU05mo8MW3e2CnL'
    if (!tempQrData) {
      return
    }
    try {
      const privateKey = decryptMessage(tempQrData, password)
      const encryptedAuthData = encryptAuth({ m: tempQrData, k: password })
      sessionStorage.setItem('card', encryptedAuthData)
      connectWithPrivateKey(privateKey)
      onClose()
    } catch (e) {
      toast({ title: 'Wrong password', status: 'error' })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {!qrData && (
        <>
          <QrReader
            facingMode="environment"
            delay={300}
            onScan={result => setQrData(result)}
            onError={err => console.error(err)}
          />
          <Box textAlign="center" mt={4}>
            Position the QR code between the guidelines
          </Box>
        </>
      )}
      {qrData && (
        <Box textAlign="center">
          <Heading size="lg">Wallet detected</Heading>
          <Box mt={6}>Enter your wallet password</Box>
          <Box>
            <Input
              type="password"
              textAlign="center"
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              maxW="sm"
              mt={3}
            />
          </Box>
          <Button mt={3} onClick={handleSubmit}>
            Connect
          </Button>
        </Box>
      )}
    </Modal>
  )
}

export default QrLogin
