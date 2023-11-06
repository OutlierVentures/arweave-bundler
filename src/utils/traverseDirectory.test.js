import assert from 'node:assert'
import path from 'node:path'
import { beforeEach, before, after, describe, it, mock } from 'node:test'
import { fileURLToPath } from 'node:url'
import { traverseDirectory } from './traverseDirectory.js'
import fs from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('traverseDirectory', () => {
  const testDirectory = '../fixtures/test-dir' // Replace with the actual test directory path
  const emptyDirectory = '../fixtures/empty-dir' // Replace with the path to an empty directory

  before(async () => {
    const absolutePath = path.join(__dirname, emptyDirectory)
    await fs.mkdir(absolutePath)
  })

  beforeEach(() => mock.method(console, 'log', (msg) => ''))

  after(async () => {
    const absolutePath = path.join(__dirname, emptyDirectory)
    await fs.rmdir(absolutePath)
  })

  it('should return an array of file paths when a valid directory is provided', async () => {
    const results = await traverseDirectory(path.join(__dirname, testDirectory))

    assert.ok(Array.isArray(results), 'Result should be an array')
    assert.ok(
      results.every(
        (o) =>
          o.path.includes('test-dir') &&
          Buffer.isBuffer(o.data) &&
          o.size !== undefined,
      ),
      'All elements should be strings',
    )
  })

  it('should return an empty array for an empty directory', async () => {
    const emptyDirectory = '../fixtures/empty-dir' // Replace with the path to an empty directory
    const absolutePath = path.join(__dirname, emptyDirectory)
    const result = await traverseDirectory(absolutePath)
    assert.ok(Array.isArray(result), 'Result should be an array')
    assert.strictEqual(result.length, 0, 'Result should be an empty array')
  })

  it('should reject the promise for an invalid directory', async () => {
    const invalidDirectory = '../fixtures/invalid-dir' // Replace with an invalid directory path
    try {
      await traverseDirectory(path.join(__dirname, invalidDirectory))
      // If the promise resolves, fail the test
      assert.fail('Promise should be rejected for invalid directory')
    } catch (error) {
      assert.ok(error instanceof Error, 'Error should be an instance of Error')
      assert.ok(
        error.message.includes(
          'Error reading directory: ENOENT: no such file or directory, scandir',
        ),
      )
    }
  })
})
