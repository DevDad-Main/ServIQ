import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`[API] Error ${error.response?.status || "Network"} from ${error.config?.url}:`, error.message);
    
    if (error.response?.status === 401) {
      console.log("[API] Unauthorized, redirecting to home...");
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  status: () => apiClient.get("/api/auth/status"),
  logout: () => apiClient.post("/api/auth/logout"),
};

export const metadataApi = {
  fetch: () => apiClient.get("/api/metadata/fetch"),
  store: (data: { business_name: string; website_url: string; external_links?: string }) =>
    apiClient.post("/api/metadata/store", data),
};

export default apiClient;
