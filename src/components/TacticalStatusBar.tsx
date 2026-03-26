"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface StatusBarProps {
  scrollProgress: MotionValue<number>;
}

export default function TacticalStatusBar({ scrollProgress }: StatusBarProps) {
  const opacity = useTransform(scrollProgress, [0.4, 0.7], [0, 1]);

  return (
    <motion.div 
      style={{ opacity }}
      className="fixed bottom-0 left-0 w-full bg-[#010101]/80 backdrop-blur-md border-t border-rust/10 py-1.5 px-8 z-50 flex justify-between items-center pointer-events-none"
    >
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[9px] text-rust uppercase tracking-[2px]">
            MISSIONARY NETWORK: ONLINE
          </span>
        </div>
        
        <span className="font-mono text-[9px] text-muted uppercase tracking-[2px]">
          DEFCON LEVEL: <span className="text-rust">1 (OPTIMAL)</span>
        </span>

        <span className="font-mono text-[9px] text-muted uppercase tracking-[2px]">
          ACTIVE HARVEST: <span className="text-rust">GLOBAL</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-mono text-[9px] text-muted uppercase tracking-[2px]">
          COORDINATES: <span className="text-rust tracking-normal">LOGGING...</span>
        </span>
        <span className="font-mono text-[9px] text-rust font-bold uppercase tracking-[2px]">
          MARANATHA SIGNAL: BROADCASTING
        </span>
      </div>
    </motion.div>
  );
}
