import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const api = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "Unexpected network error";
    return Promise.reject(new Error(message));
  }
);

export const shortenUrl = async (longUrl, customSlug) => {
  const payload = { url: longUrl };
  if (customSlug) payload.customSlug = customSlug;
  const { data } = await api.post("/shorten", payload);
  return data;
};

export const fetchRecentLinks = async () => {
  const { data } = await api.get("/links");
  return data;
};

export const resolveSlug = async (slug) => {
  const { data } = await api.get(`/links/${encodeURIComponent(slug)}`);
  return data;
};

export default api;
