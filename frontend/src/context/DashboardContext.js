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
  fetchPets,
  createPet,
  updatePet,
  deletePet,
  fetchAdopters,
  fetchAdoptionApplications,
  fetchReports,
  generateAdoptionReport,
  downloadReport,
  fetchUserProfile,
  fetchAdoptionAnalytics,
} from "../services/dashboardServices";
import { authHeader } from "../utils/authHeader";
import axios from "axios";

// API Base URL
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://pet-adoption-agency.onrender.com");

export const DashboardContext = createContext();

// Initial State
const initialState = {
  pets: [],
  adopters: [],
  adoptionApplications: [],
  reports: [],
  profile: null,
  loading: true,
  error: null,
  analytics: {
    totalAdoptions: 0,
    totalPets: 0,
    totalAdopters: 0,
    adoptionTrend: [],
    adoptionMonths: [],
  },
};

// Reducer
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, ...action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_PROFILE":
      return { ...state, profile: action.payload };
    case "UPDATE_ANALYTICS":
      return { ...state, analytics: action.payload };
    default:
      return state;
  }
};

// Provider
export const DashboardProvider = ({ children }) => {
  const { state: authState } = useAuthContext();
  const { user, isAuthenticated } = authState;
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated || !user?._id) return;

    dispatch({ type: "FETCH_START" });

    try {
      const [
        petsRes,
        adoptersRes,
        applicationsRes,
        reportsRes,
        profileRes,
        analyticsRes,
      ] = await Promise.allSettled([
        fetchPets(),
        fetchAdopters(),
        fetchAdoptionApplications(),
        fetchReports(),
        fetchUserProfile(user._id),
        fetchAdoptionAnalytics(),
      ]);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          pets: petsRes.status === "fulfilled" ? petsRes.value : [],
          adopters: adoptersRes.status === "fulfilled" ? adoptersRes.value : [],
          adoptionApplications:
            applicationsRes.status === "fulfilled" ? applicationsRes.value : [],
          reports: reportsRes.status === "fulfilled" ? reportsRes.value : [],
          profile:
            profileRes.status === "fulfilled" ? profileRes.value.data : null,
        },
      });

      if (analyticsRes.status === "fulfilled") {
        dispatch({
          type: "UPDATE_ANALYTICS",
          payload: analyticsRes.value.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.response?.data?.message || "Failed to load dashboard",
      });
      toast.error("Failed to load dashboard data");
    }
  }, [isAuthenticated, user]);

  // Profile Fetch
  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await fetchUserProfile(user._id);
      dispatch({ type: "UPDATE_PROFILE", payload: response.data });
    } catch (error) {
      toast.error("Failed to load profile.");
    }
  }, [user]);

  // CRUD Pets
  const handleCreatePet = useCallback(
    async (petData) => {
      try {
        await createPet(petData);
        fetchDashboardData();
        toast.success("Pet added successfully!");
      } catch (error) {
        toast.error("Error creating pet record");
      }
    },
    [fetchDashboardData]
  );

  const handleUpdatePet = useCallback(
    async (id, updatedData) => {
      try {
        await updatePet(id, updatedData);
        fetchDashboardData();
        toast.success("Pet updated successfully!");
      } catch (error) {
        toast.error("Error updating pet record");
      }
    },
    [fetchDashboardData]
  );

  const handleDeletePet = useCallback(
    async (id) => {
      try {
        await deletePet(id);
        fetchDashboardData();
        toast.success("Pet removed successfully!");
      } catch (error) {
        toast.error("Error deleting pet record");
      }
    },
    [fetchDashboardData]
  );

  // Adoption Application Actions
  const handleApproveApplication = useCallback(
    async (applicationId) => {
      try {
        await axios.patch(
          `${API_URL}/api/adoption-applications/${applicationId}/approve`,
          {},
          authHeader()
        );
        fetchDashboardData();
        toast.success("Application approved!");
      } catch (error) {
        toast.error("Error approving application");
      }
    },
    [fetchDashboardData]
  );

  const handleRejectApplication = useCallback(
    async (applicationId) => {
      try {
        await axios.patch(
          `${API_URL}/api/adoption-applications/${applicationId}/reject`,
          {},
          authHeader()
        );
        fetchDashboardData();
        toast.success("Application rejected!");
      } catch (error) {
        toast.error("Error rejecting application");
      }
    },
    [fetchDashboardData]
  );

  // Reports
  const handleGenerateReport = useCallback(
    async (reportData) => {
      try {
        await generateAdoptionReport(reportData);
        fetchDashboardData();
        toast.success("Report generated successfully!");
      } catch (error) {
        toast.error("Error generating report");
      }
    },
    [fetchDashboardData]
  );

  const handleDownloadReport = useCallback(async (reportId) => {
    try {
      const blob = await downloadReport(reportId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `adoption-report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Error downloading report");
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, [fetchDashboardData, fetchProfile]);

  const contextValue = useMemo(
    () => ({
      state,
      fetchDashboardData,
      fetchProfile,
      fetchReports,
      handleCreatePet,
      handleUpdatePet,
      handleDeletePet,
      handleApproveApplication,
      handleRejectApplication,
      handleGenerateReport,
      handleDownloadReport,
    }),
    [
      state,
      fetchDashboardData,
      fetchProfile,
      handleCreatePet,
      handleUpdatePet,
      handleDeletePet,
      handleApproveApplication,
      handleRejectApplication,
      handleGenerateReport,
      handleDownloadReport,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardProvider;
