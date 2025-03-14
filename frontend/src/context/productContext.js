import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
  checkout,
} from "../services/productServices"; // ✅ Import Product Services

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);

  // ✅ Fetch Products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("❌ Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  // ✅ Define Callbacks Properly (Outside useMemo)
  const handleFetchProducts = useCallback(fetchProducts, []);
  const handleCreateProduct = useCallback(createProduct, []);
  const handleUpdateProduct = useCallback(updateProduct, []);
  const handleDeleteProduct = useCallback(deleteProduct, []);
  const handleAddToCart = useCallback(addToCart, []);
  const handleRemoveFromCart = useCallback(removeFromCart, []);
  const handleAddToWishlist = useCallback(addToWishlist, []);
  const handleRemoveFromWishlist = useCallback(removeFromWishlist, []);
  const handleCheckout = useCallback(checkout, []);

  // ✅ Context Value (Memoized to prevent re-renders)
  const contextValue = useMemo(
    () => ({
      cartItems,
      wishlistItems,
      products,
      fetchProducts: handleFetchProducts,
      createProduct: handleCreateProduct,
      updateProduct: handleUpdateProduct,
      deleteProduct: handleDeleteProduct,
      addToCart: handleAddToCart,
      removeFromCart: handleRemoveFromCart,
      addToWishlist: handleAddToWishlist,
      removeFromWishlist: handleRemoveFromWishlist,
      checkout: handleCheckout,
    }),
    [cartItems, wishlistItems, products]
  );

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

// ✅ Prop Types Validation
ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
