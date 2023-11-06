import assert from 'node:assert'
import { describe, it } from 'node:test'
import { getContentTypeByExtension } from './getContentTypeByExtension.js'

describe('getContentTypeByExtension', () => {
  const contentTypeMapping = {
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
  }

  Object.entries(contentTypeMapping).forEach(([ext, expectedContentType]) => {
    it(`should return '${expectedContentType}' for '${ext}' extension`, () => {
      const result = getContentTypeByExtension(ext)
      assert.equal(result, expectedContentType)
    })
  })

  it("should return 'application/octet-stream' for unknown extension", () => {
    const result = getContentTypeByExtension('.unknown')
    assert.equal(result, 'application/octet-stream')
  })

  it("should handle uppercase extensions and return 'text/html' for '.HTML' extension", () => {
    const result = getContentTypeByExtension('.HTML')
    assert.equal(result, 'text/html')
  })
})
