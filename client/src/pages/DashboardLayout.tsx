import Sidebar from "../components/Sidebar"
import DashboardLoader from "@/components/DashboardLoader"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800">
      <>
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen transition-all duration-300">
          <DashboardLoader>{children}</DashboardLoader>
        </div>
      </>
    </div>
  )
}

export default DashboardLayout
