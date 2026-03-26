"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import CategoryDock, { type LayerKey } from "@/components/CategoryDock";
import Hero from "@/components/Hero";
import LiveNewsPanel from "@/components/LiveNewsPanel";
import type { LiveEvent } from "@/lib/live-events";

function areEventsEqual(prev: LiveEvent[], next: LiveEvent[]) {
  if (prev.length !== next.length) return false;

  return prev.every((event, index) => {
    const candidate = next[index];
    return (
      event.id === candidate.id &&
      event.updatedAt === candidate.updatedAt &&
      event.headline === candidate.headline
    );
  });
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [showOperationsUi, setShowOperationsUi] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>({
    missionaries: true,
    bases: true,
    persecuted: true,
    conflicts: false,
    disasters: false,
  });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowOperationsUi(latest > 0.01);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    let active = true;

    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as { events: LiveEvent[] };
        if (active) {
          setEvents((current) =>
            areEventsEqual(current, data.events) ? current : data.events
          );
        }
      } catch {
        // Preserve the current state while the feed is unavailable.
      }
    };

    loadEvents();
    const interval = window.setInterval(loadEvents, 120000);

    return () => {
      active = false;
      window.clearInterval(interval);

      if (typeof window !== "undefined") {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <main ref={containerRef} className="relative bg-paper h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Hero
          scrollProgress={scrollYProgress}
          events={events}
          activeLayers={activeLayers}
        />
        <CategoryDock
          active={activeLayers}
          visible={showOperationsUi}
          onToggle={toggleLayer}
        />
        <LiveNewsPanel events={events} visible={showOperationsUi} />
      </div>
    </main>
  );
}
