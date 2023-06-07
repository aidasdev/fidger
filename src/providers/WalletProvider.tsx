import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers, Signer } from 'ethers'
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk'
import { useAccount, useConnect, useDisconnect, useSigner } from 'wagmi'
import { DEFAULT_RPC_PROVIDER } from 'data/constants'
import { decryptAuth, decryptMessage } from 'utils/encryption'

type WalletInfo = {
  account?: string
  isAuthLoading: boolean
  connect: (provider: 'metamask' | 'walletconnect') => void
  connectWithPrivateKey: (privateKey: string) => void
  disconnect: () => void
  getAttestation: () => void
  createAttestation: (address) => void
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
  getAttestation: () => {},
  createAttestation: address => {},
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

  const getEas = () => {
    const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
    const attestationSigner = signer ?? wagmiSigner
    if (!attestationSigner) {
      return null
    }

    const eas = new EAS(EASContractAddress)
    eas.connect(attestationSigner)
    return eas
  }

  const getAttestation = async () => {
    const eas = getEas()
    if (!eas) {
      return
    }

    const uid = '0xb67693f606e34fec40149af939ebda9586698d8f8a3c76e10a19c265dbefabaf'

    const attestation = await eas.getAttestation(uid)

    console.log('Attestation:', attestation)
  }

  const createAttestation = async address => {
    const eas = getEas()
    if (!eas) {
      return
    }
    const attestationSigner = signer ?? wagmiSigner
    if (!attestationSigner) {
      return
    }

    const schemaEncoder = new SchemaEncoder(
      'address Project,uint32 UID,bool isDelivered,bytes32 CardInfo',
    )
    const encodedData = schemaEncoder.encodeData([
      { name: 'Project', value: 1, type: 'uint32' },
      { name: 'UID', value: 1, type: 'uint32' },
      { name: 'DeliveryStatus', value: 1, type: 'uint32' },
    ])

    const schemaUID = '0xb67693f606e34fec40149af939ebda9586698d8f8a3c76e10a19c265dbefabaf'

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address,
        expirationTime: 0,
        revocable: false,
        data: encodedData,
      },
    })

    const newAttestationUID = await tx.wait()

    console.log('New attestation UID:', newAttestationUID)
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
        getAttestation,
        createAttestation,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider
