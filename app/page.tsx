import Hero from "@/components/ui/landing/hero";
import Navbar from "@/components/ui/landing/nav";
import SocialProof from "@/components/ui/landing/social";
import Features from "@/components/ui/landing/features";
import React from "react";
import Integration from "@/components/ui/landing/integration";

const Page = () => {
  return (
    <main className="w-full flex flex-col relative z-10">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Integration />
    </main>
  );
};

export default Page;
