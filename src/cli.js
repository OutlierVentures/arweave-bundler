#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import upload from './commands/uploadCommand.js'
import info from './commands/infoCommand.js'
import set from './commands/setCommand.js'

yargs(hideBin(process.argv))
  .demandCommand(1, 'You need to specify a command')
  .command(upload.command, upload.description, upload.builder, upload.handler)
  .command(info.command, info.description, info.builder, info.handler)
  .command(set.command, set.description, set.builder, set.handler)
  .help().argv
