import { BookOpen, ShieldCheck, Eye } from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">
          Designed For Trust.
        </h2>
        <p className="text-xl text-zinc-500 font-light max-w-xl mx-auto leading-relaxed">
          Most AI tools are built on the assumption that they are trustworthy.
          However, this is not always the case. AI tools can be biased,
          inaccurate, and even harmful. That's why we built our chat bot with a
          focus on trustworthiness and most importantly built on the context you
          provide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group p-8 rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-transparent hover:bored-white/10 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#0a0a0e] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-lg font-medium text-white mb-3">
            Knowledge Graph
          </h3>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            We crawl your provided sites and documentation to build a structured
            understanding of your product. No manual training required.
          </p>
        </div>

        <div className="group p-8 rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-transparent hover:bored-white/10 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#0a0a0e] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-lg font-medium text-white mb-3">
            Strict Guardrails
          </h3>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            Define exactly what your AI can and cannot say. It will politely
            decline out-of-scope questions.
          </p>
        </div>

        <div className="group p-8 rounded-3xl border border-white/5 bg-linear-to-b from-white/3 to-transparent hover:bored-white/10 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#0a0a0e] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
            <Eye className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-lg font-medium text-white mb-3">
            Transparency
          </h3>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            See exactly how your AI responds with full conversation logs and
            decision tracking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
