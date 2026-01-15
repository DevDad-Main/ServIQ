import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "ServIQ- Human-friendly AI",
  description:
    "Instantly resolve customer questions with an assistant that reads your docs and speaks with empathy",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const metadataCookie = cookieStore.get("metadata");

  return (
    <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800">
      {metadataCookie?.value ? <>{children}</> : children}
    </div>
  );
}
