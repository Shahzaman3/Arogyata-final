const crypto = require('crypto');

// Mock IPFS Storage
const ipfsStore = new Map();

async function uploadToIPFS(data) {
    // Simulate IPFS hash generation (CID)
    const hash = crypto.createHash('sha256').update(data).digest('hex');

    // Store data
    ipfsStore.set(hash, data);

    console.log(`[IPFS] Uploaded data with hash: ${hash}`);
    return hash;
}

async function getFromIPFS(hash) {
    const data = ipfsStore.get(hash);
    if (!data) throw new Error('IPFS Content not found');
    return data;
}

module.exports = { uploadToIPFS, getFromIPFS };
