import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from 'styles/theme'
import { configureChains, createClient, mainnet, WagmiConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import { Buffer } from 'buffer'
import WalletProvider from 'providers/WalletProvider'
import { CHAIN_NAME, DEFAULT_RPC_PROVIDER, IS_PRODUCTION } from 'data/constants'
import { App } from './App'
import 'index.css'

window.Buffer = window.Buffer || Buffer

if (window.location.protocol !== 'https:' && IS_PRODUCTION) {
  window.location.replace(
    `https:${window.location.href.substring(window.location.protocol.length)}`,
  )
} else {
  const { chains, provider, webSocketProvider } = configureChains(
    [CHAIN_NAME === 'sepolia' ? sepolia : mainnet],
    [publicProvider()],
  )

  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          rpc: {
            1: DEFAULT_RPC_PROVIDER,
          },
          chainId: 1,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })

  createRoot(document.getElementById('root') as HTMLElement).render(
    <WagmiConfig client={client}>
      <WalletProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </WalletProvider>
    </WagmiConfig>,
  )
}
