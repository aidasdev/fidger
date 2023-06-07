import React, { useEffect, useState } from 'react'
import { Box, Heading, useDisclosure } from '@chakra-ui/react'
import { Button, CopyButton, Loader, Modal, QrLogin } from 'components'
import { useWallet } from 'providers/WalletProvider'
import { fromWei, getEllipsisText } from 'utils/formatters'
import { fetchBalance } from '@wagmi/core'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const WalletModal = ({ isOpen, onClose }: Props) => {
  const { account, isAuthLoading, connect, disconnect } = useWallet()
  const { isOpen: isQrLoginOpen, onOpen: onQrLoginOpen, onClose: onQrLoginClose } = useDisclosure()
  const [nativeBalance, setNativeBalance] = useState<string | null>(null)

  const getBalance = async () => {
    if (!account) {
      return
    }
    const nativeBalanceResult = await fetchBalance({
      address: account as any,
    })
    setNativeBalance(fromWei(nativeBalanceResult.value).toFixed(2))
  }

  useEffect(() => {
    getBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const wallets = [
    {
      icon: '/images/logo.svg',
      label: 'Fidger',
      handleClick: () => {
        onQrLoginOpen()
      },
    },
    {
      icon: '/images/wallets/metamask.svg',
      label: 'Metamask',
      handleClick: () => connect('metamask'),
    },
    {
      icon: '/images/wallets/walletconnect.png',
      label: 'WalletConnect',
      handleClick: () => connect('walletconnect'),
    },
    {
      icon: '/images/wallets/trust.png',
      label: 'Trustwallet',
      handleClick: () => connect('walletconnect'),
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isAuthLoading && <Loader text="Authenticating" />}
      {account && !isAuthLoading && (
        <Box>
          <Heading size="md" color="gray.500" textAlign="center">
            <CopyButton value={account}>{getEllipsisText(account, 8)}</CopyButton>
          </Heading>
          <Box textAlign="center">
            <Heading size="md" mt={6}>
              Balance
            </Heading>
            <Heading size="lg" mt={2}>
              {nativeBalance ? `${nativeBalance} ETH` : '-'}
            </Heading>
            <Box mt={3}>
              <Button variant="link" colorScheme="purple" onClick={getBalance}>
                Refresh funds
              </Button>
            </Box>
            <Box mt={3}>
              <Button onClick={() => disconnect()}>Logout</Button>
            </Box>
          </Box>
        </Box>
      )}
      {!account && !isAuthLoading && (
        <Box>
          <Heading size="lg" textAlign="center">
            Connect your wallet
          </Heading>
          <Box mt={6}>
            {wallets.map(wallet => (
              <Button
                colorScheme="gray"
                image={wallet.icon}
                imageWidth="35px"
                justifyContent="start"
                w="full"
                mt={3}
                py={8}
                onClick={() => wallet.handleClick()}
              >
                {wallet.label}
              </Button>
            ))}
          </Box>
          <QrLogin isOpen={isQrLoginOpen} onClose={onQrLoginClose} />
        </Box>
      )}
    </Modal>
  )
}

export default WalletModal
