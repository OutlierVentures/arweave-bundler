import { parsePrivateKey } from '../utils/parsePrivateKey.js'
import { getAddress } from '../utils/info.js'

export const command = 'address'
export const description = 'Print the address of the wallet'

export const builder = (yargs) => {
  yargs.option('private-key', {
    describe:
      'Path to the private key file (default: wallet.json) or base64 encoded private key (JWK)',
    type: 'string',
  })
}

export const handler = async (argv) => {
  const privateKey = parsePrivateKey(argv)
  const address = getAddress(privateKey)
  console.log(address)
  return true
}

export default {
  command,
  description,
  builder,
  handler,
}
