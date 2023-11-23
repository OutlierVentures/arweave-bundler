import esmock from 'esmock'
import assert from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'
import privateKeyMock from '../fixtures/wallet.json' assert { type: 'json' }

describe('uploadCommand', async () => {
  // const uploadMock
  // let module
  describe('handler', async () => {
    const uploadMock = mock.fn((buildDir, privateKey, dryRun) => {
      if (dryRun) {
        return undefined
      }
      return {}
    })

    const { handler } = await esmock('./uploadCommand.js', {
      '../upload.js': {
        upload: uploadMock,
      },
    })

    beforeEach(async () => {
      mock.restoreAll()
      uploadMock.mock.resetCalls()
    })
    it('returns a transaction', async () => {
      const privateKey = btoa(JSON.stringify(privateKeyMock))
      const argv = {
        directory: 'build',
        dryRun: 'false',
        privateKey,
      }
      const response = await handler(argv)
      assert.deepEqual(uploadMock.mock.calls[0].arguments, [
        argv.directory,
        privateKeyMock,
        false,
      ])
      assert.ok(response !== undefined)
    })

    it('does a dry run', async () => {
      const privateKey = btoa(JSON.stringify(privateKeyMock))
      const argv = {
        directory: 'build',
        dryRun: 'True',
        privateKey,
      }
      const response = await handler(argv)
      assert.deepEqual(uploadMock.mock.calls[0].arguments, [
        argv.directory,
        privateKeyMock,
        true,
      ])
      assert.ok(response === undefined)
    })
  })
})
