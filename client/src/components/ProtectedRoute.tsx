import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { useMetadata } from "../hooks/useApi";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const { metadata, loading: metadataLoading } = useMetadata();
  const [redirectState, setRedirectState] = useState<"none" | "toSetup" | "toDashboard">("none");

  useEffect(() => {
    if (authLoading || metadataLoading) return;

    if (!user) {
      console.log("[PROTECTED_ROUTE] No user, redirecting to home");
      setRedirectState("none");
      return;
    }

    if (!metadata) {
      console.log("[PROTECTED_ROUTE] No metadata, redirecting to /setup");
      setRedirectState("toSetup");
      return;
    }

    if (location.pathname === "/setup") {
      console.log("[PROTECTED_ROUTE] Has metadata but on /setup, redirecting to /dashboard");
      setRedirectState("toDashboard");
      return;
    }

    setRedirectState("none");
  }, [user, authLoading, metadataLoading, metadata, location.pathname]);

  if (authLoading || metadataLoading) {
    return (
      <div className="flex-1 flex w-full items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (redirectState === "toSetup") {
    return <Navigate to="/setup" replace />;
  }

  if (redirectState === "toDashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
