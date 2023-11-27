# Arweave Bundler
[![view on npm](https://img.shields.io/npm/v/@outlierventures/arweave-bundler.svg)](https://www.npmjs.org/package/@outlierventures/arweave-bundler)
![Licence](https://img.shields.io/github/license/OutlierVentures/arweave-bundler)


A GitHub action and CLI to upload static assets from a directory. 
Ideal for publishing Single Page App (SPA) or other static contents to the permameweb.
The lib use semantic versioning 

## Use the action

```
uses: outlierventures/arweave-bundler-action@v0.2.4
with:
  directory: build/
  private-key: ${secret.ARWEAVE_PRIVATE_KEY}
  dry-run: false
  network: arweave.net
```

## Run the CLI 

### Commands


```
npx arweave-bundler upload build/ --private-key ${PRIVATE_KEY}
```

or 

```
pnpm dlx arweave-bundler upload build/ --private-key ${PRIVATE_KEY}
```

### commands

```
arweave-bundler <command>

Commands:
  arweave-bundler upload <directory>  Upload a directory to Arweave as bundle
  arweave-bundler address             Print the address of the wallet

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Troubleshooting
- Create a base64 encoded private key from a JSON file `openssl base64 -in wallet.json -A -out base64key.txt`
- Export as string a privateKey
```
export PRIVATE_KEY=`cat base64key.txt`
```

## Dev Info
- Node v20 (LTS) 
- [pnpm](https://pnpm.io/)
- An Arweave private key with some $AR funds
- If you don't have an arweave wallet you can create one
  - `pnpm install arweave`
  - `node -e "require('arweave').init({}).wallets.generate().then(JSON.stringify).then(console.log.bind(console))" > wallet.json"`
- npx
