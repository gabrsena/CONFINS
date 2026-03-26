"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const ShootingStar = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      initial={{ x: "-20%", y: "-20%", opacity: 0, scale: 0 }}
      animate={{ 
        x: "120%", 
        y: "120%", 
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5]
      }}
      transition={{ 
        duration: 1.2, 
        repeat: Infinity, 
        repeatDelay: delay,
        ease: "linear"
      }}
      className="absolute h-[1px] w-[120px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[35deg] blur-[0.5px] z-0"
      style={{
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 40}%`,
      }}
    />
  );
};


export default function ParallaxSky({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ["#EFECE6", "#1A1C18", "#080807", "#000000"]
  );

  const starOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const starY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const planetY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const nebulaOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 0.2]);

  return (
    <div ref={containerRef} className="relative z-10">
      <motion.div 
        style={{ backgroundColor }}
        className="absolute inset-0 z-[-1] pointer-events-none"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          
          {/* Nebula Clouds */}
          <motion.div 
            style={{ opacity: nebulaOpacity }}
            className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[180px]"
          />
          <motion.div 
            style={{ opacity: nebulaOpacity }}
            className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-rust/10 rounded-full blur-[200px]"
          />

          {/* Cosmic Elements Container */}
          <motion.div 
            style={{ opacity: starOpacity, y: starY }}
            className="absolute inset-0"
          >
            {/* Massive Dense Starfield */}
            <div 
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: `
                  radial-gradient(1px 1px at 25px 35px, #fff, transparent),
                  radial-gradient(1px 1px at 50px 85px, #fff, transparent),
                  radial-gradient(1.5px 1.5px at 80px 140px, #fff, transparent),
                  radial-gradient(1px 1px at 130px 20px, #fff, transparent),
                  radial-gradient(1px 1px at 170px 180px, #fff, transparent),
                  radial-gradient(2px 2px at 190px 60px, #fff, transparent)
                `,
                backgroundSize: '250px 250px'
              }}
            />
            
            <div 
              className="absolute inset-0 opacity-40 scale-150 rotate-12"
              style={{
                backgroundImage: `
                  radial-gradient(1px 1px at 10px 10px, #fff, rgba(0,0,0,0)),
                  radial-gradient(1.5px 1.5px at 150px 150px, #fff, rgba(0,0,0,0)),
                  radial-gradient(1px 1px at 250px 50px, #fff, rgba(0,0,0,0))
                `,
                backgroundSize: '400px 400px'
              }}
            />

            {/* Shooting Stars */}
            {hasMounted && (
              <>
                <ShootingStar delay={8} />
                <ShootingStar delay={15} />
                <ShootingStar delay={22} />
              </>
            )}


            {/* Distant Planets */}
            <motion.div 
              className="absolute top-[20%] right-[15%] w-[120px] h-[120px] rounded-full blur-[1px] opacity-60 overflow-hidden shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8)]"
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, #4D5245 0%, #1A1C18 100%)',
                y: useTransform(scrollYProgress, [0, 1], [0, -80])
              }}
            />
            
            <motion.div 
              className="absolute bottom-[30%] left-[10%] w-[60px] h-[60px] rounded-full blur-[0.5px] opacity-40"
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, #A0471E 0%, #3D1A0B 100%)',
                y: useTransform(scrollYProgress, [0, 1], [0, -120])
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      <div className="relative">
        {children}
      </div>
    </div>
  );
}
