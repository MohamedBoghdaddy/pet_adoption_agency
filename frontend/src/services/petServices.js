// src/services/petServices.js
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ??
  (window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://pet-adoption-agency.onrender.com");

// ✅ Upload Pet Photo (Admins & Employees Only)
export const uploadPetImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `${API_URL}/api/pet/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    return response.data.imageUrl;
  } catch (error) {
    console.error("❌ Upload Failed:", error);
    throw new Error("Failed to upload pet image");
  }
};

// ✅ Create New Pet (Admin/Employee Only)
export const createPet = async (petData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/pets/create`,
      petData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error Creating Pet:", error);
    throw new Error(error.response?.data?.message || "Failed to create pet");
  }
};

// ✅ Fetch All Pets
export const fetchPets = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/pets`);
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error Fetching Pets:", error);
    return [];
  }
};

// ✅ Update Pet
export const updatePet = async (petId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/pet/update/${petId}`,
      updatedData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error Updating Pet:", error);
    throw new Error(error.response?.data?.message || "Failed to update pet");
  }
};

// ✅ Delete Pet
export const deletePet = async (petId) => {
  try {
    await axios.delete(`${API_URL}/api/pet/delete/${petId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("❌ Error Deleting Pet:", error);
    throw new Error("Failed to delete pet");
  }
};
