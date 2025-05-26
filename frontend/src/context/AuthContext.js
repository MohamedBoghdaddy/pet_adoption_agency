// src/context/AuthContext.js
import  {
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
        error: action.payload || null,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const getToken = () => {
  return (
    Cookies.get("token") ||
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("user") || "null")?.token
  );
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthHeaders = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const clearAuthStorage = useCallback(() => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const persistUserData = useCallback((user, token) => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify({ user, token }));
      Cookies.set("token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
  }, []);

  const checkAuth = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      setAuthHeaders(token);

      const response = await axios.get(`${API_URL}/api/users/checkAuth`, {
        withCredentials: true,
        timeout: 5000,
      });

      const userData = response.data?.user;
      if (!userData) throw new Error("Invalid user data");

      persistUserData(userData, token);
      dispatch({ type: "USER_LOADED", payload: userData });
    } catch (error) {
      console.error("❌ Auth check failed:", error.message);
      // Do NOT clear storage unless the error indicates token is invalid/expired
      if (error.response?.status === 401 || error.message.includes("token")) {
        dispatch({
          type: "AUTH_ERROR",
          payload:
            error.response?.data?.message ||
            error.message ||
            "Authentication failed",
        });
      }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [setAuthHeaders, persistUserData]);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setAuthHeaders(token);
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: parsedUser.user || parsedUser,
          });
        } catch (err) {
          console.error("Error parsing stored user:", err);
        }
      }

      checkAuth();
    };

    initializeAuth();
  }, [checkAuth, setAuthHeaders]);
  
  const handleLogout = useCallback(() => {
    clearAuthStorage();
    dispatch({ type: "LOGOUT_SUCCESS" });
  }, [clearAuthStorage]);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      logout: handleLogout,
      checkAuth,
      setAuthHeaders,
    }),
    [state, handleLogout, checkAuth, setAuthHeaders]
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
