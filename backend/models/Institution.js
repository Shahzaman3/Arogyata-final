const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    licenseId: { type: String },
    verified: { type: Boolean, default: false },
    address: { type: String },
    contactPhone: { type: String },
    walletAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Institution", institutionSchema);
