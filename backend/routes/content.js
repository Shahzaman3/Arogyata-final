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

        if (!data.startsWith('data:')) {
            return res.status(400).json({ error: "Invalid data format. Must be a Data URL." });
        }

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
            encryptionKey: symmetricKey
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
router.post("/:id/modify", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { newData, title, description } = req.body;

        // Find metadata in DB
        const oldRecord = await Content.findOne({
            _id: id,
            owner: req.user.id
        }).select("+encryptionKey");

        if (!oldRecord)
            return res.status(404).json({ error: "Content not found" });

        const symmetricKey = oldRecord.encryptionKey;

        // Retrieve + decrypt original content
        const oldPayloadStr = await getFromIPFS(oldRecord.ipfsHash);
        const oldPayload = JSON.parse(oldPayloadStr);

        const oldData = decryptData(
            oldPayload.encrypted,
            symmetricKey,
            oldPayload.iv,
            oldPayload.authTag
        );

        // Encrypt new data
        const { encrypted, iv, authTag } = encryptData(newData || oldData, symmetricKey);

        const newPayload = JSON.stringify({ encrypted, iv, authTag });
        const newContentHash = await uploadToIPFS(newPayload);

        const changeSummary = newData ? await summarizeChanges(oldData, newData) : "Metadata updated";
        const newSummary = newData ? await summarizeContent(newData) : oldRecord.summary;

        // Update record (or create new version if strict versioning needed, but for now update in place or create new)
        // For simple edit, we can update the existing record or create a new one. 
        // Let's update the existing one for simplicity in this dashboard view, 
        // but typically blockchain apps might append. 
        // Given the prompt implies "edit", we'll update the pointer.
        
        oldRecord.title = title || oldRecord.title;
        oldRecord.description = description || oldRecord.description;
        oldRecord.ipfsHash = newContentHash;
        oldRecord.summary = newSummary;
        await oldRecord.save();

        res.json({
            message: "Content modified successfully",
            newContentHash,
            changeSummary,
            newSummary,
            item: oldRecord
        });

    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Modification failed" });
    }
});

// -----------------------------------------------------
//  RETRIEVE CONTENT (Decryption required)
// -----------------------------------------------------
router.post("/:id/retrieve", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await Content.findOne({
            _id: id,
            owner: req.user.id
        }).select("+encryptionKey");

        if (!record)
            return res.status(404).json({ error: "Content metadata not found" });

        const payloadStr = await getFromIPFS(record.ipfsHash);
        const payload = JSON.parse(payloadStr);

        const decrypted = decryptData(
            payload.encrypted,
            record.encryptionKey,
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
//  DELETE CONTENT
// -----------------------------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Content.deleteOne({ _id: id, owner: req.user.id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Content not found" });
        }

        res.json({ message: "Content deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
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
