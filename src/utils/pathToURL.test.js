import assert from 'node:assert'
import { describe, it } from 'node:test'
import { pathToURL } from './pathToURL.js'

describe('pathToURL', () => {
  it('should convert a file path to a relative URL without the protocol', () => {
    const filePath = './folder/file.txt'
    const basePath = './folder'
    const expectedUrl = 'file.txt'

    const result = pathToURL(filePath, basePath)
    assert.equal(result, expectedUrl)
  })

  it('should convert a file path to a relative URL without the protocol of a nested directory', () => {
    const filePath = './folder/nested/file.txt'
    const basePath = './folder'
    const expectedUrl = 'nested/file.txt'

    const result = pathToURL(filePath, basePath)
    assert.equal(result, expectedUrl)
  })

  it('throws when basePath is missing', () => {
    const filePath = './folder/nested/file.txt'

    try {
      pathToURL(filePath)
      assert.fail("it shouldn't reach here")
    } catch (e) {
      assert.ok(e instanceof Error)
      assert.equal(e.message, 'Missing basePath')
    }
  })
})
