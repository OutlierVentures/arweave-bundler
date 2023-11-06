import fs from 'node:fs/promises'
import path from 'node:path'

export async function traverseDirectory (directoryPath) {
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
          size: stats.size
        }
        fileList.push(o)
      }
    }

    return fileList
  } catch (error) {
    throw new Error('Error reading directory: ' + error.message)
  }
}
