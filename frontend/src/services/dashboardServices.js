import axios from "axios";

// ✅ API Base URL
const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://hedj.onrender.com");

// ✅ Staff API Calls (previously Employees)
export const fetchStaff = async () => {
  return axios.get(`${API_URL}/api/staff/getall`, {
    withCredentials: true,
  });
};

export const createStaff = async (staffData) => {
  return axios.post(`${API_URL}/api/staff/create`, staffData, {
    withCredentials: true,
  });
};

export const updateStaff = async (id, updatedData) => {
  return axios.put(`${API_URL}/api/staff/update/${id}`, updatedData, {
    withCredentials: true,
  });
};

export const deleteStaff = async (id) => {
  return axios.delete(`${API_URL}/api/staff/delete/${id}`, {
    withCredentials: true,
  });
};

// ✅ Pets API Calls (previously Products)
export const fetchPets = async () => {
  return axios.get(`${API_URL}/api/pets`, { withCredentials: true });
};

export const createPet = async (petData) => {
  return axios.post(`${API_URL}/api/pets`, petData, {
    withCredentials: true,
  });
};

export const updatePet = async (id, updatedData) => {
  return axios.put(`${API_URL}/api/pets/${id}`, updatedData, {
    withCredentials: true,
  });
};

export const deletePet = async (id) => {
  return axios.delete(`${API_URL}/api/pets/${id}`, {
    withCredentials: true,
  });
};

// ✅ Adoption Analytics API Call
export const fetchAdoptionAnalytics = async () => {
  return axios.get(`${API_URL}/api/adoption-analytics`, {
    withCredentials: true,
  });
};

// ✅ Shelter Settings API Call
export const fetchShelterSettings = async () => {
  return axios.get(`${API_URL}/api/shelter-settings`, {
    withCredentials: true,
  });
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

// ✅ Adopters API Calls (previously Customers)
export const fetchAdopters = async () => {
  try {
    console.log("📢 Fetching all adopters...");
    const response = await axios.get(`${API_URL}/api/users`, {
      withCredentials: true,
    });

    // Filter only adopters
    const adopters = response.data.filter((user) => user.role === "adopter");

    console.log(`✅ ${adopters.length} Adopters Fetched:`, adopters);
    return adopters;
  } catch (error) {
    console.error(
      "❌ Error Fetching Adopters:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch adopters"
    );
  }
};

// ✅ Adoption Applications API Calls
export const fetchAdoptionApplications = async () => {
  return axios.get(`${API_URL}/api/adoption-applications`, {
    withCredentials: true,
  });
};

export const createAdoptionApplication = async (applicationData) => {
  return axios.post(`${API_URL}/api/adoption-applications`, applicationData, {
    withCredentials: true,
  });
};

export const updateAdoptionApplication = async (id, updatedData) => {
  return axios.put(`${API_URL}/api/adoption-applications/${id}`, updatedData, {
    withCredentials: true,
  });
};

export const approveAdoptionApplication = async (id) => {
  return axios.patch(
    `${API_URL}/api/adoption-applications/${id}/approve`,
    {},
    {
      withCredentials: true,
    }
  );
};

export const rejectAdoptionApplication = async (id) => {
  return axios.patch(
    `${API_URL}/api/adoption-applications/${id}/reject`,
    {},
    {
      withCredentials: true,
    }
  );
};

// ✅ Pet Medical Records API Calls
export const fetchMedicalRecords = async (petId) => {
  return axios.get(`${API_URL}/api/pets/${petId}/medical-records`, {
    withCredentials: true,
  });
};

export const addMedicalRecord = async (petId, recordData) => {
  return axios.post(
    `${API_URL}/api/pets/${petId}/medical-records`,
    recordData,
    {
      withCredentials: true,
    }
  );
};

// ✅ Shelter Resources API Calls
export const fetchShelterResources = async () => {
  return axios.get(`${API_URL}/api/shelter-resources`, {
    withCredentials: true,
  });
};

export const updateShelterResources = async (resourcesData) => {
  return axios.put(`${API_URL}/api/shelter-resources`, resourcesData, {
    withCredentials: true,
  });
};

// ✅ Adoption Reports API Calls
export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/adoption-reports`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching adoption reports:", error);
    throw error;
  }
};

export const generateAdoptionReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_URL}/api/adoption-reports/generate`, reportData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating adoption report:", error);
    throw error;
  }
};

export const downloadReport = async (reportId) => {
  try {
    const response = await axios.get(`${API_URL}/api/adoption-reports/download/${reportId}`, {
      withCredentials: true,
      responseType: 'blob' // Important for file downloads
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading report:", error);
    throw error;
  }
};