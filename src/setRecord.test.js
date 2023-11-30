import { it, describe, mock, beforeEach } from 'node:test';
import assert from 'assert';
import arweave from 'arweave';
import { setRecord } from './setRecord.js';
import privateKeyMock from './fixtures/wallet.json' assert { type: 'json' };

describe('setRecord', async () => {
    let arweaveMock;
    let signMock;
    let postMock;
    let createTransactionMock;
    const txId = 'TxId';

    beforeEach(() => {
        createTransactionMock = mock.fn(() => {
            return {
                id: txId,
                addTag: mock.fn(() => {})
            }
        })
        
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
    })
    
    it('should successfully return a dry write response', async () => {
        const { response, transactionId } = await setRecord('validAntAddress', 'validManifestId', privateKeyMock, true);
        assert.equal(response.status, 200);
        assert.equal(response.statusText, 'OK');
        assert.equal(transactionId, txId);
        assert.equal(arweaveMock.mock.callCount(), 1);
    });

    it('should successfully returns a write interaction response', async () => {
        const { response, transactionId } = await setRecord('validAntAddress', 'validManifestId', privateKeyMock, false);
        assert.equal(response.status, 200);
        assert.equal(response.statusText, 'OK');
        assert.equal(transactionId, 'TxId');
        assert.equal(arweaveMock.mock.callCount(), 1);
        assert.equal(createTransactionMock.mock.callCount(), 1);
        assert.equal(signMock.mock.callCount(), 1);
        assert.equal(postMock.mock.callCount(), 1);

        assert.equal(createTransactionMock.mock.calls[0].arguments[0].data.length, 4);
        assert.equal(signMock.mock.calls[0].arguments[0].id, txId);
        assert.equal(signMock.mock.calls[0].arguments[1], privateKeyMock);
        assert.equal(postMock.mock.calls[0].arguments[0].id, txId);
    });
});