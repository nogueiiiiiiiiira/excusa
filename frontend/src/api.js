import axios from "axios";

// axios instance with base url from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default api;
