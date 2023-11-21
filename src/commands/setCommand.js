import { setRecord } from '../setRecord.js'

export const command = 'set'
export const description = 'Set the Arweave Name Token Record to the transaction id' 

export const builder = (yargs) => {
  yargs
  .option('private-key', {
    describe:
      'Path to the private key file (default: wallet.json) or base64 encoded private key (JWK)',
    type: 'string',
  })
  .option(
    'ant-address', {
      describe: 'Arweave Name Token (ANT) address of the record being updated',
      type: 'string',
      demandOption: true,
    }
  )
  .option(
    'dry-run', {
      describe: 'Run everything except submitting the transaction',
      type: 'boolean',
      default: false,
    }
  )
  .option(
    'manifest-id', {
        describe: 'Target transaction id to update the ANT record with',
        type: 'string',
        demandOption: true,
    }
  )
}

export const handler = async (argv) => {
  const { antAddress, manifestId, dryRun } = argv
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
  return await setRecord(antAddress, manifestId, privateKey, dryRun)
}

export default {
    command,
    description,
    builder,
    handler
}