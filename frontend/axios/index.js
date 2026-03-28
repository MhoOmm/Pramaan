import axios from "axios";

const api = axios.create({
  baseURL: "https://pramaan-omega.vercel.app",
  withCredentials: true,
});

export default api;