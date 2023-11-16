import { ArweaveSigner, bundleAndSignData } from 'arbundles'
import Arweave from 'arweave'
import { buildManifest } from './utils/buildManifest.js'
import { createDataItem } from './utils/createDataItem.js'
import { executeTransaction } from './utils/executeTransaction.js'
import { sleep } from './utils/sleep.js'
import { traverseDirectory } from './utils/traverseDirectory.js'

export async function upload(buildDir, privateKey, dryRun) {
  console.log(`Starting upload of '${buildDir}' directory`)
  const signer = new ArweaveSigner(privateKey)

  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  })

  const files = await traverseDirectory(buildDir)
  const dataItems = files
    .map((file) => createDataItem(signer)(file))
    .map((file) => file.dataItem)

  // Signing dataItems. File references will be updated too
  const dataItemsBundle = await bundleAndSignData(dataItems, signer)

  //build the manifest from files that contain the dataItems as well
  const manifestDataItem = await buildManifest(files, buildDir, signer)
  // merge the two bundles ( files and manifest ) together
  const bundles = dataItemsBundle.items.concat([manifestDataItem])
  const bundle = await bundleAndSignData(bundles, signer)

  console.log(`manifest tx ${manifestDataItem.id}`)

  const tx = await arweave.createTransaction({ data: bundle.getRaw() })
  tx.addTag('Bundle-Format', 'binary')
  tx.addTag('Bundle-Version', '2.0.0')
  tx.addTag('Manifest-ID', manifestDataItem.id)

  // Workaround use Arweave.js lib to sign with the JWK rather than `signer` from ArweaveSigner
  await arweave.transactions.sign(tx, privateKey)

  const txId = await executeTransaction(tx, arweave, dryRun)

  if (dryRun) {
    return 1
  }
  console.log(`Wait for tx ${txId}...`)
  let response = await arweave.transactions.getStatus(txId)

  console.log(
    '----> number_of_confirmations:',
    response.confirmed?.number_of_confirmations,
  )
  while (!response.confirmed?.number_of_confirmations > 0) {
    console.log(
      `${txId} confirmations: ${response.confirmed.number_of_confirmations}`,
    )
    await sleep(1000 * 5)
    response = await arweave.transactions.getStatus(txId)
  }
  console.log(`https://viewblock.io/arweave/tx/${txId}`)
  console.log(`${txId} confirmed`)
  console.log(
    `   ${txId} number_of_confirmations:`,
    response.confirmed.number_of_confirmations,
  )
  console.log(`   tx ${txId} block_height:`, response.confirmed.block_height)
  console.log(
    `   tx ${txId} block_indep_hash:`,
    response.confirmed.block_indep_hash,
  )
  return response.confirmed
}
