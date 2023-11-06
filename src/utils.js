import { createData } from 'arbundles'
import fs from 'node:fs/promises'
import path from 'node:path'

export function pathToURL(filePath, basePath) {
  // Resolve the absolute path of the file
  if (!basePath) throw new Error('Missing basePath')
  const absolutePath = path.resolve(filePath)

  // If basePath is provided, remove it from the absolute path
  const relativePath = path.relative(basePath, absolutePath)

  // Convert the relative path to URL without the protocol
  const fileUrl = relativePath.split(path.sep).join('/')

  return fileUrl
}

/*
    params - path of directory to traverse
    returns - list of file paths in the directoryPath
*/

export async function traverseDirectory(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath)
    // console.log('traverseDirectory::', { files })
    const fileList = []

    for (const file of files) {
      const filePath = path.join(directoryPath, file)
      const stats = await fs.stat(filePath)

      if (stats.isDirectory()) {
        const nestedFiles = await traverseDirectory(filePath)
        fileList.push(...nestedFiles)
      } else {
        const data = await fs.readFile(filePath)
        const o = {
          path: filePath,
          data,
          size: stats.size,
        }
        fileList.push(o)
      }
    }

    return fileList
  } catch (error) {
    throw new Error('Error reading directory: ' + error.message)
  }
}

export async function executeTransaction(transaction, arweave, dryRun) {
  if(dryRun){
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
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`,
    )
  }
  console.log('Tx submitted:', transaction.id)
  return transaction.id
}

export async function buildManifest(files, buildDir, signer) {
  // list of strings
  const paths = {}
  for (const file of files) {
    const url = pathToURL(file.path, buildDir)
    console.log(
      'adding to the manifest:',
      file.dataItem.id,
      file.dataItem.tags,
      url,
    )
    paths[url] = { id: file.dataItem.id }
  }

  // Convert the paths object and other properties into a JSON string
  const manifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    index: {
      path: 'index.html',
    },
    paths: paths,
  }

  const encodedManifest = JSON.stringify(manifest, null, 2) // Pretty print the JSON
  const manifestDataItem = createData(encodedManifest, signer, {
    tags: [
      { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
    ],
  })
  return manifestDataItem
}

export function getContentTypeByExtension(ext) {
  switch (ext.toLowerCase()) {
    case '.html':
      return 'text/html'
    case '.txt':
      return 'text/plain'
    case '.css':
      return 'text/css'
    case '.js':
      return 'application/javascript'
    case '.js.map':
      return 'application/json'
    case '.json':
      return 'application/json'
    case '.png':
      return 'image/png'
    case '.ico':
      return 'image/x-icon'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    default:
      return 'application/octet-stream' // default to binary data
  }
}

export function createDataItem(signer) {
  /*
    const file = {
        path: filePath,
        data,
        size: stats.size,
    }
  */
  return (file) => {
    // add the dataItem to the file
    const contentType = getContentTypeByExtension(path.extname(file.path))
    file.dataItem = createData(file.data, signer, {
      tags: [{ name: 'Content-Type', value: contentType }],
    })
    return file
  }
}

export function sleep(ms) {
  return new Promise((resolve) => setInterval(resolve, ms))
}
