import { useAuth } from "../lib/auth-context";
import { useMetadata } from "@/hooks/useApi";
import { useToast } from "@/lib/toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { metadata, error, refetch } = useMetadata();
  const { success } = useToast();

  const handleRefresh = async () => {
    await refetch();
    success("Dashboard refreshed");
  };

  if (error) {
    return (
      <div className="flex-1 flex w-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error.message}</p>
          <button
            onClick={handleRefresh}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="flex-1 flex w-full items-center justify-center p-4">
        <p className="text-zinc-400">No workspace data found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-white mb-2">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="text-zinc-400">
          Here's an overview of your {metadata.business_name} workspace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Website</h3>
          <p className="text-sm text-zinc-400 mb-3 truncate">
            {metadata.website_url}
          </p>
          <a
            href={metadata.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Visit website →
          </a>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Knowledge Base
          </h3>
          <p className="text-sm text-zinc-400 mb-3">
            Your AI assistant's knowledge
          </p>
          <span className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">
            Manage knowledge →
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Chatbot</h3>
          <p className="text-sm text-zinc-400 mb-3">
            Configure your AI assistant
          </p>
          <span className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">
            Edit settings →
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Conversations</h3>
          <p className="text-sm text-zinc-400 mb-3">View chat history</p>
          <span className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">
            View all →
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-pink-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Settings</h3>
          <p className="text-sm text-zinc-400 mb-3">Manage your account</p>
          <span className="text-sm text-indigo-400 cursor-pointer hover:text-indigo-300">
            Open settings →
          </span>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Add More</h3>
          <p className="text-sm text-zinc-400 mb-3">
            Extend your chatbot's capabilities
          </p>
          <span className="text-sm text-white cursor-pointer hover:text-zinc-300">
            Explore features →
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
