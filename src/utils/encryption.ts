import CryptoJS from 'crypto-js'

export const encryptMessage = (message, key) => {
  const encrypted = CryptoJS.AES.encrypt(message, key).toString()
  return encrypted
}

export const decryptMessage = (encryptedMessage, key) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8)
  return decrypted
}

export const encryptAuth = authData =>
  CryptoJS.AES.encrypt(JSON.stringify(authData), process.env.REACT_APP_KEY).toString()

export const decryptAuth = encryptedAuthData => {
  const bytes = CryptoJS.AES.decrypt(encryptedAuthData, process.env.REACT_APP_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
