"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Use a larger threshold and check for window object
      if (typeof window !== 'undefined') {
        const scrolled = window.scrollY > 60;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 px-8 py-6 transition-all duration-500 ${
      isScrolled ? "bg-paper/80 backdrop-blur-md border-b border-ink/5" : "bg-transparent"
    }`}>
      <div className="max-w-[1400px] mx-auto flex justify-between items-center pointer-events-auto">
        
        {/* Left: Dynamic Menu Icon or empty placeholder */}
        <div className="flex items-center min-w-[40px]">
          <AnimatePresence mode="wait">
            {!isScrolled && (
              <motion.button 
                key="menu-icon-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-rust hover:text-rust-light transition-colors"
                aria-label="Menu"
              >
                <Menu size={28} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right: Dynamic Full Menu */}
        <nav className="flex items-center min-w-[40px] justify-end">
          <AnimatePresence mode="wait">
            {isScrolled && (
              <motion.div 
                key="full-menu"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-[2px] text-muted font-medium"
              >
                <Link href="#sobre" className="hover:text-rust transition-colors">SOBRE</Link>
                <Link href="#missao" className="hover:text-rust transition-colors">MISSÃO</Link>
                <Link href="#login" className="bg-ink text-paper px-6 py-2 hover:bg-rust transition-all duration-300">LOGIN</Link>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Menu Icon (Scrolled) */}
          {isScrolled && (
             <button className="md:hidden p-2">
               <Menu size={24} />
             </button>
          )}
        </nav>

      </div>
    </header>
  );
}
