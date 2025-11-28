const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const AuditLog = require("../models/AuditLog");
const AccessRequest = require("../models/AccessRequest");
const User = require("../models/User");
const Permission = require("../models/Permission");

// ---------------------------------------------------------
//  PATIENT DASHBOARD ENDPOINTS
// ---------------------------------------------------------

// Get Audit Logs for Patient
router.get("/patient/audit-logs", authMiddleware, async (req, res) => {
    try {
        // Logs where the patient is the actor OR the target
        const logs = await AuditLog.find({
            $or: [{ actor: req.user.id }, { target: req.user.id }]
        })
        .sort({ createdAt: -1 })
        .populate("actor", "name role")
        .populate("target", "name role");
        
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

// Get Active Permissions
router.get("/patient/permissions", authMiddleware, async (req, res) => {
    try {
        // Find approved access requests where user is owner
        const permissions = await AccessRequest.find({
            owner: req.user.id,
            status: "approved"
        }).populate("requester", "name role email");

        res.json(permissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch permissions" });
    }
});

// ---------------------------------------------------------
//  INSTITUTION DASHBOARD ENDPOINTS
// ---------------------------------------------------------

// Search Patient
router.post("/institution/search", authMiddleware, async (req, res) => {
    try {
        const { query } = req.body; // Wallet address or DID
        
        // Simple search by wallet address (assuming address is stored in User model or we search by ID)
        // For now, let's search by _id or email as a fallback since wallet might be separate
        const patient = await User.findOne({
            $or: [{ address: query }, { email: query }]
        }).select("name email role address");

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json(patient);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

// Get Active Consultations (Patients who granted access)
router.get("/institution/consultations", authMiddleware, async (req, res) => {
    try {
        // Find approved requests where user is requester
        const consultations = await AccessRequest.find({
            requester: req.user.id,
            status: "approved"
        }).populate("owner", "name email address");

        res.json(consultations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch consultations" });
    }
});

// Get Institution Audit Logs
router.get("/institution/audit-logs", authMiddleware, async (req, res) => {
    try {
        const logs = await AuditLog.find({
            actor: req.user.id
        })
        .sort({ createdAt: -1 })
        .populate("target", "name email");

        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

// Get Institution Stats
router.get("/institution/stats", authMiddleware, async (req, res) => {
    try {
        // 1. Total Patients: Unique owners of approved requests where user is requester
        const approvedRequests = await AccessRequest.find({
            requester: req.user.id,
            status: "approved"
        });
        const uniquePatients = new Set(approvedRequests.map(req => req.owner.toString()));
        const totalPatients = uniquePatients.size;

        // 2. Active Consultations: Count of approved requests
        const activeConsultations = approvedRequests.length;

        // 3. Records Processed: Count of content created by this institution
        // Note: We need to import Content model if not already imported
        const Content = require("../models/Contents");
        const recordsProcessed = await Content.countDocuments({ owner: req.user.id });

        res.json({
            totalPatients,
            activeConsultations,
            recordsProcessed,
            systemStatus: "Secure"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

const { decryptData } = require("../utils/encryption");
const { getFromIPFS } = require("../utils/ipfs");

// ... existing code ...

// Get Patient Records (For Institution with approved access)
router.get("/institution/patient/:patientId/records", authMiddleware, async (req, res) => {
    try {
        const { patientId } = req.params;

        // 1. Verify Access: Check if there is an approved request
        const access = await AccessRequest.findOne({
            requester: req.user.id,
            owner: patientId,
            status: "approved"
        });

        if (!access) {
            return res.status(403).json({ error: "Access denied. No approved consultation found." });
        }

        // 2. Fetch Records
        const Content = require("../models/Contents");
        const records = await Content.find({ owner: patientId })
            .sort({ createdAt: -1 })
            .select("title description summary createdAt ipfsHash"); // Select fields to return

        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch patient records" });
    }
});

// Get Full Record Details (For Institution)
router.get("/institution/record/:recordId", authMiddleware, async (req, res) => {
    try {
        const { recordId } = req.params;
        const Content = require("../models/Contents");

        // 1. Find Record
        const record = await Content.findById(recordId).select("+encryptionKey");
        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        // 2. Verify Access
        const access = await AccessRequest.findOne({
            requester: req.user.id,
            owner: record.owner,
            status: "approved"
        });

        if (!access) {
            return res.status(403).json({ error: "Access denied. No approved consultation found." });
        }

        // 3. Fetch from IPFS and Decrypt
        let payload;
        try {
            const payloadStr = await getFromIPFS(record.ipfsHash);
            payload = JSON.parse(payloadStr);
        } catch (e) {
            console.error("IPFS/Parse Error:", e);
            return res.status(500).json({ error: "Failed to retrieve or parse record data from IPFS" });
        }

        let decryptedData;
        try {
            decryptedData = decryptData(
                payload.encrypted,
                record.encryptionKey,
                payload.iv,
                payload.authTag
            );
        } catch (e) {
            console.error("Decryption Error:", e);
            return res.status(500).json({ error: "Failed to decrypt record data. Key mismatch or corruption." });
        }

        res.json({
            ...record.toObject(),
            data: decryptedData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch record details" });
    }
});

module.exports = router;
