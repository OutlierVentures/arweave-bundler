# Arweave Bundler
[![view on npm](https://img.shields.io/npm/v/@outlierventures/arweave-bundler.svg)](https://www.npmjs.org/package/@outlierventures/arweave-bundler)
![Licence](https://img.shields.io/github/license/OutlierVentures/arweave-bundler)

A library to simplify publishing single page web apps (SPAs) or other static content to the Permaweb. 

It bundles your files together so you can upload in one transaction, rather than uploading separate files using the using the [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) standard. 

It also maps individual file paths to their locations on Arweave so that your dApp works seamlessly.

Whether you prefer to use GitHub Actions or deploy directly through the CLI, `arweave-hundler` makes it easy.

The lib uses semantic versioning.

## Developer dependencies

- Node v20 (LTS) 
- [pnpm](https://pnpm.io/)
- npx
- An Arweave private key with some $AR funds

If you don't already have an Arweave wallet, create one by running: 

   `pnpm install arweave`
   `node -e "require('arweave').init({}).wallets.generate().then(JSON.stringify).then(console.log.bind(console))" > wallet.json`

## GitHub Action

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

where `${PRIVATE_KEY}` is your Arweave private key. Always use environment variables or GitHub secrets and never commit your private key!

### Available commands

```
arweave-bundler <command>

Commands:
  arweave-bundler upload <directory>  Upload a directory to Arweave as bundle
  arweave-bundler address             Print the address of the wallet
  arweave-bundler set                 Set Arweave Name Token record to the manifest id

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
