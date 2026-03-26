"use client";

import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="border-b border-ink/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 mix-blend-multiply pointer-events-none" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 w-full min-h-[600px] divide-y md:divide-y-0 md:divide-x divide-ink/10">
        
        {/* Left Action: I am a missionary */}
        <button className="group relative flex flex-col items-center justify-center p-16 hover:bg-ink hover:text-paper transition-all duration-500">
          <span className="font-mono text-[12px] uppercase text-muted tracking-[3px] mb-6 group-hover:text-paper/60 transition-colors duration-500">
            VOCÊ ESTÁ NO CAMPO?
          </span>
          <h2 className="font-heading font-bold text-[56px] md:text-[72px] uppercase text-ink tracking-wide leading-none group-hover:text-paper transition-colors duration-500">
            SOU MISSIONÁRIO
          </h2>
          <div className="mt-8 w-[40px] h-[2px] bg-ink group-hover:w-[120px] group-hover:bg-paper transition-all duration-700 ease-out" />
        </button>

        {/* Right Action: I want to follow */}
        <button className="group relative flex flex-col items-center justify-center p-16 bg-rust hover:bg-rust-light transition-all duration-500">
          <span className="font-mono text-[12px] uppercase text-paper/60 tracking-[3px] mb-6">
            A PLATAFORMA
          </span>
          <h2 className="font-heading font-bold text-[56px] md:text-[72px] uppercase text-paper tracking-wide leading-none text-center">
            QUERO ACOMPANHAR
          </h2>
          <div className="mt-8 w-[40px] h-[2px] bg-paper group-hover:w-[120px] transition-all duration-700 ease-out" />
        </button>

      </div>
    </section>
  );
}
