import { upload } from '../upload.js'

export const command = 'upload <directory>'
export const description = 'Upload a directory to Arweave as bundle'

export const builder = (yargs) => {
  yargs.positional('directory', {
    describe: 'The directory containing files to upload',
    type: 'string',
  })
}

export const handler = async (argv) => {
  const { directory, dryRun } = argv
  let privateKey
  try {
    privateKey = argv.privateKey
      ? JSON.parse(Buffer.from(argv.privateKey, 'base64').toString('utf-8'))
      : JSON.parse(fs.readFileSync('wallet.json'))
  } catch (e) {
    throw new Error(
      'missing private key as base64 of a wallet.json or missing wallet.json',
    )
  }
  return await upload(directory, privateKey, dryRun)
}

export default {
    command,
    description,
    builder,
    handler
}