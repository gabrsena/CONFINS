"use client";

import { motion } from 'framer-motion';

export default function RotatingGlobe() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
      {/* Container moved down to show only the "Horizon" (top half) */}
      <div className="relative w-[1200px] h-[1200px] translate-y-[62%] opacity-90 blur-[1px]">
        
        {/* Dark body of the planet */}
        <div 
          className="absolute inset-0 rounded-full bg-black shadow-[inset_0_20px_100px_rgba(59,130,246,0.2),0_0_150px_rgba(0,0,0,1)]"
          style={{
            background: 'radial-gradient(circle at 50% 20%, #0D0E0C 0%, #000000 70%)'
          }}
        />
        
        {/* Rotating City Lights Texture - Enhanced Luminescence */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-100 mix-blend-screen"
          animate={{ backgroundPositionX: ['0%', '100%'] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `url('/Users/batistafilmes/.gemini/antigravity/brain/bafc356f-cef4-49af-9893-585c006e03e0/earth_at_night_lights_texture_1774403180850.png')`,
            backgroundSize: '200% 100%',
            maskImage: 'radial-gradient(circle, black 60%, transparent 85%)',
            filter: 'brightness(2.5) contrast(1.5)'
          }}
        />

        {/* Bloom / Glow for city lights */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-50 mix-blend-screen blur-[15px]"
          animate={{ backgroundPositionX: ['0%', '100%'] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `url('/Users/batistafilmes/.gemini/antigravity/brain/bafc356f-cef4-49af-9893-585c006e03e0/earth_at_night_lights_texture_1774403180850.png')`,
            backgroundSize: '200% 100%',
            maskImage: 'radial-gradient(circle, black 60%, transparent 85%)',
            filter: 'brightness(3)'
          }}
        />

        {/* Atmosphere / Horizon Line Glow */}
        <div className="absolute inset-0 rounded-full border-t-[5px] border-blue-400/40 blur-[25px]" />
        <div className="absolute inset-0 rounded-full border-t-[2px] border-white/30 blur-[10px]" />
      </div>
    </div>
  );
}
