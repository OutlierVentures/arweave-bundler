import fs from 'fs'
export function parsePrivateKey (argv) {
    let privateKey
    // const file = fs.readFileSync('wallet.json')
    // console.log({file})
    try {
        privateKey = argv.privateKey
            ? JSON.parse(Buffer.from(argv.privateKey, 'base64').toString('utf-8'))
            : JSON.parse(fs.readFileSync('wallet.json'))
    } catch (e) {
        throw new Error(
            'missing private key as base64 or missing wallet.json',
        )
    }
    return privateKey
}
