const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, default: "" },
    description: { type: String, default: "" },

    ipfsHash: { type: String, required: true },

    summary: { type: String, default: "" },

    previousHash: { type: String, default: null },

}, { timestamps: true });

module.exports = mongoose.model("Content", contentSchema);
