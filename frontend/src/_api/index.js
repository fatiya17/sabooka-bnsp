import axios from "axios";
const url = "http://127.0.0.1:8000"

export const API = axios.create({
  baseURL: `${url}/api`,
})

// Interceptor untuk menangani error 401 (Token Expired / Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Hapus data login yang sudah tidak valid
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      
      // Redirect paksa ke halaman login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const APIImage = axios.create({
  baseURL: `${url}/storage`,
})

export const bookImageStorage = `${url}/storage/books`
export const authorImageStorage = `${url}/storage/authors`