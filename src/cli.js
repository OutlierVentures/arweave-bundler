#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import upload from './commands/uploadCommand.js'

yargs(hideBin(process.argv))
  .demandCommand(1, 'You need to specify a command')
  .command(upload.command, upload.description, upload.builder, upload.handler)
  .help().argv
