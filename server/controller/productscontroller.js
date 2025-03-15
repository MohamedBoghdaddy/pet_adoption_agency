import asyncHandler from "express-async-handler";
import { check, validationResult } from "express-validator";
import Product from "../model/productsmodel.js";
import User from "../model/usermodel.js";
import multer from "multer";
import path from "path";


/**
 * ✅ Validate Product Inputs
 */
export const validateProduct = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("category").not().isEmpty().withMessage("Category is required"),
  check("price").isFloat({ min: 0 }).withMessage("Price must be a number"),
  check("stock").isInt({ min: 0 }).withMessage("Stock must be an integer"),
  check("images").isArray().withMessage("Images must be an array"),
];

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/", // ✅ Ensure "uploads" folder exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Multer Upload Middleware
export const upload = multer({ storage });

// ✅ Upload Image Endpoint (Separate from Product Controller)
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// ✅ Create Product API (Restricted to Admin & Employee)
export const createProduct = asyncHandler(async (req, res) => {
  console.log("📢 Incoming Product Data:", req.body);

  // ✅ Ensure only "admin" or "employee" can create a product
  if (!["admin", "employee"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Only admins or employees can create products." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("❌ Validation Errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, category, price, stock, images } = req.body;

  const validCategories = [
    "Kitchen",
    "Bedroom",
    "Day Complements",
    "Night Complements",
    "Outdoor",
  ];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
    });
  }

  const newProduct = new Product({
    name,
    description,
    category,
    price,
    stock,
    images,
    createdBy: req.user.id,
    createdByModel: req.user.role === "admin" ? "Admin" : "Employee",
  });

  await newProduct.save();
  console.log("✅ Product Created:", newProduct);

  res.status(201).json({ message: "Product created successfully", product: newProduct });
});





/**
 * ✅ Get All Products (Public Access)
 */
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ count: products.length, data: products });
});

/**
 * ✅ Get Single Product by ID (Public Access)
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.status(200).json(product);
});

/**
 * ✅ Update Product (Admins & Employees Only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock, images } = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, category, price, stock, images },
    { new: true }
  );

  if (!updatedProduct)
    return res.status(404).json({ message: "Product not found" });

  res
    .status(200)
    .json({ message: "Product updated successfully", product: updatedProduct });
});

/**
 * ✅ Delete Product (Admins & Employees Only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct)
    return res.status(404).json({ message: "Product not found" });

  res.status(200).json({ message: "Product deleted successfully" });
});

/**
 * ✅ Add to Wishlist (Customers Only)
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?._id;

  if (!userId)
    return res.status(401).json({ message: "Unauthorized. Please log in." });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.wishlist.includes(productId)) {
    return res.status(400).json({ message: "Product already in wishlist" });
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    message: "Added to wishlist successfully",
    wishlist: user.wishlist,
  });
});

/**
 * ✅ Add Product to Cart (Users Only)
 */
export const addToCart = async (req, res) => {
  try {
    console.log("📩 Received Add to Cart Request:", req.body);

    const { productId, quantity } = req.body; // ✅ Expect `productId`

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Missing product ID or quantity." });
    }

    // ✅ Fetch product from database using `productId`
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    console.log("✅ Found Product:", product.name);

    res.json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




/**
 * ✅ Checkout and Purchase (Users Only)
 */
export const checkout = asyncHandler(async (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Process payment logic (to be implemented later)
  req.session.cart = [];
  res.status(200).json({ message: "Purchase successful" });
});
