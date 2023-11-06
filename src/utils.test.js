import { it, describe, mock, beforeEach } from 'node:test'
import assert from 'node:assert'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import esmock from 'esmock'

import {
  getContentTypeByExtension,
  traverseDirectory,
  buildManifest,
  createDataItem,
  pathToURL,
} from './utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('createDataItem', async () => {
  const mockSigner = { /* mock signer object */ };
  const createData = mock.fn((data, signer, opt) => ({
    id: 'id',
    data: '',
    isSigned: () => true,
    tags: opt.tags,
  }))
  const { createDataItem } = await esmock('./utils.js', {
    arbundles: {
      createData,
    },
  })


  beforeEach(()=>{
    mock.restoreAll()
  })

  it('should add dataItem to the file object', async () => {
    const file = {
      path: '/path/to/file.txt',
      data: 'file data',
      size: 100,
    };

    const expectedContentType = 'text/plain'; // Assume '.txt' extension corresponds to text/plain content type

    const result = createDataItem(mockSigner)(file);

    assert.strictEqual(result.path, '/path/to/file.txt');
    assert.strictEqual(result.data, 'file data');
    assert.strictEqual(result.size, 100);
    assert.ok(result.dataItem); // dataItem should exist
    // assert.strictEqual(result.dataItem.someProperty, 'someValue'); // Ensure dataItem properties as per your implementation
    assert.strictEqual(result.dataItem.tags[0].name, 'Content-Type');
    assert.strictEqual(result.dataItem.tags[0].value, expectedContentType);
  });

  it('should handle empty file data', () => {
    const file = {
      path: '/path/to/emptyfile.txt',
      data: '',
      size: 0,
    };

    const result = createDataItem(mockSigner)(file);

    assert.strictEqual(result.path, '/path/to/emptyfile.txt');
    assert.strictEqual(result.data, '');
    assert.strictEqual(result.size, 0);
    assert.ok(result.dataItem); // dataItem should exist even for empty file data
  });
});


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

describe('traverseDirectory', () => {
  const testDirectory = './fixtures/test-dir' // Replace with the actual test directory path
  beforeEach(() => mock.method(console, 'log', (msg) => ''))

  it('should return an array of file paths when a valid directory is provided', async () => {
    const results = await traverseDirectory(path.join(__dirname, testDirectory))

    assert.ok(Array.isArray(results), 'Result should be an array')
    assert.ok(
      results.every(
        (o) =>
          o.path.includes('test-dir') &&
          Buffer.isBuffer(o.data) &&
          o.size !== undefined,
      ),
      'All elements should be strings',
    )
  })

  it('should return an empty array for an empty directory', async () => {
    const emptyDirectory = './fixtures/empty-dir' // Replace with the path to an empty directory
    const result = await traverseDirectory(path.join(__dirname, emptyDirectory))
    assert.ok(Array.isArray(result), 'Result should be an array')
    assert.strictEqual(result.length, 0, 'Result should be an empty array')
  })

  it('should reject the promise for an invalid directory', async () => {
    const invalidDirectory = './fixtures/invalid-dir' // Replace with an invalid directory path
    try {
      await traverseDirectory(path.join(__dirname, invalidDirectory))
      // If the promise resolves, fail the test
      assert.fail('Promise should be rejected for invalid directory')
    } catch (error) {
      assert.ok(error instanceof Error, 'Error should be an instance of Error')
      assert.ok(
        error.message.includes(
          'Error reading directory: ENOENT: no such file or directory, scandir',
        ),
      )
    }
  })
})

// https://glebbahmutov.com/blog/trying-node-test-runner/#mocking-esm-modules
describe('buildManifest function', async () => {
  let createData
  let mockBuildDir
  let mockFiles
  let mockSigner
  beforeEach(async () => {
    mock.restoreAll()
    mockBuildDir = './path/to/your/buildDir'
    mockFiles = [
      {
        path: `${mockBuildDir}/path/sub-path`,
        data: Buffer.from('test'),
        size: 0,
        dataItem: {
          id: 'txId',
          tags: [
            {
              name: 'Content-Type',
              value: 'application/x.arweave-manifest+json',
            },
          ],
        },
      },
    ]

    mockSigner = 'mockSigner'
  })

  it('should return a valid manifest data item for valid input', async () => {
    createData = mock.fn(() => ({
      id: 'id',
      data: '',
      isSigned: () => true,
      tags: [],
    }))
    const { buildManifest } = await esmock('./utils.js', {
      arbundles: {
        createData,
      },
    })

    const manifestDataItem = await buildManifest(
      mockFiles,
      mockBuildDir,
      mockSigner,
    )
    assert.ok(manifestDataItem, 'Manifest data item should be truthy')
    assert.strictEqual(
      typeof manifestDataItem.id,
      'string',
      'Manifest data item should have a string ID',
    )
    assert.ok(
      Array.isArray(manifestDataItem.tags),
      'Manifest data item tags should be an array',
    )
    assert.ok(
      manifestDataItem.isSigned,
      'Manifest data item should have isSigned method',
    )
  })

  it('should return a manifest with correct paths and version ', async () => {
    createData = mock.fn(() => ({
      id: 'id',
      data: '',
      isSigned: () => true,
      tags: [],
    }))
    const { buildManifest } = await esmock('./utils.js', {
      arbundles: {
        createData,
      },
    })

    const manifest = await buildManifest(mockFiles, mockBuildDir, mockSigner)
    assert.ok(manifest !== undefined)
    debugger
    assert.deepEqual(createData.mock.calls[0].arguments, [
      JSON.stringify(
        {
          manifest: 'arweave/paths',
          version: '0.1.0',
          index: {
            path: 'index.html',
          },
          paths: { ['path/sub-path']: { id: 'txId' } },
        },
        null,
        2,
      ),
      'mockSigner',
      {
        tags: [
          {
            name: 'Content-Type',
            value: 'application/x.arweave-manifest+json',
          },
        ],
      },
    ])
  })

  it('should handle empty input files array', async () => {
    createData = mock.fn(() => ({
      id: 'id',
      data: '',
      isSigned: () => true,
      tags: [],
    }))
    const { buildManifest } = await esmock('./utils.js', {
      arbundles: {
        createData,
      },
    })

    const emptyFiles = []
    const manifestDataItem = await buildManifest(
      emptyFiles,
      mockBuildDir,
      mockSigner,
    )
    // const manifestObject = JSON.parse(manifestDataItem.toString())
    assert.ok(manifestDataItem !== undefined)
    assert.deepEqual(createData.mock.calls[0].arguments, [
      JSON.stringify(
        {
          manifest: 'arweave/paths',
          version: '0.1.0',
          index: {
            path: 'index.html',
          },
          paths: {},
        },
        null,
        2,
      ),
      'mockSigner',
      {
        tags: [
          {
            name: 'Content-Type',
            value: 'application/x.arweave-manifest+json',
          },
        ],
      },
    ])
  })

  // Add more test cases as needed to cover various scenarios
})
