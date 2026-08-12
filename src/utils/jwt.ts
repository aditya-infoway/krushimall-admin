import { Capacitor } from "@capacitor/core";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axios";

const storage = Capacitor.isNativePlatform()
  ? localStorage
  : sessionStorage;

const LOGIN_PATH = "/krushimall-admin/login";

const isTokenValid = (authToken: string): boolean => {
  try {
    const decoded: { exp?: number } = jwtDecode(authToken);

    if (!decoded.exp) {
      console.error("Token does not contain an expiration time.");
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return false;
  }
};

const setSession = (authToken?: string | null): void => {
  if (
    typeof authToken === "string" &&
    authToken.trim() !== ""
  ) {
    storage.setItem("authToken", authToken);

    axiosInstance.defaults.headers.common.Authorization =
      `Bearer ${authToken}`;
  } else {
    storage.removeItem("authToken");

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

// Check token before request
axiosInstance.interceptors.request.use((config) => {
  const authToken = storage.getItem("authToken");

  if (authToken && !isTokenValid(authToken)) {
    storage.removeItem("authToken");

    delete axiosInstance.defaults.headers.common.Authorization;

    window.location.href = LOGIN_PATH;

    return Promise.reject(new Error("Session expired"));
  }

  return config;
});

// Handle 401
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      setSession(null);

      window.location.href = LOGIN_PATH;
    }

    return Promise.reject(error);
  },
);

export {
  isTokenValid,
  setSession,
  storage,
};