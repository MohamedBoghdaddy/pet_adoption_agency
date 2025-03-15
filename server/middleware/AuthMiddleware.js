import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ✅ Middleware: Ensure User is Authenticated
 * - Checks for a valid JWT token in headers or cookies.
 * - If valid, attaches the user object to `req.user`.
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers["authorization"]; // ✅ Read token from headers

    // ✅ Extract token from Bearer authorization header
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7);
    } else if (req.cookies?.user) {
      // ✅ If no token in headers, check in cookies/local storage
      const storedUser = JSON.parse(req.cookies.user);
      token = storedUser?.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // ✅ Verify Token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    // ✅ Fetch User from DB
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Invalid authentication." });
    }

    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error);
    res.status(401).json({ message: "Unauthorized access." });
  }
};

/**
 * ✅ Middleware: Ensure User is Admin or Employee
 * - Only allows users with the role "admin" or "employee".
 * - Requires `isAuthenticated` to be run before this middleware.
 */
export const verifyAdminOrEmployee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (!["admin", "employee"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access forbidden. Admins and employees only." });
  }

  console.log("✅ Verified Admin or Employee:", req.user.role);
  next();
};

/**
 * ✅ Middleware: Ensure User is Admin
 * - Only allows users with the role "admin".
 * - Requires `isAuthenticated` to be run before this middleware.
 */
export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required." });
  }

  console.log("✅ Verified Admin:", req.user.role);
  next();
};
