import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from "react";
import apiClient from "../lib/api";

interface User {
  email: string;
  organization_id: string;
}

interface Metadata {
  business_name: string;
  website_url: string;
  external_links?: string;
}

interface AppContextType {
  user: User | null;
  metadata: Metadata | null;
  loading: boolean;
  initialized: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  refreshMetadata: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initRef = useRef(false);

  const checkAuth = useCallback(async () => {
    if (initRef.current) return;
    initRef.current = true;

    setLoading(true);

    try {
      const [authRes, metadataRes] = await Promise.all([
        apiClient.get("/api/auth/status"),
        apiClient.get("/api/metadata/fetch"),
      ]);

      const authData = authRes.data as {
        success: boolean;
        data?: {
          authenticated: boolean;
          user?: User;
        };
      };

      const metadataData = metadataRes.data as {
        success: boolean;
        data?: {
          exists: boolean;
          data?: Metadata;
        };
      };

      if (authData.success && authData.data?.authenticated && authData.data?.user) {
        setUser(authData.data.user);
      } else {
        setUser(null);
      }

      if (metadataData.success && metadataData.data?.exists && metadataData.data?.data) {
        const data = metadataData.data.data;
        setMetadata({
          business_name: (data as any).business_name || (data as any).businessName || "",
          website_url: (data as any).website_url || (data as any).websiteUrl || "",
          external_links: (data as any).external_links || (data as any).externalLinks,
        });
      } else {
        setMetadata(null);
      }
    } catch (error) {
      setUser(null);
      setMetadata(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const refreshMetadata = useCallback(async () => {
    try {
      const metadataRes = await apiClient.get("/api/metadata/fetch");
      const metadataData = metadataRes.data as {
        success: boolean;
        data?: {
          exists: boolean;
          data?: Record<string, unknown>;
        };
      };

      if (metadataData.success && metadataData.data?.exists && metadataData.data?.data) {
        const data = metadataData.data.data;
        setMetadata({
          business_name: (data as any).business_name || (data as any).businessName || "",
          website_url: (data as any).website_url || (data as any).websiteUrl || "",
          external_links: (data as any).external_links || (data as any).externalLinks,
        });
      } else {
        setMetadata(null);
      }
    } catch (error) {
      console.error("Failed to refresh metadata:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setMetadata(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AppContext.Provider value={{ user, metadata, loading, initialized, checkAuth, logout, refreshMetadata }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
