// src/context/AuthContext.js
import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://pet-adoption-agency.onrender.com");

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGOUT_SUCCESS":
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const getToken = () => {
  return Cookies.get("token") || localStorage.getItem("token");
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthHeaders = useCallback((token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  const clearAuthStorage = useCallback(() => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  // New: Store user data in localStorage
  const persistUserData = useCallback((user) => {
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const checkAuth = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const token = getToken();
      if (!token) {
        dispatch({
          type: "AUTH_ERROR",
          payload: "No authentication token found",
        });
        return;
      }

      setAuthHeaders(token);

      const response = await axios.get(`${API_URL}/api/users/checkAuth`, {
        withCredentials: true,
        timeout: 5000,
      });

      const userData = response.data?.user;
      if (!userData) {
        throw new Error("Invalid server response");
      }

      // Store user data in localStorage
      persistUserData(userData);

      // Update token storage
      Cookies.set("token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      localStorage.setItem("token", token);

      dispatch({ type: "USER_LOADED", payload: userData });
    } catch (error) {
      console.error("Auth check failed:", error.message);
      // Don't clear storage immediately on error
      dispatch({
        type: "AUTH_ERROR",
        payload: error.response?.data?.message || error.message,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [setAuthHeaders, persistUserData]);

  const handleLogout = useCallback(() => {
    clearAuthStorage();
    dispatch({ type: "LOGOUT_SUCCESS", payload: null });
  }, [clearAuthStorage]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      const storedUser = localStorage.getItem("user");

      // First: Try to hydrate from localStorage
      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthHeaders(token);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }

      // Then: Validate with server
      await checkAuth();
    };

    initializeAuth();
  }, [checkAuth, setAuthHeaders]);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      logout: handleLogout,
      checkAuth,
    }),
    [state, handleLogout, checkAuth]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
