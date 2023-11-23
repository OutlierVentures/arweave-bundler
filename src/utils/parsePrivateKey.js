import fs from 'fs'
export function parsePrivateKey(key) {
  let privateKey
  try {
    privateKey = key
      ? JSON.parse(Buffer.from(key, 'base64').toString('utf-8'))
      : JSON.parse(fs.readFileSync('wallet.json'))
  } catch (e) {
    throw new Error('missing private key as base64 or missing wallet.json')
  }
  return privateKey
}
