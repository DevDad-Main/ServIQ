import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import Features from "./components/Features";
import Integration from "./components/Integration";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/Placeholder";
import AuthCallback from "./pages/AuthCallback";
import SetupPage from "./pages/SetupPage";
import { AppProvider } from "./lib/AppContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import KnowledgePage from "./pages/KnowledgePage";
import { ToastProvider } from "./lib/toast";

const LandingPage = () => (
  <div className="w-full flex flex-col relative z-10">
    <Hero />
    <SocialProof />
    <Features />
    <Integration />
    <Pricing />
    <Footer />
  </div>
);

import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/setup" element={<ProtectedRoute><SetupPage /></ProtectedRoute>} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="knowledge" element={<KnowledgePage />} />
                      <Route
                        path="sections"
                        element={<PlaceholderPage title="Sections" />}
                      />
                      <Route
                        path="chatbot"
                        element={<PlaceholderPage title="Chatbot" />}
                      />
                      <Route
                        path="conversations"
                        element={<PlaceholderPage title="Conversations" />}
                      />
                      <Route
                        path="settings"
                        element={<PlaceholderPage title="Settings" />}
                      />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
