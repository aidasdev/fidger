import { ethers } from 'ethers'

export const getEllipsisText = (str: string | null, n = 6) => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`
  }
  return ''
}

export const fromWei = wei => {
  if (!wei) {
    return 0
  }
  return parseFloat(ethers.utils.formatEther(wei))
}
