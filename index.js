import { getInput, setOutput, setFailed } from '@actions/core'
import uploadCommand from './src/commands/uploadCommand.js'
import infoCommand from './src/commands/infoCommand.js'
import setCommand from './src/commands/setCommand.js'

try {
  const command = getInput('command')
  const directory = getInput('directory')
  const dryRun = getInput('dry-run').toLowerCase() === 'true'
  const privateKey = getInput('private-key')
  const manifestId = getInput('manifest-id')
  const antAddress = getInput('ant-address')

  switch (command) {
    case 'upload':
      await uploadCommand.handler({
        directory,
        antAddress,
        dryRun,
        privateKey,
      })
      break
    case 'address':
      const address = await infoCommand.handler({
        privateKey
      })
      setOutput('address', address)
      break
    case 'set':
      await setCommand.handler({
        antAddress,
        manifestId,
        privateKey,
        dryRun
      })
      break
    default:
      throw new Error(`${command} not supported`)
  }
} catch (error) {
  setFailed(error.message)
}
