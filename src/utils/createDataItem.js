import { createData } from 'arbundles'
import path from 'node:path'
import { getContentTypeByExtension } from './getContentTypeByExtension.js'

export function createDataItem (signer) {
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
      tags: [{ name: 'Content-Type', value: contentType }]
    })
    return file
  }
}
