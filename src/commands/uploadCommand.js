import { upload } from '../upload.js'
import { parsePrivateKey } from '../utils/parsePrivateKey.js'
import { setRecord } from '../setRecord.js'

export const command = 'upload <directory>'
export const description = 'Upload a directory to Arweave as bundle'

export const builder = (yargs) => {
  yargs.positional('directory', {
    describe: 'The directory containing files to upload',
    type: 'string',
  })
  .option('private-key', {
    describe:
      'Path to the private key file (default: wallet.json) or base64 encoded private key (JWK)',
    type: 'string',
  })
  .option(
    'ant-address', {
      describe: 'Arweave Name Token (ANT) address of the record being updated',
      type: 'string',
    }
  )
  .option(
    'dry-run', {
      describe: 'Run everything except submitting the transaction',
      type: 'boolean',
      default: false,
    }
  )
}

export const handler = async (argv) => {
  const { directory, antAddress, dryRun } = argv
  const privateKey = parsePrivateKey(argv.privateKey)
  if (antAddress) {
    const { result, manifestId } = await upload(directory, privateKey, dryRun)
    const response = await setRecord(antAddress, manifestId, privateKey, dryRun)
    return { result, response, manifestId }
  } else {
    return await upload(directory, privateKey, dryRun)
  }
}

export default {
  command,
  description,
  builder,
  handler,
}
