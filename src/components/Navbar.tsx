"use client";

import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full z-[100] px-8 py-10 flex justify-start pointer-events-none"
    >
      <div className="flex flex-col items-start pointer-events-auto">
        <h1 className="text-4xl font-heading tracking-[0.2em] uppercase text-confins-offwhite">
          Confins
        </h1>
        <div className="w-12 h-[1px] bg-confins-terracota mt-2" />
      </div>
    </motion.nav>
  );
}
