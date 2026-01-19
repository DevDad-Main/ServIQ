import { useAuth } from "@/lib/auth-context";
import { useMetadata } from "@/hooks/useApi";
import { useEffect, useState } from "react";

export function DashboardLoader({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { metadata, loading: metadataLoading, refetch: refetchMetadata } = useMetadata();

  const isLoading = authLoading || metadataLoading;

  useEffect(() => {
    if (user && !metadata && !metadataLoading) {
      refetchMetadata();
    }
  }, [user, metadata, metadataLoading, refetchMetadata]);

  if (isLoading) {
    return <LoadingScreen metadata={metadata} />;
  }

  if (!metadata) {
    return null;
  }

  return <>{children}</>;
}

function LoadingScreen({ metadata }: { metadata: { business_name?: string } | null }) {
  const messages = [
    "Preparing your dashboard...",
    "Loading your workspace...",
    "Fetching your data...",
    "Almost there...",
    "Setting things up...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[60vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
      <p className="mt-8 text-lg text-zinc-400 animate-pulse">
        {messages[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        Setting up {metadata?.business_name || "your workspace"}
      </p>
    </div>
  );
}

export default DashboardLoader;
