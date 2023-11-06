# Arweave Bundler Github Action

A GitHub action to upload static assets from a directory. 
Ideal for publishing Single Page App (SPA) or other static contents to the permameweb.

## Install
- Node v20

## Run
```
./src/arweave-cli.js upload src/fixtures/test-dir --private-key ${PRIVATE_KEY} --dry-run
```

## Troubleshooting
- Create a base64 encoded private key from a JSON file `openssl base64 -in src/fixtures/test-wallet.json -A -out base64key.txt`
- Export as string a privateKey
```
export PRIVATE_KEY=`cat base64key.txt`
```
