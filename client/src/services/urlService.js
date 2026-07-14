import api from "./api";

export async function createShortUrl(originalUrl, customAlias, expiration) {
  const response = await api.post("/urls", { originalUrl, customAlias, expiration });
  return response.data;
}

export async function getAllUrls() {
  const response = await api.get("/urls");
  return response.data;
}

export async function deleteUrl(id) {
  const response = await api.delete(`/urls/${id}`);
  return response.data;
}

export async function updateUrl(id, data) {
  const response = await api.patch(`/urls/${id}`, data);
  return response.data;
}
