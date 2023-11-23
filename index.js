import { getInput, setOutput, setFailed } from '@actions/core'
import { upload } from './src/upload.js'
import { getAddress } from './src/utils/info.js'
import {parsePrivateKey} from './src/utils/parsePrivateKey.js'

try {
  const command = getInput('command')
  const directory = getInput('directory')
  const dryRun = getInput('dry-run')
  const base64PrivateKey = getInput('private-key')

  const privateKey = parsePrivateKey(base64PrivateKey)

  switch (command) {
    case 'upload':
      await upload(directory, privateKey, dryRun.toLowerCase() === 'true')
      break
    case 'address':
      console.log('address:', getAddress(privateKey))
      setOutput('address', getAddress(privateKey))
      break
    default:
      throw new Error(`${command} not supported`)
  }
} catch (error) {
  setFailed(error.message)
}
