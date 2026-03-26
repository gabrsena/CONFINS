"use client";

import { motion } from "framer-motion";

export type LayerKey =
  | "missionaries"
  | "bases"
  | "persecuted"
  | "conflicts"
  | "disasters";

interface CategoryDockProps {
  active: Record<LayerKey, boolean>;
  visible: boolean;
  onToggle: (key: LayerKey) => void;
}

const ITEMS: Array<{ key: LayerKey; label: string; marker: string }> = [
  { key: "missionaries", label: "MISSIONARIOS", marker: "●" },
  { key: "bases", label: "BASES", marker: "■" },
  { key: "persecuted", label: "PERSEGUIDOS", marker: "" },
  { key: "conflicts", label: "CONFLITOS", marker: "" },
  { key: "disasters", label: "DESASTRES", marker: "" },
];

export default function CategoryDock({
  active,
  visible,
  onToggle,
}: CategoryDockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 18,
        scale: visible ? 1 : 0.98,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-10 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-md border border-white/10 bg-[rgba(1,1,1,0.9)] px-2 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
        {ITEMS.map((item) => {
          const isActive = active[item.key];

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onToggle(item.key)}
              className={`rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                isActive
                  ? "bg-[#E4B504] text-[#010101]"
                  : "bg-transparent text-[#6B6558] hover:text-[#c2b8a4]"
              }`}
            >
              {item.marker ? `${item.marker} ${item.label}` : item.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
