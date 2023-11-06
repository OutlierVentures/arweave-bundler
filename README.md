# Arweave Bundler

A GitHub action and CLI to upload static assets from a directory. 
Ideal for publishing Single Page App (SPA) or other static contents to the permameweb.

## Use the action

```
uses: outlierventures/arweabe-bundler-action@v0.2.0
with:
  directory: build/
  private-key: ${secret.ARWEAVE_PRIVATE_KEY}
  dry-run: false
  network: arweave.net
```

## Run the cli

```
npx arweave-bundler upload build/ --private-key ${PRIVATE_KEY}
```

or 

```
pnpm dlx arweave-bundler upload build/ --private-key ${PRIVATE_KEY}
```

## Troubleshooting
- Create a base64 encoded private key from a JSON file `openssl base64 -in wallet.json -A -out base64key.txt`
- Export as string a privateKey
```
export PRIVATE_KEY=`cat base64key.txt`
```

## Dev requirements
- Node v20 (LTS) 
- [pnpm](https://pnpm.io/)
- An Arweave private key with some $AR funds
- If you don't have an arweave wallet you can create one
  - `pnpm install arweave`
  - `node -e "require('arweave').init({}).wallets.generate().then(JSON.stringify).then(console.log.bind(console)) > wallet.json"`
