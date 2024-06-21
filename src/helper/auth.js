import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log("Time " + decoded.exp);
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token"); // Token expired, remove it from storage
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
