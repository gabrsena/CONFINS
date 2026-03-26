"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Starfield() {
  const [shootingStars, setShootingStars] = useState<{ 
    id: number; 
    top: string; 
    left: string; 
    delay: string; 
    duration: string;
    rotation: string;
    width: string;
  }[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const stars = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        top: `${random(-10, 60)}%`, 
        left: `${random(10, 110)}%`,
        delay: `${random(0, 20)}s`,
        duration: `${random(1.2, 3.0)}s`,
        rotation: `${random(-35, -55)}deg`,
        width: `${random(100, 250)}px`,
      }));
      setShootingStars(stars);
    };
    generateStars();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
      {/* Base Parallax Star Layer */}
      <motion.div 
        className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] opacity-40 bg-[url('/stars_bg.png')] bg-cover"
        animate={{
          x: [0, -40, 0, 40, 0],
          y: [0, 20, 40, 20, 0],
        }}
        transition={{
          duration: 120,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      {/* Secondary Parallax Layer */}
      <motion.div 
        className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] opacity-20 bg-[url('/stars_bg.png')] bg-cover"
        style={{ scale: 1.5 }}
        animate={{
          x: [40, 0, -40, 0, 40],
          y: [-20, 0, 20, 0, -20],
        }}
        transition={{
          duration: 90,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-white/10 rounded-full animate-shooting-star"
          style={{
            top: star.top,
            left: star.left,
            width: star.width,
            rotate: star.rotation,
            animationDelay: star.delay,
            animationDuration: star.duration,
            transformOrigin: 'left center',
          }}
        >
          {/* Flare Head */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full blur-[2px] shadow-[0_0_8px_white]" />
        </div>
      ))}
    </div>
  );
}
