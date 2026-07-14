import api from "./api";

export async function createShortUrl(originalUrl) {
  const response = await api.post("/urls", { originalUrl });
  return response.data;
}
