import { jwtDecode } from "jwt-decode";
import axiosInstance from "./axios";

const storage = localStorage;

const LOGIN_PATH = "/krushimall-admin/login";

// Requests where a 401 means "wrong credentials", not "session expired"
const AUTH_ENDPOINTS = ["/auth/login"];

const isAuthEndpoint = (url?: string): boolean =>
  !!url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

const isOnLoginPage = (): boolean =>
  window.location.pathname.endsWith("/login");

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
  if (typeof authToken === "string" && authToken.trim() !== "") {
    storage.setItem("authToken", authToken);

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    storage.removeItem("authToken");

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

// Check token before request
axiosInstance.interceptors.request.use((config) => {
  // Never block the login request itself
  if (isAuthEndpoint(config.url)) return config;

  const authToken = storage.getItem("authToken");

  if (authToken && !isTokenValid(authToken)) {
    setSession(null);

    if (!isOnLoginPage()) {
      window.location.href = LOGIN_PATH;
    }

    return Promise.reject(new Error("Session expired"));
  }

  return config;
});

// Handle 401 (expired / invalid session only)
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (
      status === 401 &&
      !isAuthEndpoint(error.config?.url) &&
      !isOnLoginPage()
    ) {
      setSession(null);

      window.location.href = LOGIN_PATH;
    }

    return Promise.reject(error);
  },
);

export { isTokenValid, setSession, storage };