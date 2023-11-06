import assert from 'node:assert';
import { it, describe, mock, beforeEach } from 'node:test'
import { execSync } from 'child_process';
import privateKeyMock from './fixtures/wallet.json' assert { type: 'json' }

describe.only('CLI', () => {
  const directory = 'src/fixtures/test-dir';

  it.only('should upload a directory to Arweave', () => {

    const privateKey = btoa(JSON.stringify(privateKeyMock))
    const command = `src/cli.js upload ${directory} --private-key=${privateKey} --dry-run`

    // Execute the CLI command using execSync
    const output = execSync(command).toString();

    // Assert the output or other expectations based on the script behavior
    assert.ok(output.trim().includes(`Starting upload of '${directory}'`), 'Expected output or empty string if no output');
  });

  it.only('should throw an error if missing private key', () => {
    // Execute the CLI command without specifying a private key
    const command = `src/cli.js upload ${directory} --dry-run`

    // Assert that executing the command throws an error
    assert.throws(() => {
      execSync(command);
    }, /missing private key as base64/);
  });
});
