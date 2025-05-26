import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUsers,
  upload,
  getUsersByRole,
  createAdmin,
} from "../controller/usercontroller.js";

import adminMiddleware from "../middleware/adminMiddleware.js";
import { isAuthenticated, verifyAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

/**
 * ✅ AUTHENTICATION ROUTES
 */
router.post("/signup", registerUser); // 🔹 User registration
router.post("/login", loginUser); // 🔹 User login
router.post("/logout", logoutUser); // 🔹 Logout user

/**
 * ✅ USER MANAGEMENT ROUTES (Requires Authentication)
 */
router.get("/", isAuthenticated, verifyAdmin, getAllUsers); // 🔹 Get all users (Admin)
router.get("/:userId", isAuthenticated, getUser); // 🔹 Get user by ID
router.put("/:userId", isAuthenticated, updateUser); // 🔹 PUT route

router.put(
  "/:userId",
  isAuthenticated,
  upload.single("photoFile"), // 🔹 Upload profile photo if provided
  updateUser
);
router.delete("/:userId", isAuthenticated, adminMiddleware, deleteUser); // 🔹 Delete user
router.get("/filter", isAuthenticated, verifyAdmin, getUsersByRole);

/**
 * ✅ ADMIN-SPECIFIC ROUTES (Requires Admin Privileges)
 */
router.get("/search", isAuthenticated, adminMiddleware, searchUsers); // 🔹 Admin user search
router.post("/create-admin", isAuthenticated, verifyAdmin, createAdmin); // 🔹 Admin creation


// Add this to validate token and return user info
router.get("/checkAuth", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});


export default router;
