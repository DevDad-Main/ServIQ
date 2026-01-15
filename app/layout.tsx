import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServIQ- Human-friendly AI",
  description:
    "Instantly resolve customer questions with an assistant that reads your docs and speaks with empathy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-[#050509] min-h-screen flex flex-col p-0 antialiased text-zinc-100 font-sans`}
      >
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-500/5 blur-[120px] animate-pulse-slow delay-1000" />
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[100px] animate-pulse-slow delay-500" />
        </div>

        {children}
      </body>
    </html>
  );
}
