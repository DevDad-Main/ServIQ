import { useState, useEffect } from "react";

const AUTH_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "/api/auth";

interface User {
  email: string;
  organization_id: string;
}

interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useUser = (): UseUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${AUTH_URL}/status`, {
          credentials: "include",
        });

        console.log("RESPONSE: ", response);

        if (!response.ok) {
          if (response.status === 401) {
            setUser(null);
          } else {
            setError("Failed to fetch user");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setError("Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
