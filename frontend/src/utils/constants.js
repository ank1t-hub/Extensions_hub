export const APP_NAME = import.meta.env.VITE_APP_NAME || "ExtensionHub";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
export const TOKEN_STORAGE_KEY = "extensionhub_token";

export const USER_ROLES = {
  ADMIN: "admin",
  DEVELOPER: "developer",
  USER: "user",
};
