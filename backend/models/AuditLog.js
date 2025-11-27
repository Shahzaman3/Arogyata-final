const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "ACCESS_GRANTED", "RECORD_ADDED"
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The patient or entity affected
    resource: { type: String }, // ID of the record or request involved
    details: { type: String },
    hash: { type: String }, // Mock blockchain transaction hash
    status: { type: String, default: "verified" }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);
