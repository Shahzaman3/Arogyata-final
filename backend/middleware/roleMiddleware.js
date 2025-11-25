// backend/middleware/roleMiddleware.js
/**
 * roleMiddleware.js
 * Usage: roleMiddleware(['admin','owner'])
 * If called with empty array (or no array), it allows any authenticated user.
 */
module.exports = function (allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // if no specific roles requested -> allow any authenticated user
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        return next();
      }

      const userRole = req.user.role || "user";

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden — insufficient permissions" });
      }

      next();
    } catch (err) {
      console.error("roleMiddleware error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  };
};
