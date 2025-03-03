import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3015/api/v1/signalling", // Set backend API URL
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
