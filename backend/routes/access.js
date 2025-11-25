const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { encryptKeyForRecipient } = require("../utils/encryption");
const AccessRequest = require("../models/AccessRequest");
const Content = require("../models/Content");

// ---------------------------------------------------------
//  REQUEST ACCESS  (Any authenticated user)
// ---------------------------------------------------------
router.post("/request", authMiddleware, async (req, res) => {
    try {
        const { contentHash, purpose } = req.body;

        if (!contentHash) {
            return res.status(400).json({ error: "Missing contentHash" });
        }

        // Find content owner
        const content = await Content.findOne({ ipfsHash: contentHash });
        if (!content) {
            return res.status(404).json({ error: "Content not found" });
        }

        const request = await AccessRequest.create({
            contentHash,
            requester: req.user.id,
            owner: content.owner,
            purpose,
            status: "pending"
        });

        return res.json({
            success: true,
            request
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create access request" });
    }
});

// ---------------------------------------------------------
//  GET PENDING REQUESTS (Owner or Admin only)
// ---------------------------------------------------------
router.get(
    "/pending",
    authMiddleware,
    async (req, res) => {
        try {
            const pending = await AccessRequest.find({
                owner: req.user.id,
                status: "pending"
            }).populate("requester", "email address role");

            res.json(pending);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Could not load pending requests" });
        }
    }
);

// ---------------------------------------------------------
//  GRANT ACCESS (Owner or Admin only)
// ---------------------------------------------------------
router.post(
    "/grant",
    authMiddleware,
    async (req, res) => {
        try {
            const { requestId, symmetricKey, granteePublicKey } = req.body;

            if (!requestId || !symmetricKey || !granteePublicKey) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const request = await AccessRequest.findById(requestId);
            if (!request) return res.status(404).json({ error: "Request not found" });

            if (request.owner.toString() !== req.user.id.toString()) {
                return res.status(403).json({ error: "Not authorized to grant access" });
            }

            // Encrypt symmetricKey for grantee
            const encryptedKey = encryptKeyForRecipient(
                symmetricKey,
                granteePublicKey
            );

            // Mark request as approved
            request.status = "approved";
            await request.save();

            res.json({
                success: true,
                encryptedKey
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Grant failed" });
        }
    }
);

module.exports = router;
