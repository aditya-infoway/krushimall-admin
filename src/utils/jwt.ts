import { jwtDecode } from "jwt-decode";
import axios from "./axios";

const isTokenValid = (authToken: string): boolean => {
  try {
    const decoded: { exp?: number } = jwtDecode(authToken);
    if (!decoded.exp) {
      console.error("Token does not contain an expiration time.");
      return false;
    }

    const currentTime = Date.now() / 1000; // Current time in seconds since epoch
    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return false;
  }
};

const setSession = (authToken?: string | null): void => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    // Store token in session storage
    localStorage.setItem("authToken", authToken);

    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    // Remove token from session storage
   localStorage.removeItem("authToken");

    delete axios.defaults.headers.common.Authorization;
  }
};

export { isTokenValid, setSession };
