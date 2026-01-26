import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error),
);

export const authApi = {
  status: () => apiClient.get("/api/auth/status"),
  logout: () => apiClient.post("/api/auth/logout"),
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
    apiClient.get<{ success: boolean; data?: { sources: import("@/types/types").KnowledgeSource[] } }>(
      "/api/knowledge/fetch",
    ),
  store: async (data: StoreKnowledgeData) => {
    if (data.type === "upload" && data.file) {
      const formData = new FormData();
      formData.append("type", "upload");
      formData.append("file", data.file, data.file.name);
      return apiClient.post("/api/knowledge/store", formData);
    }
    return apiClient.post("/api/knowledge/store", data);
  },
  delete: (id: string) => apiClient.delete(`/api/knowledge/${id}`),
};

export const chatbotApi = {
  fetch: () => apiClient.get("/api/chatbot/fetch"),
};

export const sectionsApi = {
  fetch: () =>
    apiClient.get<{ success: boolean; data?: { sections: import("@/types/types").Section[] } }>(
      "/api/section/fetch",
    ),
  create: (data: import("@/types/types").CreateSectionData) =>
    apiClient.post("/api/sections/create", data),
  update: (id: string, data: import("@/types/types").UpdateSectionData) =>
    apiClient.put(`/api/sections/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/sections/${id}`),
};

export default apiClient;
