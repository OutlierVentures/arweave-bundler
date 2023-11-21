import { WarpFactory, defaultCacheOptions } from 'warp-contracts';

export async function setRecord(antAddress, manifestId, privateKey, dryRun) {
    // Warp instance for interfacing with Arweave mainnet, Arweave=true (L1 transaction)
    const warp = WarpFactory.forMainnet({...defaultCacheOptions}, true);

    // Create contract instance
    const antContract = warp.pst(antAddress).connect(privateKey);

    // Configure transaction input
    const setRecordInput = {
        function: "setRecord",
        subDomain: "@",
        transactionId: manifestId
    }

    console.log(`Setting Arweave Name Token record to ${manifestId}`);

    try {
        const response = await (dryRun ? 
            antContract.dryWrite(setRecordInput) : 
            antContract.writeInteraction(setRecordInput)
        );
        console.log(response);
        return response;

    } catch (error) {
        console.error(`Error in ${dryRun ? 'setRecord *dry run*' : 'setRecord'}: `, error);
        return undefined;
    }
}