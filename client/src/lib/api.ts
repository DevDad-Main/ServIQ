import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { KnowledgeSource } from "@/types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[API] Content-Type: ${config.headers?.["Content-Type"] || "not set"}`);
    
    if (config.data instanceof FormData) {
      console.log("[API] FormData detected, entries:");
      for (const [key, value] of config.data.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File("${value.name}", ${value.size} bytes, "${value.type}")`);
        } else {
          console.log(`  ${key}: "${value}"`);
        }
      }
    } else {
      console.log("[API] Data:", config.data);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `[API] Response ${response.status} from ${response.config.url}`,
    );
    return response;
  },
  (error: AxiosError) => {
    console.error(
      `[API] Error ${error.response?.status || "Network"} from ${error.config?.url}:`,
      error.message,
    );

    if (error.response?.status === 401) {
      console.log("[API] Unauthorized");
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  status: async () => {
    console.log("[AUTH_API] Calling /api/auth/status");
    const response = await apiClient.get("/api/auth/status");
    console.log("[AUTH_API] Response:", response.data);
    return response;
  },
  logout: async () => {
    console.log("[AUTH_API] Calling /api/auth/logout");
    const response = await apiClient.post("/api/auth/logout");
    console.log("[AUTH_API] Logout response:", response.data);
    return response;
  },
};

export const metadataApi = {
  fetch: () => apiClient.get("/api/metadata/fetch"),
  store: (data: {
    business_name: string;
    website_url: string;
    external_links?: string;
  }) => apiClient.post("/api/metadata/store", data),
};

export interface StoreKnowledgeData {
  type: "website" | "text" | "upload";
  url?: string;
  title?: string;
  content?: string;
  file?: File;
}

export const knowledgeApi = {
  fetch: () =>
    apiClient.get<{ success: boolean; sources: KnowledgeSource[] }>(
      "/api/knowledge/fetch",
    ),
  store: async (data: StoreKnowledgeData) => {
    if (data.type === "upload" && data.file) {
      const formData = new FormData();
      formData.append("type", "upload");
      formData.append("file", data.file, data.file.name);

      console.log("[KNOWLEDGE_API] === FILE UPLOAD START ===");
      console.log("[KNOWLEDGE_API] Original file object:", {
        name: data.file.name,
        size: data.file.size,
        type: data.file.type,
        lastModified: data.file.lastModified,
      });

      console.log("[KNOWLEDGE_API] FormData before send:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `  ${key}: File(name="${value.name}", size=${value.size}, type="${value.type}")`,
          );
        } else {
          console.log(`  ${key}: "${value}"`);
        }
      }

      console.log("[KNOWLEDGE_API] Sending request to /api/knowledge/store...");

      const response = await apiClient.post("/api/knowledge/store", formData);

      console.log(
        "[KNOWLEDGE_API] Response received:",
        response.status,
        response.data,
      );
      console.log("[KNOWLEDGE_API] === FILE UPLOAD END ===");

      return response;
    }
    return apiClient.post("/api/knowledge/store", data);
  },
};

export default apiClient;
