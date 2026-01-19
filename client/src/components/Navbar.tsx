import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";

const AUTH_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "/api/auth";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    success("Successfully signed out");
    navigate("/", { replace: true });
    setIsLoggingOut(false);
  };

  if (loading) {
    return (
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm border-b border-white/5 bg-[#050509]/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-black rounded-[1px]"></div>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white/90">
              ServIQ
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-sm border-b border-white/5 bg-[#050509]/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-black rounded-[1px]"></div>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white/90">
            ServIQ
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-light text-zinc-400">
          <Link to="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            to="/#how-it-works"
            className="hover:text-white transition-colors"
          >
            Integration
          </Link>
          <Link to="/#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="h-10 px-4 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <>
              <a
                href={AUTH_URL}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </a>
              <a
                href={AUTH_URL}
                className="text-xs font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
