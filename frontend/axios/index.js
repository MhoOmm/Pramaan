import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://backend-rust-beta-5dlclsgxuc.vercel.app",
  withCredentials: true,
});

export default api;