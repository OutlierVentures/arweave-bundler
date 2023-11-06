import { getInput, setOutput, setFailed } from '@actions/core'
import { upload } from './src/upload.js'

try {
  const directory = getInput('directory')
  const dryRun = getInput('dry-run')
  const base64PrivateKey = getInput('private-key')

  let privateKey
  try {
    privateKey = JSON.parse(
      Buffer.from(base64PrivateKey, 'base64').toString('utf-8'),
    )
  } catch (e) {
    throw new Error(
      `Missing private key or not encoded as base64: ${e.message}`,
    )
  }

  await upload(directory, privateKey, dryRun)
} catch (error) {
  setFailed(error.message)
}
