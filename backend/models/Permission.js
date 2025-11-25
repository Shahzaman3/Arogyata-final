const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    record: { type: mongoose.Schema.Types.ObjectId, ref: "Record" },
    grantedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    accessLevel: { type: String, enum: ["read", "write", "full"], default: "read" },
    approved: { type: Boolean, default: false },
    expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Permission", permissionSchema);
