import { it, describe, mock } from 'node:test';
import esmock from 'esmock';
import assert from 'assert';
import privateKeyMock from './fixtures/wallet.json' assert { type: 'json' };

describe('setRecord', async () => {
    const setRecordPath = './setRecord.js';

    let writeInteraction = mock.fn()
    writeInteraction.mock.mockImplementationOnce(() => ({
        type: 'ok',
        state: {
            ticker: 'antName',
            name: 'arnsName',
            owner: 'ownerAddress',
            controller: 'ownerAddress',
            evolve:null,
            records: {
                "@": {
                    transactionId: 'validManifestId',
                    ttlSeconds: 900
                }
            },
            balances: {
                owner_address: 1
            }
        }
    }));
    
    const warpContractsMock = {
        WarpFactory: {
            forMainnet: () => ({
                pst: () => ({
                    connect: () => ({
                        writeInteraction: writeInteraction,
                        dryWrite: mock.fn(async () => 'dryWriteMockResponse'),
                    })
                })
            })
        }
    };

    // Mock the Warp Contracts SDK
    const { setRecord } = await esmock(setRecordPath, {
        ['warp-contracts']: warpContractsMock
    });

    it('should successfully return a dry write response', async () => {
        const response = await setRecord('validAntAddress', 'validManifestId', privateKeyMock, true);
        assert.ok(response);
        assert.strictEqual(response, 'dryWriteMockResponse');
    });

    it('should successfully returns a write interaction response', async () => {
        const response = await setRecord('validAntAddress', 'validManifestId', privateKeyMock, false);
        assert.ok(response);
        assert.strictEqual(response.state.owner, 'ownerAddress');
        assert.strictEqual(response.state.records['@'].transactionId, 'validManifestId');
    });
});