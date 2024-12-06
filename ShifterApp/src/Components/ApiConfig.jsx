import axios from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensure cookies like JSESSIONID are sent
});

export default api;