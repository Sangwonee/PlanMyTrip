import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    "http://plan-my-trip-alb-26670498.ap-northeast-2.elb.amazonaws.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
