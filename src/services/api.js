import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.minershub.online/fifa/api"
});

export default api;