import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers, Signer } from 'ethers'
import { useAccount, useConnect, useDisconnect, useSigner } from 'wagmi'
import { DEFAULT_RPC_PROVIDER } from 'data/constants'
import { decryptAuth, decryptMessage } from 'utils/encryption'

type WalletInfo = {
  account?: string
  isAuthLoading: boolean
  connect: (provider: 'metamask' | 'walletconnect') => void
  connectWithPrivateKey: (privateKey: string) => void
  disconnect: () => void
}

type Props = {
  children: any
}

const initialValue = {
  account: undefined,
  user: undefined,
  isAuthLoading: false,
  connect: () => {},
  connectWithPrivateKey: () => {},
  disconnect: () => {},
}

const WalletContext = createContext<WalletInfo>(initialValue)

export const useWallet = () => {
  return useContext(WalletContext)
}

const WalletProvider = ({ children }: Props) => {
  const { address: wagmiAccount } = useAccount()
  const { data: wagmiSigner } = useSigner()
  const { connect: wagmiConnect, connectors, isError: isWagmiError } = useConnect()
  const { disconnect: wagmiDisconnect } = useDisconnect()

  const [account, setAccount] = useState<string | undefined>(undefined)
  const [signer, setSigner] = useState<Signer | undefined>(undefined)
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false)

  const connect = (type: 'metamask' | 'walletconnect') => {
    setIsAuthLoading(true)
    if (type === 'metamask') {
      wagmiConnect({ connector: connectors[0] })
    }
    if (type === 'walletconnect') {
      wagmiConnect({ connector: connectors[1] })
    }
  }

  const connectWithPrivateKey = async (privateKey: string) => {
    setIsAuthLoading(true)
    const provider = new ethers.providers.JsonRpcProvider(DEFAULT_RPC_PROVIDER)
    const ethersWallet = new ethers.Wallet(privateKey, provider)
    const address = await ethersWallet.getAddress()
    setAccount(address)
    setSigner(ethersWallet)
  }

  const resetAuthState = () => {
    wagmiDisconnect()
    sessionStorage.removeItem('card')
    setAccount(undefined)
    setSigner(undefined)
    setIsAuthLoading(false)
  }

  const disconnect = () => {
    resetAuthState()
  }

  useEffect(() => {
    const encryptedAuthData = sessionStorage.getItem('card')
    if (encryptedAuthData) {
      const authDataString = decryptAuth(encryptedAuthData)
      const authData = JSON.parse(authDataString)
      const { m, k } = authData
      if (m && k) {
        const privateKey = decryptMessage(m, k)
        connectWithPrivateKey(privateKey)
      }
    }
  }, [])

  useEffect(() => {
    if (account && signer) {
      setAccount(account)
      setIsAuthLoading(false)
    }
  }, [account, signer])

  useEffect(() => {
    if (wagmiAccount && wagmiSigner) {
      setAccount(wagmiAccount)
      setSigner(wagmiSigner)
      setIsAuthLoading(false)
    }
  }, [wagmiAccount, wagmiSigner])

  useEffect(() => {
    if (isWagmiError) {
      resetAuthState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWagmiError])

  return (
    <WalletContext.Provider
      value={{
        account,
        isAuthLoading,
        connect,
        connectWithPrivateKey,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider
