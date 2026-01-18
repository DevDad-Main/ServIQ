import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/status", {
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/", { replace: true });
          return;
        }

        const data = await response.json();

        if (data.success && data.data?.authenticated) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        navigate("/", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050509] text-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
