import Arweave from 'arweave';

export async function setRecord(antAddress, manifestId, privateKey, dryRun) {
    // Initialize Arweave endpoint
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https',
    });

    // Configure transaction input
    const setRecordInput = {
        function: 'setRecord',
        subDomain: '@',
        transactionId: manifestId
    }

    console.log(`Setting Arweave Name Token record to ${manifestId}`);

    if (dryRun) {
        return { 
            response: { status: 200, statusText: 'OK', data: {} },
            transactionId: 'dry-run-tx-id'
        }
    }

    try {
        const response = await writeInteraction(arweave, setRecordInput, antAddress, privateKey)
        console.log(response);
        return response;

    } catch (error) {
        console.error('Error in setRecord: ', error);
        return undefined;
    }
}

async function writeInteraction(arweave, input, contractId, privateKey) {
    const interactionTx = await arweave.createTransaction({ 
        data: Math.random().toString().slice(-4)
    });

    interactionTx.addTag('App-Name', 'SmartWeaveAction');
    interactionTx.addTag('App-Version', '0.3.0');
    interactionTx.addTag('Contract', contractId);
    interactionTx.addTag('Input', JSON.stringify(input));

    await arweave.transactions.sign(interactionTx, privateKey);
    const response = await arweave.transactions.post(interactionTx);
  
    return {
        response: response,
        transactionId: interactionTx.id
    }
}