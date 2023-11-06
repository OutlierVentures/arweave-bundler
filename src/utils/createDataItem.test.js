import esmock from 'esmock'
import assert from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'

describe('createDataItem', async () => {
  const mockSigner = {
    /* mock signer object */
  }
  const createData = mock.fn((data, signer, opt) => ({
    id: 'id',
    data: '',
    isSigned: () => true,
    tags: opt.tags,
  }))
  const { createDataItem } = await esmock('./createDataItem.js', {
    arbundles: {
      createData,
    },
  })

  beforeEach(() => {
    mock.restoreAll()
  })

  it('should add dataItem to the file object', async () => {
    const file = {
      path: '/path/to/file.txt',
      data: 'file data',
      size: 100,
    }

    const expectedContentType = 'text/plain' // Assume '.txt' extension corresponds to text/plain content type

    const result = createDataItem(mockSigner)(file)

    assert.strictEqual(result.path, '/path/to/file.txt')
    assert.strictEqual(result.data, 'file data')
    assert.strictEqual(result.size, 100)
    assert.ok(result.dataItem) // dataItem should exist
    // assert.strictEqual(result.dataItem.someProperty, 'someValue'); // Ensure dataItem properties as per your implementation
    assert.strictEqual(result.dataItem.tags[0].name, 'Content-Type')
    assert.strictEqual(result.dataItem.tags[0].value, expectedContentType)
  })

  it('should handle empty file data', () => {
    const file = {
      path: '/path/to/emptyfile.txt',
      data: '',
      size: 0,
    }

    const result = createDataItem(mockSigner)(file)

    assert.strictEqual(result.path, '/path/to/emptyfile.txt')
    assert.strictEqual(result.data, '')
    assert.strictEqual(result.size, 0)
    assert.ok(result.dataItem) // dataItem should exist even for empty file data
  })
})
