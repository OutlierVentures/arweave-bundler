import { it, describe, mock } from 'node:test';
import assert from 'assert';
import arweave from 'arweave';
import { setRecord } from './setRecord.js';
import privateKeyMock from './fixtures/wallet.json' assert { type: 'json' };

describe('setRecord', async () => {
    let arweaveMock;
    let signMock;
    let postMock;
    let createTransactionMock;

    createTransactionMock = mock.fn()
    createTransactionMock.mock.mockImplementationOnce(() => ({
        id: 'write-tx-id',
        addTag: () => ({})
    }))

    postMock = mock.fn(async () => Promise.resolve({ 
        status: 200, 
        statusText: 'OK', 
        data: {} 
    }));

    signMock = mock.fn()

    arweaveMock = mock.method(arweave, 'init', () => {
      return {
        createTransaction: createTransactionMock,
        transactions: {
            post: postMock,
            sign: signMock
        },
      }
    })
    
    it('should successfully return a dry write response', async () => {
        const { response, transactionId } = await setRecord('validAntAddress', 'validManifestId', privateKeyMock, true);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.statusText, 'OK');
        assert.strictEqual(transactionId, 'dry-run-tx-id')
    });

    it('should successfully returns a write interaction response', async () => {
        const { response, transactionId } = await setRecord('validAntAddress', 'validManifestId', privateKeyMock, false);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.statusText, 'OK');
        assert.strictEqual(transactionId, 'write-tx-id')
    });
});