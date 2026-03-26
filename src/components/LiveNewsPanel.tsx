"use client";

import { motion } from "framer-motion";
import type { LiveEvent } from "@/lib/live-events";

interface LiveNewsPanelProps {
  events: LiveEvent[];
  visible: boolean;
}

const SECTION_ORDER = ["ORACAO", "PERSEGUICAO", "CONFLITO", "DESASTRE", "CRISE"] as const;

const SECTION_LABELS: Record<string, string> = {
  ORACAO: "MISSAO",
  PERSEGUICAO: "PERSEGUICAO",
  CONFLITO: "CONFLITOS",
  DESASTRE: "DESASTRES",
  CRISE: "CRISE",
};

function formatRelativeTime(updatedAt: string) {
  const deltaMs = Date.now() - new Date(updatedAt).getTime();
  const deltaMinutes = Math.max(1, Math.floor(deltaMs / 60000));

  if (deltaMinutes < 60) return `${deltaMinutes} min`;
  const hours = Math.floor(deltaMinutes / 60);
  if (hours < 24) return `${hours} h`;
  return `${Math.floor(hours / 24)} d`;
}

export default function LiveNewsPanel({ events, visible }: LiveNewsPanelProps) {
  const grouped = SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    items: events.filter((event) => event.category === key).slice(0, 3),
  })).filter((section) => section.items.length > 0);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 28 }}
      animate={{
        opacity: visible ? 1 : 0,
        x: visible ? 0 : 28,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="absolute right-0 top-0 z-40 h-full w-[300px] border-l-2 border-[#E4B504] bg-[rgba(1,1,1,0.88)] px-5 pb-6 pt-8 shadow-[-24px_0_60px_rgba(0,0,0,0.24)] backdrop-blur-md"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E4B504] animate-pulse" />
        <h2 className="font-heading text-[28px] uppercase leading-none text-[#f5e8d3]">
          Campo Ao Vivo
        </h2>
      </div>

      <div className="mask-[linear-gradient(to_bottom,black_0%,black_92%,transparent_100%)] h-[calc(100%-52px)] overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {grouped.map((section) => (
          <section key={section.key} className="mb-7 last:mb-0">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#E4B504]">
              {section.label}
            </p>

            <div className="space-y-4">
              {section.items.map((event) => (
                <article
                  key={event.id}
                  className="border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#E4B504]">
                    {event.source}
                  </p>
                  <p className="mb-2 font-serif text-[13px] leading-[1.45] text-[#f5e8d3]">
                    {event.headline}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6B6558]">
                    {formatRelativeTime(event.updatedAt)} · {event.location}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.aside>
  );
}
