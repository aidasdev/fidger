import { ethers } from 'ethers'
import { encryptMessage } from './encryption'

export const generateWallet = (password: string) => {
  const wallet = ethers.Wallet.createRandom()
  const encryptedPrivateKey = encryptMessage(wallet.privateKey, password)
  return { address: wallet.address, encryptedPrivateKey }
}
