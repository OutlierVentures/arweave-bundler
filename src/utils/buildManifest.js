import { createData } from 'arbundles'
import { pathToURL } from './pathToURL.js'

export async function buildManifest (files, buildDir, signer) {
  // list of strings
  const paths = {}
  for (const file of files) {
    const url = pathToURL(file.path, buildDir)
    console.log(
      'adding to the manifest:',
      file.dataItem.id,
      file.dataItem.tags,
      url
    )
    paths[url] = { id: file.dataItem.id }
  }

  // Convert the paths object and other properties into a JSON string
  const manifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    index: {
      path: 'index.html'
    },
    paths: paths
  }

  const encodedManifest = JSON.stringify(manifest, null, 2) // Pretty print the JSON
  const manifestDataItem = createData(encodedManifest, signer, {
    tags: [
      { name: 'Content-Type', value: 'application/x.arweave-manifest+json' }
    ]
  })
  return manifestDataItem
}
