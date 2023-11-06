export async function executeTransaction (transaction, arweave, dryRun) {
  if (dryRun) {
    console.log('===================================')
    console.log('Dry Run:', transaction.id)
    console.log('===================================')
    return transaction.id
  }
  console.log(`Posting tx ${transaction.id}...`)
  let uploader = await arweave.transactions.getUploader(transaction)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    )
  }
  console.log('Tx submitted:', transaction.id)
  return transaction.id
}
