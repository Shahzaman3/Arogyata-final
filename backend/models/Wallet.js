const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Wallet = require("../models/Wallet");   // <-- ADDED

// In-memory nonce store
const nonces = new Map();

/* --------------------------------------------------
   GET /nonce
   Generates a random nonce for a wallet address
----------------------------------------------------- */
router.get('/nonce', (req, res) => {
    const { address } = req.query;

    if (!address)
        return res.status(400).json({ error: "Address required" });

    const nonce = crypto.randomBytes(16).toString("hex");
    nonces.set(address.toLowerCase(), nonce);

    res.json({ nonce });
});

/* --------------------------------------------------
   POST /verify
   Verifies signature + issues access/refresh tokens
----------------------------------------------------- */
router.post('/verify', async (req, res) => {
    const { address, signature } = req.body;

    if (!address || !signature)
        return res.status(400).json({ error: "Missing params" });

    const nonce = nonces.get(address.toLowerCase());
    if (!nonce)
        return res.status(400).json({ error: "Nonce missing or expired" });

    const message = `Sign this message to verify ownership: ${nonce}`;

    try {
        const recovered = ethers.verifyMessage(message, signature);

        if (recovered.toLowerCase() !== address.toLowerCase())
            return res.status(401).json({ error: "Invalid signature" });

        // -----------------------------------------
        // 1. Create/Find User
        // -----------------------------------------
        let user = await User.findOne({ address: recovered.toLowerCase() });

        if (!user) {
            user = await User.create({
                name: "Wallet User",
                email: `${recovered.toLowerCase()}@walletuser.dev`,
                password: "wallet-login", // Dummy
                address: recovered.toLowerCase(),
                role: "user"
            });
        }

        // -----------------------------------------
        // 2. Create/Find Wallet
        // -----------------------------------------
        let wallet = await Wallet.findOne({ address: recovered.toLowerCase() });

        if (!wallet) {
            wallet = await Wallet.create({
                owner: user._id,
                address: recovered.toLowerCase(),
                type: "connected"
            });
        }

        // -----------------------------------------
        // 3. Issue Access Token
        // -----------------------------------------
        const accessToken = jwt.sign(
            { userId: user._id, address: recovered.toLowerCase() },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        // -----------------------------------------
        // 4. Issue Refresh Token
        // -----------------------------------------
        const refreshToken = jwt.sign(
            { userId: user._id, address: recovered.toLowerCase() },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
        );

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Clear nonce
        nonces.delete(address.toLowerCase());

        return res.json({
            success: true,
            accessToken,
            refreshToken,
            user,
            wallet
        });

    } catch (err) {
        console.error("Signature verification failed:", err);
        return res.status(500).json({ error: "Verification failed" });
    }
});

/* --------------------------------------------------
   POST /refresh
   Refreshes the access token using refresh token
----------------------------------------------------- */
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.status(400).json({ error: "Refresh token required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken)
            return res.status(401).json({ error: "Invalid refresh token" });

        const newAccessToken = jwt.sign(
            { userId: user._id, address: user.address },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        return res.json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
});

/* --------------------------------------------------
   GET /profile  (protected)
----------------------------------------------------- */
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    const wallet = await Wallet.findOne({ owner: req.user.id });

    res.json({
        user,
        wallet,
        message: "Wallet profile loaded"
    });
});

module.exports = router;
