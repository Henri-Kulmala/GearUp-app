import axios from "axios";

//const BASE_URL =
const BASE_URL = "http://localhost:8080";

const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  };

const csrfToken = getCsrfToken();

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": csrfToken,
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth && auth.username && auth.password) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
        console.log("Request headers:", config.headers);
      config.headers["Authorization"] = `Basic ${btoa(
        `${auth.username}:${auth.password}`
      )}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
