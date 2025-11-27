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

module.exports = router;
