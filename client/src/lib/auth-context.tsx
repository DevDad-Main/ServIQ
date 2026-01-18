import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from "react";
import { authApi } from "../lib/api";

interface User {
  email: string;
  organization_id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const checkAuthRef = useRef(false);

  const checkAuth = useCallback(async () => {
    if (checkAuthRef.current) return;
    checkAuthRef.current = true;
    setLoading(true);

    try {
      const response = await authApi.status();
      const data = response.data as {
        success: boolean;
        data?: {
          authenticated: boolean;
          user?: User;
        };
      };

      console.log("[AUTH] Status response:", data);

      if (data.success && data.data?.authenticated && data.data?.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[AUTH] Error checking auth status:", error);
      setUser(null);
    } finally {
      setLoading(false);
      checkAuthRef.current = false;
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("[AUTH] Timeout, setting loading to false");
        setLoading(false);
      }
    }, 5000);

    checkAuth();

    return () => clearTimeout(timeout);
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("[AUTH] Logout error:", error);
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
