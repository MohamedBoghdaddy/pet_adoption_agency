// src/routes/petRoutes.js
import express from "express";
import multer from "multer";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  uploadPetImage,
  validatePet,
} from "../controller/petcontroller.js";

import {
  isAuthenticated,
  verifyAdminOrEmployee,
  verifyAdmin,
} from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ✅ Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Routes

// 🔹 Upload Pet Image
router.post(
  "/upload",
  isAuthenticated,
  verifyAdminOrEmployee,
  upload.single("photo"),
  uploadPetImage
);

// 🔹 Create New Pet
router.post(
  "/create",
  isAuthenticated,
  verifyAdminOrEmployee,
  upload.single("photo"), // handle image upload
  createPet
);

// 🔹 Get All Pets (Public)
router.get("/", getPets);

// 🔹 Get Pet by ID (Public)
router.get("/:id", getPetById);

// 🔹 Update Pet Info
router.put(
  "/update/:id",
  isAuthenticated,
  verifyAdminOrEmployee,
  validatePet,
  updatePet
);

// 🔹 Delete Pet
router.delete("/delete/:id", isAuthenticated, verifyAdmin, deletePet);

export default router;
