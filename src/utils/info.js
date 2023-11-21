import { createHash } from 'crypto';

export function getAddress (wallet) {
    // Convert n to a buffer
    const nBuffer = Buffer.from(wallet.n, 'base64');

// Hash the n buffer using SHA-256
    const sha256Hash = createHash('sha256').update(nBuffer).digest();

// Encode the hash in base64 URL format
    const walletAddress = sha256Hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return walletAddress
}
