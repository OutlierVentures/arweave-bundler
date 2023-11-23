import { upload } from '../upload.js'
import { parsePrivateKey } from '../utils/parsePrivateKey.js'

export const command = 'upload <directory>'
export const description = 'Upload a directory to Arweave as bundle'

export const builder = (yargs) => {
  yargs
    .positional('directory', {
      describe: 'The directory containing files to upload',
      type: 'string',
    })
    .option('private-key', {
      describe:
        'Path to the private key file (default: wallet.json) or base64 encoded private key (JWK)',
      type: 'string',
    })
    .option('dry-run', {
      describe: 'run everything expect submitting the transaction',
      type: 'boolean',
      default: false,
    })
}

export const handler = async (argv) => {
  const { directory } = argv
  const privateKey = parsePrivateKey(argv)
  const dryRun = (argv.dryRun || 'false').toLowerCase() === 'true'
  return await upload(directory, privateKey, dryRun)
}

export default {
  command,
  description,
  builder,
  handler,
}
