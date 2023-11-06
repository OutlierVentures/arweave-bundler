import { getInput, setOutput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import fs from 'fs'
import { upload } from './src/upload.js'

try {
  const directory = getInput('directory')
  const dryRun = getInput('dry-run')
  const base64PrivateKey = getInput('private-key')
  console.log(`Hello ${directory}!`)
  const time = new Date().toTimeString()

  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);

  let privateKey
  try {
    privateKey = JSON.parse(
      Buffer.from(base64PrivateKey, 'base64').toString('utf-8'),
    )
  } catch (e) {
    throw new Error(
      `Missing private key or not encoded as base64: ${e.message}`,
    )
  }

  await upload(directory, privateKey, dryRun)
} catch (error) {
  setFailed(error.message)
}
