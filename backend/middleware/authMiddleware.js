const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded contains { id, address }
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(401).json({ error: "Invalid token - user not found" });

        req.user = {
            id: user._id,
            address: user.address || null,
            email: user.email || null,
            role: user.role
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
