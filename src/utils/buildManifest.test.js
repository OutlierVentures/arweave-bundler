import esmock from 'esmock'
import assert from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'

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
    const { buildManifest } = await esmock('./buildManifest.js', {
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
    const { buildManifest } = await esmock('./buildManifest.js', {
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
    const { buildManifest } = await esmock('./buildManifest.js', {
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
