import { getInput, setOutput, setFailed } from '@actions/core'
import { setRecord } from './src/setRecord.js'
import { upload } from './src/upload.js'
import { getAddress } from './src/utils/info.js'
import { parsePrivateKey } from './src/utils/parsePrivateKey.js'

try {
  const command = getInput('command')
  const directory = getInput('directory')
  const dryRun = getInput('dry-run')
  const base64PrivateKey = getInput('private-key')
  const antAddress = getInput('ant-address')
  const manifestId = getInput('manifest-id')

  const privateKey = parsePrivateKey(base64PrivateKey)

  switch (command) {
    case 'upload':
      await upload(directory, privateKey, dryRun.toLowerCase() === 'true')
      break
    case 'address':
      console.log('address:', getAddress(privateKey))
      setOutput('address', getAddress(privateKey))
      break
    case 'set':
      await setRecord(antAddress, manifestId, privateKey,dryRun)
      break
    default:
      throw new Error(`${command} not supported`)
  }
} catch (error) {
  setFailed(error.message)
}
