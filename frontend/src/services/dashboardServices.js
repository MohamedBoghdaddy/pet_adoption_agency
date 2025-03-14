import axios from "axios";

// ✅ API Base URL
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://hedj.onrender.com");

// ✅ Employee API Calls
export const fetchEmployees = async () => {
  return axios.get(`${API_URL}/api/employees/getall`, {
    withCredentials: true,
  });
};

export const createEmployee = async (employeeData) => {
  return axios.post(`${API_URL}/api/employees/create`, employeeData, {
    withCredentials: true,
  });
};

export const updateEmployee = async (id, updatedData) => {
  return axios.put(`${API_URL}/api/employees/update/${id}`, updatedData, {
    withCredentials: true,
  });
};

export const deleteEmployee = async (id) => {
  return axios.delete(`${API_URL}/api/employees/delete/${id}`, {
    withCredentials: true,
  });
};

// ✅ Product API Calls
export const fetchProducts = async () => {
  return axios.get(`${API_URL}/api/products`, { withCredentials: true });
};

export const createProduct = async (productData) => {
  return axios.post(`${API_URL}/api/products`, productData, {
    withCredentials: true,
  });
};

export const updateProduct = async (id, updatedData) => {
  return axios.put(`${API_URL}/api/products/${id}`, updatedData, {
    withCredentials: true,
  });
};

export const deleteProduct = async (id) => {
  return axios.delete(`${API_URL}/api/products/${id}`, {
    withCredentials: true,
  });
};

// ✅ Analytics API Call
export const fetchAnalytics = async () => {
  return axios.get(`${API_URL}/api/analytics`, { withCredentials: true });
};

// ✅ Settings API Call
export const fetchSettings = async () => {
  return axios.get(`${API_URL}/api/settings`, { withCredentials: true });
};

// ✅ User Profile API Calls
export const fetchUserProfile = async (userId) => {
  return axios.get(`${API_URL}/api/users/${userId}`, { withCredentials: true });
};

export const updateUserProfile = async (userId, updatedProfile) => {
  return axios.put(`${API_URL}/api/users/${userId}`, updatedProfile, {
    withCredentials: true,
  });
};

/**
 * ✅ Fetch users and filter customers
 * @returns {Promise<Array>} - List of customers only
 */
export const fetchCustomers = async () => {
  try {
    console.log("📢 Fetching all users...");
    const response = await axios.get(`${API_URL}/api/users`, {
      withCredentials: true,
    });

    // ✅ Filter only customers
    const customers = response.data.filter(user => user.role === "customer");

    console.log(`✅ ${customers.length} Customers Fetched:`, customers);
    return customers; // Return only customers
  } catch (error) {
    console.error("❌ Error Fetching Customers:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch customers");
  }
};