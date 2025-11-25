const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const { encryptData, decryptData } = require("../utils/encryption");
const { uploadToIPFS, getFromIPFS } = require("../utils/ipfs");
const { summarizeContent, summarizeChanges } = require("../utils/ai");

const authMiddleware = require("../middleware/authMiddleware");
const Content = require("../models/Contents");

// -----------------------------------------------------
//  UPLOAD CONTENT (Encrypted → IPFS → Metadata in MongoDB)
// -----------------------------------------------------
router.post("/upload", authMiddleware, async (req, res) => {
    try {
        const { data, title, description } = req.body;

        if (!data)
            return res.status(400).json({ error: "Missing data field" });

        // 1. Generate symmetric key
        const symmetricKey = crypto.randomBytes(32).toString("hex");

        // 2. Encrypt the content
        const { encrypted, iv, authTag } = encryptData(data, symmetricKey);

        // 3. Upload encrypted payload to IPFS
        const payload = JSON.stringify({ encrypted, iv, authTag });
        const contentHash = await uploadToIPFS(payload);

        // 4. Create AI summary
        const summary = await summarizeContent(data);

        // 5. Save metadata in MongoDB
        const item = await Content.create({
            owner: req.user.id,
            title: title || "",
            description: description || "",
            ipfsHash: contentHash,
            summary,
        });

        res.json({
            message: "Content uploaded successfully",
            contentHash,
            symmetricKey,
            summary,
            item
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

// -----------------------------------------------------
//  MODIFY CONTENT (Creates new version + keeps chain)
// -----------------------------------------------------
router.post("/:hash/modify", authMiddleware, async (req, res) => {
    try {
        const { hash } = req.params;
        const { newData, symmetricKey } = req.body;

        // Find metadata in DB
        const oldRecord = await Content.findOne({
            ipfsHash: hash,
            owner: req.user.id
        });

        if (!oldRecord)
            return res.status(404).json({ error: "Content not found" });

        // Retrieve + decrypt original content
        const oldPayloadStr = await getFromIPFS(hash);
        const oldPayload = JSON.parse(oldPayloadStr);

        const oldData = decryptData(
            oldPayload.encrypted,
            symmetricKey,
            oldPayload.iv,
            oldPayload.authTag
        );

        // Encrypt new data
        const { encrypted, iv, authTag } = encryptData(newData, symmetricKey);

        const newPayload = JSON.stringify({ encrypted, iv, authTag });
        const newContentHash = await uploadToIPFS(newPayload);

        const changeSummary = await summarizeChanges(oldData, newData);
        const newSummary = await summarizeContent(newData);

        // Store new version in MongoDB
        const newItem = await Content.create({
            owner: req.user.id,
            title: oldRecord.title,
            description: oldRecord.description,
            ipfsHash: newContentHash,
            previousHash: hash,
            summary: newSummary,
        });

        res.json({
            message: "Content modified successfully",
            newContentHash,
            changeSummary,
            newSummary,
            newItem
        });

    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Invalid key or decryption failed" });
    }
});

// -----------------------------------------------------
//  RETRIEVE CONTENT (Decryption required)
// -----------------------------------------------------
router.post("/:hash/retrieve", authMiddleware, async (req, res) => {
    try {
        const { hash } = req.params;
        const { symmetricKey } = req.body;

        const record = await Content.findOne({
            ipfsHash: hash,
            owner: req.user.id
        });

        if (!record)
            return res.status(404).json({ error: "Content metadata not found" });

        const payloadStr = await getFromIPFS(hash);
        const payload = JSON.parse(payloadStr);

        const decrypted = decryptData(
            payload.encrypted,
            symmetricKey,
            payload.iv,
            payload.authTag
        );

        res.json({
            data: decrypted,
            summary: record.summary
        });

    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Decryption failed or IPFS error" });
    }
});

// -----------------------------------------------------
//  GET ALL CONTENT FOR LOGGED-IN USER
// -----------------------------------------------------
router.get("/", authMiddleware, async (req, res) => {
    try {
        const items = await Content.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});

module.exports = router;
