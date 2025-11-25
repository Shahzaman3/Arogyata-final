const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema({
    contentHash: { type: String, required: true },

    requester: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },

    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },

    purpose: { type: String, default: "" },

    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },

}, { timestamps: true });

module.exports = mongoose.model("AccessRequest", accessRequestSchema);
