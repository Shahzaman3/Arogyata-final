// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require("../models/User");

// In-memory nonce store
const nonces = new Map();

/* ======================================================
   EMAIL + PASSWORD AUTH
====================================================== */

// Signup (Email + Password)
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role: role || "user"
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.json({
            message: "Signup successful",
            token,
            user
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Login (Email + Password)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


/* ======================================================
   WEB3 SIGNATURE AUTH
====================================================== */

// Generate Nonce
router.get('/nonce', (req, res) => {
    const nonce = crypto.randomBytes(16).toString('hex');
    const { address } = req.query;

    if (!address) return res.status(400).json({ error: 'Address required' });

    nonces.set(address.toLowerCase(), nonce);
    res.json({ nonce });
});

// Verify Signature + Issue JWT
router.post('/verify', async (req, res) => {
    const { address, signature } = req.body;

    if (!address || !signature)
        return res.status(400).json({ error: 'Missing params' });

    const nonce = nonces.get(address.toLowerCase());
    if (!nonce)
        return res.status(400).json({ error: 'Nonce not found or expired' });

    const message = `Sign this message to verify ownership: ${nonce}`;

    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {

            // Create/Find user
            let user = await User.findOne({ address: recoveredAddress.toLowerCase() });

            if (!user) {
                user = await User.create({
                    address: recoveredAddress.toLowerCase(),
                    role: "user",
                    createdAt: Date.now()
                });
            }

            // ACCESS TOKEN
            const accessToken = jwt.sign(
                { address: recoveredAddress.toLowerCase(), id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
            );

            // REFRESH TOKEN
            const refreshToken = jwt.sign(
                { address: recoveredAddress.toLowerCase(), id: user._id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
            );

            user.refreshToken = refreshToken;
            await user.save();

            nonces.delete(address.toLowerCase());
            return res.json({ success: true, accessToken, refreshToken });
        } else {
            return res.status(401).json({ error: 'Invalid signature' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Verification failed' });
    }
});


// Refresh Token
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(400).json({ error: "Refresh token required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken)
            return res.status(401).json({ error: "Invalid refresh token" });

        const newAccessToken = jwt.sign(
            { id: user._id, address: user.address },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return res.json({ success: true, accessToken: newAccessToken });

    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
});


/* ======================================================
   PROTECTED PROFILE (WORKS FOR BOTH EMAIL + WEB3)
====================================================== */

const authMiddleware = require("../middleware/authMiddleware");

router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
        user,
        message: "Profile loaded successfully"
    });
});

module.exports = router;
