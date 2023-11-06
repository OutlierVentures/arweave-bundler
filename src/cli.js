#!/usr/bin/env node
import yargs from 'yargs'
import fs from 'fs'
import { hideBin } from 'yargs/helpers'
import { upload } from './upload.js'

yargs(hideBin(process.argv))
  .demandCommand(1, 'You need to specify a command')
  .command(
    'upload <directory>',
    'Upload a directory to Arweave as bundle',
    (yargs) => {
      yargs.positional('directory', {
        describe: 'The directory containing files to upload',
        type: 'string',
      })
    },
    async (argv) => {
      const { directory, dryRun } = argv
      // console.log({ directory, privateKey, dryRun })
      let privateKey
      try {
        privateKey = argv.privateKey
          ? JSON.parse(Buffer.from(argv.privateKey, 'base64').toString('utf-8'))
          : JSON.parse(fs.readFileSync('wallet.json'))
      } catch (e) {
        throw new Error(
          'missing private key as base64 of a wallet.json or missing wallet.json',
        )
      }

      return await upload(directory, privateKey, dryRun)
    },
  )
  .option('private-key', {
    describe:
      'Path to the private key file (default: wallet.json) or base64 encoded private key (JWK)',
    type: 'string',
  })
  .option('dry-run', {
    describe: 'run everything expect submitting the transaction',
    type: 'boolean',
    default: false,
  })
  .help().argv
