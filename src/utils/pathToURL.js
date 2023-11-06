import path from 'node:path'

export function pathToURL (filePath, basePath) {
  // Resolve the absolute path of the file
  if (!basePath) throw new Error('Missing basePath')
  const absolutePath = path.resolve(filePath)

  // If basePath is provided, remove it from the absolute path
  const relativePath = path.relative(basePath, absolutePath)

  // Convert the relative path to URL without the protocol
  const fileUrl = relativePath.split(path.sep).join('/')

  return fileUrl
}
