import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import SocialProof from "./components/SocialProof"
import Features from "./components/Features"
import Integration from "./components/Integration"
import Pricing from "./components/Pricing"
import Footer from "./components/Footer"
import DashboardLayout from "./pages/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import PlaceholderPage from "./pages/Placeholder"
import AuthCallback from "./pages/AuthCallback"
import { AuthProvider } from "./lib/auth-context"

const LandingPage = () => (
  <div className="w-full flex flex-col relative z-10">
    <Hero />
    <SocialProof />
    <Features />
    <Integration />
    <Pricing />
    <Footer />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route
            path="/dashboard/*"
            element={
              <DashboardLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="knowledge" element={<PlaceholderPage title="Knowledge" />} />
                  <Route path="sections" element={<PlaceholderPage title="Sections" />} />
                  <Route path="chatbot" element={<PlaceholderPage title="Chatbot" />} />
                  <Route path="conversations" element={<PlaceholderPage title="Conversations" />} />
                  <Route path="settings" element={<PlaceholderPage title="Settings" />} />
                </Routes>
              </DashboardLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
