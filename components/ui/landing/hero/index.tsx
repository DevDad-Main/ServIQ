import { ArrowRight } from "lucide-react";
import React from "react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-md- mb-8 animate-float">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
          <span className="text-xs text-zinc-300 tracking-wide font-light">
            v1 available now
          </span>
        </div>

        <h1 className="text-5xl md:tex-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
          People-First Customer Support
          <br />
          <span className="text-zinc-500">powered by AI.</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Instantly resolve customer questions with an assistant powered by your
          real world information and converses with empathy. No robotic
          response, just answers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button className="h-11 px-8 cursor-pointer rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all flex items-center gap-2">
            Start For Free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="h-11 px-8 cursor-pointer rounded-full border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transition-all bg-black/20 backdrop-blur-sm">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
