const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema({
    contentHash: { type: String, required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    purpose: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }  // content owner's id
}, { timestamps: true });

module.exports = mongoose.model("AccessRequest", accessRequestSchema);
