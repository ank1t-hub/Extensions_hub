import { API_BASE_URL } from "../utils/constants.js";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  return response;
}

export async function getHealth() {
  const res = await apiFetch("/health");
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}
