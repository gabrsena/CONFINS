"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Local file in public/
const AUDIO_FILE = "/Music For When You Need A Break From The World - HIGHWIND (youtube).mp3";

export default function AmbientAudioPlayer() {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDelayedReady, setIsDelayedReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 5 second delay before it can start
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayedReady(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Sync mute state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && hasInteracted) {
        audioRef.current.play().catch(() => {
          // Auto-play might be blocked even after interaction
        });
      }
    }
  }, [isMuted, hasInteracted]);

  const toggleMute = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-4">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={AUDIO_FILE}
        loop
        preload="auto"
      />

      {isDelayedReady && (
        <motion.button
          onClick={toggleMute}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`group relative flex items-center justify-center w-12 h-12 backdrop-blur-xl border rounded-full transition-all duration-500 shadow-2xl ${
            isMuted ? 'bg-paper/20 border-rust/30 text-rust' : 'bg-rust border-rust text-paper'
          }`}
        >
          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.div
                key="muted"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
              >
                <VolumeX size={20} strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div
                key="unmuted"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
              >
                <Volume2 size={20} strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>

          {!isMuted && (
            <div className="absolute -inset-2 rounded-full border border-rust/20 animate-ping opacity-30" />
          )}
        </motion.button>
      )}
    </div>
  );
}
