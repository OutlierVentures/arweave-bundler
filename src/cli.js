#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import upload from './commands/upload.js'

yargs(hideBin(process.argv))
  .demandCommand(1, 'You need to specify a command')
  .command(upload.command, upload.description, upload.builder, upload.handler)
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
