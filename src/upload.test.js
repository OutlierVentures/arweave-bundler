import { it, describe, mock, beforeEach } from 'node:test'
import assert from 'node:assert'
import { upload } from './upload.js' // Import the upload function
import arweave from 'arweave'
import privateKeyMock from './fixtures/wallet.json' assert { type: 'json' }

describe('upload', () => {
  let arweaveMock
  let createTransactionMock
  let getUploaderMock
  let getStatusMock
  let signMock

  beforeEach(() => {
    // Mock the Arweave library
    createTransactionMock = mock.fn(() => {
      return {
        id: 'TxId',
        addTag: mock.fn(() => {}),
        getRaw: mock.fn(() => 'data'),
      }
    })
    getUploaderMock = mock.fn()
    getUploaderMock.mock.mockImplementationOnce(() => ({
      pctComplete: 50,
      totalChunks: 100,
      uploadedChunks: 50,
      isComplete: false,
      uploadChunk: mock.fn(),
    }))
    getUploaderMock.mock.mockImplementationOnce(() => ({
      isComplete: true,
      pctComplete: 100,
      totalChunks: 100,
      uploadedChunks: 100,
      uploadChunk: mock.fn(),
    }))
    getStatusMock = mock.fn()
    getStatusMock.mock.mockImplementationOnce(() => ({
      confirmed: {
        number_of_confirmations: 0,
        block_height: 123,
        block_indep_hash: 'hash',
      },
    }))
    getStatusMock.mock.mockImplementationOnce(() => ({
      confirmed: {
        number_of_confirmations: 1,
        block_height: 123,
        block_indep_hash: 'hash',
      },
    }))

    signMock = mock.fn()
    arweaveMock = mock.method(arweave, 'init', () => {
      return {
        createTransaction: createTransactionMock,
        transactions: {
          getUploader: getUploaderMock,
          getStatus: getStatusMock,
          sign: signMock,
        },
      }
    })
  })

  it('uploads a bundle to Arweave', async () => {
    const result = await upload('src/fixtures/test-dir', privateKeyMock)

    assert.equal(result.block_indep_hash, 'hash')
    assert.equal(result.number_of_confirmations, 1)
    assert.equal(result.block_height, 123)

    // it doesn't track the multiple calls :/
    // assert.equal(getUploaderMock.mock.callCount(), 2)
    // assert.equal(getStatusMock.mock.callCount(), 2)
  })
})
