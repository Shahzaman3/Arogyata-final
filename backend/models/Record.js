const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
    title: { type: String },
    description: { type: String },
    ipfsHash: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    contentType: { type: String },
    private: { type: Boolean, default: true },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);
