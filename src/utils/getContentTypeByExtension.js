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
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream' // default to binary data
  }
}
