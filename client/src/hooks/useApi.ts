import { useState, useEffect, useCallback } from "react";
import type { AxiosResponse } from "axios";
import apiClient from "../lib/api";
import type {
  KnowledgeSource,
  Section,
  CreateSectionData,
  UpdateSectionData,
} from "@/types/types";
import type { StoreKnowledgeData } from "../lib/api";

interface UseAxiosOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAxiosResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAxios<T = unknown>(
  url: string,
  options: UseAxiosOptions<T> = {},
): UseAxiosResult<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await apiClient.get(url);
      const result = response.data;

      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        const typedResponse = response.data as { data: T };
        setData(typedResponse.data);
        onSuccess?.(typedResponse.data);
      } else {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export interface UseKnowledgeResult {
  sources: KnowledgeSource[];
  loading: boolean;
  error: Error | null;
  fetchSources: () => Promise<void>;
  storeKnowledge: (data: StoreKnowledgeData) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
}

export function useKnowledge(): UseKnowledgeResult {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/api/knowledge/fetch");
      const responseData = response.data as {
        success: boolean;
        data?: {
          sources?: KnowledgeSource[];
        };
      };

      if (responseData.success && responseData.data?.sources) {
        setSources(responseData.data.sources);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch knowledge"),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const storeKnowledge = useCallback(
    async (data: StoreKnowledgeData) => {
      setLoading(true);
      setError(null);

      try {
        if (data.type === "upload" && data.file) {
          const formData = new FormData();
          formData.append("type", "upload");
          formData.append("file", data.file, data.file.name);
          await apiClient.post("/api/knowledge/store", formData);
        } else {
          await apiClient.post("/api/knowledge/store", data);
        }
        await fetchSources();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to store knowledge"),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSources],
  );

  const deleteKnowledge = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/api/knowledge/${id}`);
      setSources((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete knowledge"),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  return {
    sources,
    loading,
    error,
    fetchSources,
    storeKnowledge,
    deleteKnowledge,
  };
}

export interface UseSectionsResult {
  sections: Section[];
  loading: boolean;
  error: Error | null;
  fetchSections: () => Promise<void>;
  createSection: (data: CreateSectionData) => Promise<void>;
  updateSection: (id: string, data: UpdateSectionData) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
}

export function useSections(): UseSectionsResult {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);

      try {
        const response = await apiClient.get("/api/section/fetch");
      const responseData = response.data as {
        success: boolean;
        data?: Section[];
      };

      if (responseData.success && responseData.data) {
        setSections(responseData.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch sections"),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(
    async (data: CreateSectionData) => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.post("/api/section/create", data);
        await fetchSections();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to create section"),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSections],
  );

  const updateSection = useCallback(
    async (id: string, data: UpdateSectionData) => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.put(`/api/section/${id}`, data);
        await fetchSections();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update section"),
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchSections],
  );

  const deleteSection = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/api/section/delete/${id}`);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete section"),
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return {
    sections,
    loading,
    error,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  };
}
