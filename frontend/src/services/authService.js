import { apiFetch, parseJsonResponse, setStoredToken } from "./api.js";

export async function signup({ username, email, password }) {
  const res = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
  const data = await parseJsonResponse(res);
  setStoredToken(data.token.access_token);
  return data;
}

export async function login({ email, password }) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJsonResponse(res);
  setStoredToken(data.token.access_token);
  return data;
}

export async function logout() {
  const res = await apiFetch("/auth/logout", { method: "POST" });
  if (res.ok) {
    await res.json().catch(() => ({}));
  }
  setStoredToken(null);
}

export async function fetchCurrentUser() {
  const res = await apiFetch("/auth/me");
  if (res.status === 401) {
    setStoredToken(null);
    return null;
  }
  return parseJsonResponse(res);
}
