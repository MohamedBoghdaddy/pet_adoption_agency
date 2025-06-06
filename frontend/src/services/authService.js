import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};
