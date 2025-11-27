const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function uploadToIPFS(data) {
    // Simulate IPFS hash generation (CID)
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const filePath = path.join(UPLOAD_DIR, hash);

    // Store data to file
    fs.writeFileSync(filePath, data);

    console.log(`[IPFS] Uploaded data with hash: ${hash}`);
    return hash;
}

async function getFromIPFS(hash) {
    const filePath = path.join(UPLOAD_DIR, hash);
    if (!fs.existsSync(filePath)) {
        throw new Error('IPFS Content not found');
    }
    return fs.readFileSync(filePath, 'utf8');
}

module.exports = { uploadToIPFS, getFromIPFS };
