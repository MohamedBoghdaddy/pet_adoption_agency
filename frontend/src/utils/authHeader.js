// utils/authHeader.js
import Cookies from "js-cookie";

export const authHeader = () => {
  const token = localStorage.getItem("token") || Cookies.get("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
};
