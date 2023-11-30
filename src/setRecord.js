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
        const response = {
            response: { status: 200, statusText: 'OK', data: {} },
            transactionId: 'TxId'
        }
        console.log(response);
        return response
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

// Executes a SmartWeave contract write interaction (i.e. a SmartWeaveAction)
async function writeInteraction(arweave, input, contractId, privateKey) {
    const interactionTx = await arweave.createTransaction({
        // A new Arweave tx requires a 'data' value (or 'target' and 'quantity' values); 
        // we generate and pass an arbitrary int to satisfy this requirement
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