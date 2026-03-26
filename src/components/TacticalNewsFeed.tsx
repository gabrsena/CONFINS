"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import type { LiveEvent } from "@/lib/live-events";

interface SidebarProps {
  scrollProgress: MotionValue<number>;
  events: LiveEvent[];
}

function formatTimestamp(value: string) {
  return (
    new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(value)) + " UTC"
  );
}

export default function TacticalNewsFeed({ scrollProgress, events }: SidebarProps) {
  const opacity = useTransform(scrollProgress, [0.4, 0.7], [0, 1]);
  const x = useTransform(scrollProgress, [0.4, 0.7], [-50, 0]);
  const feedItems = events.slice(0, 4);

  return (
    <motion.div 
      style={{ opacity, x }}
      className="fixed left-8 top-1/2 -translate-y-1/2 w-80 z-40 pointer-events-none"
    >
      <div className="flex flex-col gap-4">
        {feedItems.map((item) => (
          <div 
            key={item.id}
            className="bg-[#010101]/60 backdrop-blur-md border border-rust/20 p-4 relative overflow-hidden group"
          >
            {/* Tactical Border Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-rust/50 group-hover:bg-rust transition-colors" />
            
            <div className="flex justify-between items-start mb-2">
              <span className={`font-mono text-[9px] px-1 py-0.5 border ${item.priority === 'HIGH' ? 'border-red-500/50 text-red-400' : 'border-rust/30 text-rust/70'}`}>
                [{item.priority} PRIORITY]
              </span>
              <span className="font-mono text-[9px] text-ink/40">
                {formatTimestamp(item.updatedAt)}
              </span>
            </div>

            <p className="font-mono text-[10px] text-rust font-bold mb-1 tracking-wider">
              {"// "}{item.category}
            </p>
            
            <p className="font-heading text-[13px] text-ink/90 leading-tight mb-2 uppercase">
              {item.headline}
            </p>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rust animate-pulse" />
              <span className="font-mono text-[8px] text-muted tracking-widest uppercase">
                {item.confidence} · {item.source} · {item.location}
              </span>
            </div>
          </div>
        ))}

        {feedItems.length === 0 && (
          <div className="bg-[#010101]/60 backdrop-blur-md border border-rust/20 p-4 relative overflow-hidden">
            <p className="font-mono text-[10px] text-rust font-bold mb-2 tracking-wider">
              {"// AGUARDANDO SINAIS"}
            </p>
            <p className="font-heading text-[13px] text-ink/90 leading-tight uppercase">
              O monitoramento continuo esta ativo, mas nenhum evento foi carregado ainda.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
