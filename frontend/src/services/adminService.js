import { apiFetch, parseJsonResponse } from "./api.js";

export async function fetchUsers({ role, isActive } = {}) {
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (isActive !== undefined) params.set("is_active", String(isActive));

  const path = `/admin/users${params.toString() ? `?${params}` : ""}`;
  const res = await apiFetch(path);
  return parseJsonResponse(res);
}

export async function updateUserStatus(userId, data) {
  const res = await apiFetch(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseJsonResponse(res);
}

export async function adminDeleteExtension(extensionId) {
  const res = await apiFetch(`/admin/extensions/${extensionId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to moderate and delete extension");
  }
}
