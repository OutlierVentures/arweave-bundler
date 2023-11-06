# Arweave Bundler Github Action

A GitHub action to upload static assets from a directory. 
Ideal for publishing Single Page App (SPA) or other static contents to the permameweb directly from your GitHub repo

If you don't use GitHub actions, or you are up something else, worry not we have you covered with a simple CLI

## Requirements
- Node v20
- An Arweave private key with some $AR funds 
- If you don't have an arweave wallet you can create one 
  - `npm install arweave`
  - `node -e "require('arweave').init({}).wallets.generate().then(JSON.stringify).then(console.log.bind(console)) > wallet.json"`

## Run the cli
```
./src/arweave-cli.js upload src/fixtures/test-dir --private-key ${PRIVATE_KEY} --dry-run
```

## Troubleshooting
- Create a base64 encoded private key from a JSON file `openssl base64 -in src/fixtures/test-wallet.json -A -out base64key.txt`
- Export as string a privateKey
```
export PRIVATE_KEY=`cat base64key.txt`
```
