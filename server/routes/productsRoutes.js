import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addToCart,
  checkout,
  validateProduct,
  addToWishlist,
  uploadImage,
  upload,
} from "../controller/productscontroller.js";

import {
  isAuthenticated,
  verifyAdminOrEmployee,
  verifyAdmin,
} from "../middleware/AuthMiddleware.js";

const router = express.Router();

// ✅ Image Upload Route (Admins & Employees Only)
router.post(
  "/upload",
  isAuthenticated,
  verifyAdminOrEmployee,
  upload.single("image"),
  uploadImage
);

// ✅ Public Routes (Accessible by All Users)
router.get("/", getProducts);
router.get("/:id", getProductById);

// ✅ Admin & Employee Routes (Requires Authentication & Role Check)
router.post("/create", isAuthenticated, verifyAdminOrEmployee, createProduct);
router.put(
  "/update/:id",
  isAuthenticated,
  verifyAdminOrEmployee,
  validateProduct,
  updateProduct
);
router.delete("/delete/:id", isAuthenticated, verifyAdmin, deleteProduct);

// ✅ User Routes (Requires Authentication)
router.post("/cart/add", isAuthenticated, addToCart);
router.post("/cart/checkout", isAuthenticated, checkout);
router.post("/wishlist", isAuthenticated, addToWishlist);

export default router;
