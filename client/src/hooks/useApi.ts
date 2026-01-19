import { useState, useEffect, useCallback } from "react";
import type { AxiosResponse } from "axios";
import apiClient from "../lib/api";
import type { KnowledgeSource } from "@/types/types";
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

export function useAuthCheck() {
  const [user, setUser] = useState<{
    email: string;
    organization_id: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/api/auth/status");
      const responseData = response.data as {
        success: boolean;
        data?: {
          authenticated: boolean;
          user?: { email: string; organization_id: string };
        };
      };

      if (
        responseData.success &&
        responseData.data?.authenticated &&
        responseData.data?.user
      ) {
        setUser(responseData.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Auth check failed"));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, error, checkAuth, setUser };
}

export function useMetadata() {
  const [metadata, setMetadata] = useState<{
    business_name: string;
    website_url: string;
    external_links?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetadata = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/api/metadata/fetch");
      const responseData = response.data as {
        success: boolean;
        data?: {
          exists: boolean;
          source: string;
          data?: {
            business_name?: string;
            businessName?: string;
            website_url?: string;
            websiteUrl?: string;
            external_links?: string;
            externalLinks?: string;
          };
        };
      };

      if (
        responseData.success &&
        responseData.data?.exists &&
        responseData.data?.data
      ) {
        const data = responseData.data.data;
        const businessName = data.business_name || data.businessName;
        const websiteUrl = data.website_url || data.websiteUrl;
        const externalLinks = data.external_links || data.externalLinks;

        if (businessName) {
          setMetadata({
            business_name: businessName,
            website_url: websiteUrl || "",
            external_links: externalLinks,
          });
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch metadata"),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return { metadata, loading, error, refetch: fetchMetadata };
}

export interface UseKnowledgeResult {
  sources: KnowledgeSource[];
  loading: boolean;
  error: Error | null;
  fetchSources: () => Promise<void>;
  storeKnowledge: (data: StoreKnowledgeData) => Promise<void>;
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
      setError(err instanceof Error ? err : new Error("Failed to fetch knowledge"));
    } finally {
      setLoading(false);
    }
  }, []);

  const storeKnowledge = useCallback(async (data: StoreKnowledgeData) => {
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to store knowledge"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  return { sources, loading, error, fetchSources, storeKnowledge };
}
