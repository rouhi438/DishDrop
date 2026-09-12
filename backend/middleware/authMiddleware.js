const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/env");

function readBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

function authenticate(required) {
  return (req, res, next) => {
    const token = readBearerToken(req);
    if (!token) {
      if (required) return res.status(401).json({ error: "Authentication required" });
      return next();
    }
    try {
      const decoded = jwt.verify(token, getJwtSecret());
      req.userId = String(decoded.id);
      req.userUsername = decoded.username;
      req.userIsAdmin = Boolean(decoded.isAdmin);
      return next();
    } catch (error) {
      if (error.message?.startsWith("Missing required environment variable")) return next(error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = authenticate(true);
module.exports.optionalAuth = authenticate(false);
module.exports.readBearerToken = readBearerToken;
