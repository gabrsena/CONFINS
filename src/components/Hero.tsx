"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion, MotionValue, useTransform, useMotionValueEvent, useMotionValue } from "framer-motion";
import type { LiveEvent } from "@/lib/live-events";

const MapboxMap = dynamic(() => import("@/components/MapboxMap"), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-paper flex items-center justify-center" />
});

interface HeroProps {
  scrollProgress: MotionValue<number>;
  events: LiveEvent[];
}

export default function Hero({ scrollProgress, events }: HeroProps) {
  const [isHeroForced, setIsHeroForced] = useState(false);
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  // Motion Values
  const titleOpacity = useMotionValue(1);
  const searchBarOpacity = useMotionValue(0);

  // Simplified Visibility Logic
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    // If we are at the very top, always show Hero, hide Search
    if (latest <= 0.005) {
      if (!isHeroForced) {
        titleOpacity.set(1);
        searchBarOpacity.set(0);
      }
      return;
    }

    // If not forced by inactivity, scroll manages everything
    if (!isHeroForced) {
      // Hero fades out immediately
      if (latest > 0.01) titleOpacity.set(0);
      else titleOpacity.set(1 - (latest * 100));

      searchBarOpacity.set(1);
    }
  });

  const resetInactivityTimer = () => {
    setIsHeroForced(false);
    
    // Resume scroll-based opacity immediately
    const latest = scrollProgress.get();
    if (latest <= 0.01) {
      titleOpacity.set(1);
      searchBarOpacity.set(0);
    } else {
      titleOpacity.set(0);
      searchBarOpacity.set(1);
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsHeroForced(true);
      import("framer-motion").then(({ animate }) => {
        animate(titleOpacity, 1, { duration: 1.2, ease: "easeInOut" });
        animate(searchBarOpacity, 0, { duration: 0.8, ease: "easeInOut" });
      });
    }, 15000);
  };

  useEffect(() => {
    resetInactivityTimer();
    const handlers = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const onActivity = () => resetInactivityTimer();

    handlers.forEach(e => window.addEventListener(e, onActivity));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      handlers.forEach(e => window.removeEventListener(e, onActivity));
    };
  }, []);

  // Map ZoomBar visibility
  const [zoomBarVisible, setZoomBarVisible] = useState(false);
  useEffect(() => {
    const unsub = scrollProgress.on("change", (latest) => {
      setZoomBarVisible(latest > 0.01);
    });
    setZoomBarVisible(scrollProgress.get() > 0.01);
    return unsub;
  }, [scrollProgress]);

  const titleScale = useTransform(scrollProgress, [0.0, 0.01], [1, 0.95]);
  const titleBlur = useTransform(scrollProgress, [0.0, 0.05], ["blur(0px)", "blur(20px)"]);
  const mapZoom = useTransform(scrollProgress, [0.0, 0.6], [2.5, 12]);

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-end overflow-hidden border-r border-ink/5">
      
      {/* Background Interactive Map */}
      <MapboxMap 
        events={events}
        zoom={mapZoom}
        onInteractionStart={() => {
          resetInactivityTimer();
        }}
        onInteractionEnd={() => {
          resetInactivityTimer();
        }}
        showZoomBar={zoomBarVisible}
      />

      {/* Fade overlay */}
      <motion.div 
        style={{ opacity: titleOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent pointer-events-none z-10" 
      />

      {/* Hero Text Content */}
      <motion.div 
        style={{ 
          opacity: titleOpacity, 
          scale: titleScale,
          filter: titleBlur
        }}
        className="max-w-[1400px] w-full mx-auto px-8 lg:px-16 flex flex-col justify-end relative z-20 pb-[42vh] pointer-events-none"
      >
        <div className="mb-8 max-w-[1000px] relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 1.6, ease: "easeOut" }}
            className="absolute inset-x-0 top-[22%] h-32 bg-[radial-gradient(circle,rgba(255,208,92,0.16)_0%,rgba(255,208,92,0.06)_42%,rgba(255,208,92,0)_75%)] blur-3xl"
          />

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="leading-[0.8] drop-shadow-2xl inline-block relative"
          >
            <span 
              className="block text-[80px] md:text-[110px] text-rust lowercase mb-[-18px] ml-[-10px] relative z-10 [text-shadow:0_0_14px_rgba(232,184,0,0.28)] -translate-y-[50%] translate-x-[25%]"
              style={{ fontFamily: 'var(--font-next-script), cursive' }}
            >
              Até os
            </span>
            <span 
              className="block font-heading text-[100px] md:text-[140px] lg:text-[180px] uppercase text-transparent -translate-x-[25%]"
              style={{ fontKerning: 'none', fontVariantLigatures: 'none', letterSpacing: '-0.03em', textRendering: 'geometricPrecision' }}
            >
              CONFINS
            </span>
          </motion.h1>

          {/* Atos 1:8 - Sequenced fade in */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
            className="absolute top-[45%] -translate-y-1/2 right-[-32px] lg:right-[-68px] hidden md:block"
          >
            <span className="font-mono text-[17px] tracking-[0.35em] text-rust/80 uppercase whitespace-nowrap py-2 [text-shadow:0_0_12px_rgba(232,184,0,0.22)]">
              ATOS 1:8
            </span>
          </motion.div>
        </div>

      </motion.div>

      {/* Search Bar Overlay */}
      <motion.div 
        style={{ opacity: searchBarOpacity }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      >
        <div className="h-0 w-0" />
      </motion.div>
    </section>
  );
}
