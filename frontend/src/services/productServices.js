import axios from "axios";

// ✅ Backend API Base URL
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://hedj.onrender.com");

/**
 * ✅ Upload Product Image
 * Uses Multer on the backend to upload images & returns the image URL.
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `${API_URL}/api/products/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("✅ Image Uploaded:", response.data.imageUrl);
    return response.data.imageUrl;
  } catch (error) {
    console.error("❌ Image Upload Error:", error);
    throw new Error("Failed to upload image.");
  }
};

/**
 * ✅ Create Product (Admins & Employees Only)
 */
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/products/create`,
      productData,
      {
        withCredentials: true,
      }
    );
    console.log("✅ Product Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error Creating Product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

/**
 * ✅ Fetch All Products
 */
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`, {
      withCredentials: true,
    });
    console.log("✅ Products Fetched:", response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error Fetching Products:", error);
    return [];
  }
};

/**
 * ✅ Update Product
 */
export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/products/${productId}`,
      updatedData,
      {
        withCredentials: true,
      }
    );
    console.log("✅ Product Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error Updating Product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

/**
 * ✅ Delete Product
 */
export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_URL}/api/products/${productId}`, {
      withCredentials: true,
    });
    console.log("✅ Product Deleted Successfully");
  } catch (error) {
    console.error("❌ Error Deleting Product:", error);
    throw new Error("Failed to delete product");
  }
};

/**
 * ✅ Fetch Products by Category
 */
export const fetchProductsByCategory = async (category) => {
  try {
    console.log(`📢 Fetching products in category: ${category}`);
    const response = await axios.get(
      `${API_URL}/api/products?category=${category}`,
      {
        withCredentials: true,
      }
    );
    console.log(`✅ Products Fetched for Category: ${category}`, response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error Fetching Products by Category:", error);
    throw new Error("Failed to fetch products by category");
  }
};

// ✅ Add Product to Cart (Users Only)
export const addToCart = async (item) => {
  try {
    if (!item || !item.id) {
      throw new Error("Invalid product data. Missing product ID.");
    }

    console.log("🛒 Adding to Cart:", item);

    const response = await axios.post(
      `${API_URL}/api/products/cart/add`,
      { productId: item.id, quantity: 1 }, // ✅ Ensure correct field name
      { withCredentials: true } // ✅ Ensures session authentication
    );

    console.log("✅ Product added to cart!", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding to cart:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};






// ✅ Remove Product from Cart (Users Only)
export const removeFromCart = async (itemId) => {
  try {
    console.log(`❌ Removing Product [ID: ${itemId}] from Cart...`);
    await axios.delete(`${API_URL}/api/cart/${itemId}`, {
      withCredentials: true,
    });
    console.log("✅ Product Removed from Cart");
  } catch (error) {
    console.error("❌ Error Removing from Cart:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove from cart"
    );
  }
};

// ✅ Add Product to Wishlist (Users Only)
export const addToWishlist = async (item) => {
  try {
    console.log("💖 Adding to Wishlist:", item);
    await axios.post(
      `${API_URL}/api/products/wishlist`,
      { item },
      { withCredentials: true }
    );
    console.log("✅ Product Added to Wishlist");
  } catch (error) {
    console.error("❌ Error Adding to Wishlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add to wishlist"
    );
  }
};

// ✅ Remove Product from Wishlist (Users Only)
export const removeFromWishlist = async (itemId) => {
  try {
    console.log(`💔 Removing Product [ID: ${itemId}] from Wishlist...`);
    await axios.delete(`${API_URL}/api/wishlist/${itemId}`, {
      withCredentials: true,
    });
    console.log("✅ Product Removed from Wishlist");
  } catch (error) {
    console.error("❌ Error Removing from Wishlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove from wishlist"
    );
  }
};

// ✅ Checkout & Clear Cart (Users Only)
export const checkout = async (cartItems) => {
  try {
    console.log("💰 Processing Checkout...");
    await axios.post(
      `${API_URL}/api/checkout`,
      { cartItems },
      { withCredentials: true }
    );
    console.log("✅ Checkout Successful");
  } catch (error) {
    console.error("❌ Error During Checkout:", error);
    throw new Error(error.response?.data?.message || "Checkout failed");
  }
};
