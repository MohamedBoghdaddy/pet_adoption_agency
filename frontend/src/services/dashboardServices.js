// ✅ FINAL VERIFIED dashboardServices.js
import axios from "axios";
import { authHeader } from "../utils/authHeader";

const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://pet-adoption-agency.onrender.com");

// ✅ STAFF (Employee) API ENDPOINTS
export const fetchStaff = async () => {
  return axios.get(`${API_URL}/api/employees/getall`, authHeader());
};

export const createStaff = async (staffData) => {
  return axios.post(`${API_URL}/api/employees/create`, staffData, authHeader());
};

export const updateStaff = async (id, updatedData) => {
  return axios.put(
    `${API_URL}/api/employees/update/${id}`,
    updatedData,
    authHeader()
  );
};

export const deleteStaff = async (id) => {
  return axios.delete(`${API_URL}/api/employees/delete/${id}`, authHeader());
};

// ✅ PETS API
export const fetchPets = async () => {
  return axios.get(`${API_URL}/api/pets`, authHeader());
};

export const createPet = async (petData) => {
  return axios.post(`${API_URL}/api/pets/create`, petData, authHeader());
};

export const updatePet = async (id, updatedData) => {
  return axios.put(
    `${API_URL}/api/pets/update/${id}`,
    updatedData,
    authHeader()
  );
};

export const deletePet = async (id) => {
  return axios.delete(`${API_URL}/api/pets/delete/${id}`, authHeader());
};

// ✅ ANALYTICS
export const fetchAdoptionAnalytics = async () => {
  return axios.get(`${API_URL}/api/analytics`, authHeader());
};

// ✅ SHELTER SETTINGS
export const fetchShelterSettings = async () => {
  return axios.get(`${API_URL}/api/settings`, authHeader());
};

export const updateShelterSettings = async (settings) => {
  return axios.put(`${API_URL}/api/settings`, settings, authHeader());
};

// ✅ USER PROFILE
export const fetchUserProfile = async (userId) => {
  return axios.get(`${API_URL}/api/users/${userId}`, authHeader());
};

export const updateUserProfile = async (userId, updatedProfile) => {
  return axios.put(
    `${API_URL}/api/users/${userId}`,
    updatedProfile,
    authHeader()
  );
};

// ✅ ADOPTERS (Users with role = 'adopter')
export const fetchAdopters = async () => {
  const response = await axios.get(`${API_URL}/api/users`, authHeader());
  return response.data.filter((user) => user.role === "adopter");
};

// ✅ ADOPTION APPLICATIONS
export const fetchAdoptionApplications = async () => {
  return axios.get(`${API_URL}/api/adoption/requests/all`, authHeader());
};

export const createAdoptionApplication = async (applicationData) => {
  return axios.post(
    `${API_URL}/api/adoption/requests/create`,
    applicationData,
    authHeader()
  );
};

export const updateAdoptionApplication = async (id, updatedData) => {
  return axios.patch(
    `${API_URL}/api/adoption/requests/update/${id}`,
    updatedData,
    authHeader()
  );
};

export const approveAdoptionApplication = async (id) => {
  return axios.patch(
    `${API_URL}/api/adoption/requests/update/${id}`,
    { status: "approved" },
    authHeader()
  );
};

export const rejectAdoptionApplication = async (id) => {
  return axios.patch(
    `${API_URL}/api/adoption/requests/update/${id}`,
    { status: "rejected" },
    authHeader()
  );
};

export const fetchApprovedRequests = async () => {
  return axios.get(`${API_URL}/api/adoption/requests/approved`, authHeader());
};

// ✅ REPORTS
export const fetchReports = async () => {
  const response = await axios.get(
    `${API_URL}/api/adoption/reports`,
    authHeader()
  );
  return response.data;
};

export const generateAdoptionReport = async (reportData) => {
  const response = await axios.post(
    `${API_URL}/api/adoption/reports/generate`,
    reportData,
    authHeader()
  );
  return response.data;
};

export const downloadReport = async (reportId) => {
  const response = await axios.get(
    `${API_URL}/api/adoption/reports/download/${reportId}`,
    {
      ...authHeader(),
      responseType: "blob",
    }
  );
  return response.data;
};
