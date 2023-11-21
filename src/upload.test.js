import { it, describe, mock, beforeEach } from 'node:test'
import esmock from 'esmock'
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
  const txId = 'TxId'

  beforeEach(() => {
    // Mock the Arweave library
    createTransactionMock = mock.fn(() => {
      return {
        id: txId,
        addTag: mock.fn(() => {}),
        getRaw: mock.fn(() => 'data'),
      }
    })
    getUploaderMock = mock.fn(() => ({
      isComplete: true,
      pctComplete: 100,
      totalChunks: 100,
      uploadedChunks: 100,
      uploadChunk: mock.fn(),
    }))

    getStatusMock = mock.fn(() => ({
      confirmed: {
        number_of_confirmations: 1,
        block_height: 123,
        block_indep_hash: 'hash',
      },
    }))


    getStatusMock.mock.mockImplementationOnce(() => ({
      confirmed: {
        number_of_confirmations: 0,
        block_height: 123,
        block_indep_hash: 'hash',
      },
    }))

    // empty response
    getStatusMock.mock.mockImplementationOnce(() => ({}))

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
    const { result, _ } = await upload('src/fixtures/test-dir', privateKeyMock)

    assert.equal(result.confirmed.block_indep_hash, 'hash')
    assert.equal(result.confirmed.number_of_confirmations, 1)
    assert.equal(result.confirmed.block_height, 123)
    assert.equal(getStatusMock.mock.callCount(), 2)
    assert.equal(getUploaderMock.mock.callCount(), 1)

    assert.deepEqual(getStatusMock.mock.calls[0].arguments, [txId])
    assert.deepEqual(getStatusMock.mock.calls[1].arguments, [txId])
  })
  it('executes a dry run')
})
