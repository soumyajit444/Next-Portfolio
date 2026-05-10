import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://next-portfolio-production-8c7c.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
