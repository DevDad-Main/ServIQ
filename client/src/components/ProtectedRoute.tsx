import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../lib/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, metadata, loading, initialized } = useApp();
  const location = useLocation();
  const [redirectState, setRedirectState] = useState<"none" | "toSetup" | "toDashboard">("none");

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      setRedirectState("none");
      return;
    }

    if (!metadata) {
      setRedirectState("toSetup");
      return;
    }

    if (location.pathname === "/setup") {
      setRedirectState("toDashboard");
      return;
    }

    setRedirectState("none");
  }, [user, metadata, initialized, location.pathname]);

  if (loading || !initialized) {
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
