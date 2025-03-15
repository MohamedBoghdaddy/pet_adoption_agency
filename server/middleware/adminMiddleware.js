import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Middleware: Ensure User is Admin
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }
  next();
};

export default adminMiddleware;
