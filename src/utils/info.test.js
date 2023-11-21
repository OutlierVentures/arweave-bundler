import assert from 'node:assert'
import { describe, it } from 'node:test'
import { getAddress } from './info.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log('test.mjs produces ' + __dirname)

describe('getAddress', () => {
  it('return an address', async () => {
    // const parent = __dirname.split(sep).pop()
    const parent = resolve(__dirname, '..')
    const path = `${parent}/fixtures/wallet.json`

    const file = fs.readFileSync(path)
    const address = getAddress(JSON.parse(file))
    assert.equal(address, 'PugsGbRwb6n8roGdzUYggyLBwEzQU663ime4Gb0BtXw')
  })
})
