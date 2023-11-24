const CONTENT_TYPE_MAPPING = {
  '.html': 'text/html',
  '.txt': 'text/plain',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.js.map': 'application/json',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

export function getContentTypeByExtension(ext) {
  const extension = ext.toLowerCase()
  return CONTENT_TYPE_MAPPING[extension]
    ? CONTENT_TYPE_MAPPING[extension]
    : 'application/octet-stream'
}
