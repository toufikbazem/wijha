// middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export const requireAuth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
export const optionalAuth = () => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
