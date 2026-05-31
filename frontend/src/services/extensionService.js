import { apiFetch, parseJsonResponse } from "./api.js";

export async function listExtensions({ q, category, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  const res = await apiFetch(`/extensions?${params}`);
  return parseJsonResponse(res);
}

export async function getExtension(id) {
  const res = await apiFetch(`/extensions/${id}`);
  return parseJsonResponse(res);
}

export async function listCategories() {
  const res = await apiFetch("/extensions/categories/list");
  return parseJsonResponse(res);
}

export function getDownloadUrl(extensionId, version) {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
  const params = version ? `?version=${encodeURIComponent(version)}` : "";
  return `${base}/download/${extensionId}${params}`;
}

export async function listMyExtensions() {
  const res = await apiFetch("/extensions/user/me");
  return parseJsonResponse(res);
}

export async function uploadExtension(formData) {
  const res = await apiFetch("/extensions", {
    method: "POST",
    body: formData,
  });
  return parseJsonResponse(res);
}

export async function updateExtension(id, data) {
  const res = await apiFetch(`/extensions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}

export async function deleteExtension(id) {
  const res = await apiFetch(`/extensions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete extension");
  }
}

export async function uploadVersion(id, formData) {
  const res = await apiFetch(`/extensions/${id}/versions`, {
    method: "POST",
    body: formData,
  });
  return parseJsonResponse(res);
}

