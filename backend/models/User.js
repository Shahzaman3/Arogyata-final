const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // For email/password users
    name: { type: String, default: null },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, default: null },

    // For Web3 users
    address: { type: String, unique: true, sparse: true },

    // Roles
    role: { type: String, enum: ["user", "admin", "owner", "patient", "institution", "individual"], default: "user" },

    // Individual specific
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },

    // Institution specific
    licenseId: { type: String },
    institutionType: { type: String, enum: ["hospital", "clinic", "pharmacy", "lab", "other"] },
    contactPhone: { type: String },

    // Refresh token storage
    refreshToken: { type: String, default: null }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
