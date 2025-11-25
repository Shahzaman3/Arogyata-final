const crypto = require('crypto');

// AES-256-GCM Encryption
function encryptData(text, key) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag
    };
}

// AES-256-GCM Decryption
function decryptData(encrypted, key, iv, authTag) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Mock ECIES Encryption (In real app, use 'eth-crypto' or 'eccrypto')
// This simulates encrypting the symmetric key with a public key
function encryptKeyForRecipient(symmetricKey, recipientPublicKey) {
    // Placeholder: In reality, we'd use the public key to encrypt.
    // For prototype without heavy deps, we'll just return a base64 string 
    // pretending to be encrypted.
    return Buffer.from(`encrypted-${symmetricKey}-for-${recipientPublicKey}`).toString('base64');
}

module.exports = { encryptData, decryptData, encryptKeyForRecipient };
