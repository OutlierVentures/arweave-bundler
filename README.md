# Arweave Bundler

[![view on npm](https://img.shields.io/npm/v/@outlierventures/arweave-bundler.svg)](https://www.npmjs.org/package/@outlierventures/arweave-bundler)
![Licence](https://img.shields.io/github/license/OutlierVentures/arweave-bundler)

A library to simplify publishing single page web apps (SPAs) or other static content to the Permaweb aka Arweave.

It bundles your files together, so you can upload in one transaction, rather than uploading separate files using the using the [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) standard.

It also maps individual file paths to their locations on Arweave via a [manifest file](https://cookbook.arweave.dev/concepts/manifests.html) so that your dApp works as if it was hosted on a S3 bucket.

Whether you prefer to use GitHub Actions or deploy directly through the CLI, `arweave-hundler` makes it easy.

The lib uses semantic versioning.

## Requirements

- An Arweave wallet
- Some $AR (the simplest is to get a small amount through an exchange )

If you don't already have an Arweave wallet you can create one by running:

```bash
  pnpm install arweave
  node -e "require('arweave').init({}).wallets.generate().then(JSON.stringify).then(console.log.bind(console))" > wallet.json
```

## GitHub Action

The action has multiple commands: `upload`, `address`, `set`.
All commands require the `private-key` (base64 encoded) and the `network` to be passed.
Optionally you can test the commands without broadcast a transaction by setting `dry-run: true`

### upload

Specify the command `upload` and the `directory` to publish to the permaweb the entire directory as an [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) bundle.

```yaml
- name: upload the directory
  uses: outlierventures/arweave-bundler-action@v0.3.1
  with:
    command: upload
    directory: build/
    private-key: ${{secrets.ARWEAVE_PRIVATE_KEY}}
    network: arweave.net
```

If an `ant-address` is provided the action will update the ArNS with the manifest-id of the bundle published.
In order to use this feature is required to have an ArNS name. You can learn more here: https://ar.io/docs/arns/#overview
and get an address here: https://arns.app/

```yaml
- name: upload the directory
  uses: outlierventures/arweave-bundler-action@v0.3.1
  with:
    command: upload
    directory: build/
    private-key: ${{secrets.ARWEAVE_PRIVATE_KEY}}
    ant-address: 'your-ant-address'
    network: arweave.net
```

### set

Specify the command `set` to update an `ant-address` to a given `manifest-id`

```yaml
- name: get the public address from the private key
  uses: outlierventures/arweave-bundler-action@v0.3.1
  with:
    command: address
    private-key: ${{secrets.ARWEAVE_PRIVATE_KEY}}
```

### address

Specify the command `address` to retrieve the public address from the `private-key` provided

```yaml
- name: get the public address from the private key
  uses: outlierventures/arweave-bundler-action@v0.3.1
  with:
    command: address
    private-key: ${{secrets.ARWEAVE_PRIVATE_KEY}}
```

## Run the CLI

All the Github actions are available to the CLI as well

### upload

```bash
npx @outlierventures/arweave-bundler@latest upload build/ --private-key ${PRIVATE_KEY}
```

alternatively you can upload and update the ant-address

```bash
 npx @outlierventures/arweave-bundler@latest upload build/ --ant-address your-ant-address --private-key ${PRIVATE_KEY}

```

### set

```bash
 npx @outlierventures/arweave-bundler@latest set --ant-address your-ant-address --manifest-id your-manifest-id --private-key ${PRIVATE_KEY}

```

### help

```bash
arweave-bundler <command>

Commands:
  arweave-bundler upload <directory>  Upload a directory to Arweave as bundle
  arweave-bundler address             Print the address of the wallet
  arweave-bundler set                 Set Arweave Name Token record to the manifest id

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Developement requirement

- Node v20 (LTS)
- [pnpm](https://pnpm.io/)
- npx
- An Arweave private key with some $AR funds

## Troubleshooting

- Create a base64 encoded private key from a JSON file `openssl base64 -in wallet.json -A -out base64key.txt`
- Export as string a privateKey

```bash
export PRIVATE_KEY=`cat base64key.txt`
```
