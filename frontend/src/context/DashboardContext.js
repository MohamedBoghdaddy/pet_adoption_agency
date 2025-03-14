import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productServices"; // ✅ Only relevant services
import axios from "axios";

// ✅ API Base URL
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://hedj.onrender.com");

// ✅ Create Context
export const DashboardContext = createContext();

// ✅ Initial State
const initialState = {
  products: [],
  profile: null,
  loading: true,
  error: null,
};

// ✅ Reducer Function
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      console.log("✅ FETCH_SUCCESS - Updated State:", action.payload);
      return { ...state, ...action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      console.error("❌ FETCH_ERROR - Dashboard Fetch Failed:", action.payload);
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_PROFILE":
      console.log("✅ PROFILE UPDATED:", action.payload);
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};

// ✅ Provider Component
export const DashboardProvider = ({ children }) => {
  const { state: authState } = useAuthContext();
  const { user, isAuthenticated } = authState;
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // ✅ Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      console.log("🔹 Fetching dashboard data...");

      const [productsRes, profileRes] = await Promise.allSettled([
        fetchProducts(), // ✅ Using productServices.js
        user?._id
          ? axios.get(`${API_URL}/api/users/${user._id}`, {
              withCredentials: true,
            })
          : Promise.resolve({ status: "fulfilled", value: { data: null } }),
      ]);

      console.log("✅ API responses received");

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          products: productsRes.status === "fulfilled" ? productsRes.value : [],
          profile:
            profileRes.status === "fulfilled" ? profileRes.value.data : null,
        },
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error.message);
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to load dashboard",
      });
    }
  }, [isAuthenticated, user]);

  // ✅ CRUD Functions for Products (Using `productServices.js`)
  const handleCreateProduct = useCallback(
    async (productData) => {
      try {
        await createProduct(productData);
        fetchDashboardData();
        toast.success("✅ Product added successfully!");
      } catch (error) {
        toast.error("❌ Error creating product");
      }
    },
    [fetchDashboardData]
  );

  const handleUpdateProduct = useCallback(
    async (id, updatedData) => {
      try {
        await updateProduct(id, updatedData);
        fetchDashboardData();
        toast.success("✅ Product updated successfully!");
      } catch (error) {
        toast.error("❌ Error updating product");
      }
    },
    [fetchDashboardData]
  );

  const handleDeleteProduct = useCallback(
    async (id) => {
      try {
        await deleteProduct(id);
        fetchDashboardData();
        toast.success("✅ Product deleted successfully!");
      } catch (error) {
        toast.error("❌ Error deleting product");
      }
    },
    [fetchDashboardData]
  );

  // ✅ Fetch Profile Data
  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;

    console.log("🔍 Fetching User Profile...");
    try {
      const response = await axios.get(`${API_URL}/api/users/${user._id}`, {
        withCredentials: true,
      });
      console.log("👤 Profile Fetched:", response.data);
      dispatch({ type: "UPDATE_PROFILE", payload: response.data });
    } catch (error) {
      toast.error("❌ Failed to load profile.");
      console.error("❌ Error Fetching Profile:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, [fetchDashboardData, fetchProfile]);

  // ✅ Context Value (Memoized)
  const contextValue = useMemo(
    () => ({
      state,
      fetchDashboardData,
      fetchProfile,
      handleCreateProduct,
      handleUpdateProduct,
      handleDeleteProduct,
    }),
    [
      state,
      fetchDashboardData,
      fetchProfile,
      handleCreateProduct,
      handleUpdateProduct,
      handleDeleteProduct,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// ✅ Prop Types Validation
DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardProvider;
