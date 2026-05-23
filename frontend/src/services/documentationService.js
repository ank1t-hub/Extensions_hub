import { apiFetch, parseJsonResponse } from "./api.js";

export async function fetchDocumentation(extensionId) {
  const res = await apiFetch(`/docs/${extensionId}`);
  return parseJsonResponse(res);
}

export async function saveDocumentation(extensionId, markdownContent) {
  const res = await apiFetch(`/docs/${extensionId}`, {
    method: "PUT",
    body: JSON.stringify({ markdown_content: markdownContent }),
  });
  return parseJsonResponse(res);
}
