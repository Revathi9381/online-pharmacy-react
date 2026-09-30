// API Base URL configuration
// In development: defaults to http://localhost:5000 if VITE_API_URL is not provided
// In production (Vercel): uses VITE_API_URL or defaults to relative path "" (same origin)

const API_BASE = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? "http://localhost:5000" : "");

// Remove any trailing slash to ensure clean URL concatenation
export const API_URL = API_BASE.replace(/\/+$/, "");

export default API_URL;
