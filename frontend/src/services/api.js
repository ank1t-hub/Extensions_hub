import { API_BASE_URL, TOKEN_STORAGE_KEY } from "../utils/constants.js";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && !path.includes("/auth/login")) {
    setStoredToken(null);
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }

  return response;
}

export async function parseJsonResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.detail || data.message || "Request failed";
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return data;
}

export async function getHealth() {
  const res = await apiFetch("/health");
  return parseJsonResponse(res);
}
