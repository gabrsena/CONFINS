"use client";

import { memo, useState, useEffect, useRef } from 'react';
import Map, { Marker, useMap, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion, AnimatePresence, MotionValue, useMotionValueEvent, useMotionValue } from 'framer-motion';
import type { LiveEvent } from '@/lib/live-events';
import { ThreeLayer } from './ThreeLayer';

interface MapProps {
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  showZoomBar?: boolean;
  zoom?: MotionValue<number>;
  events: LiveEvent[];
}

export interface Missionary {
  id: string;
  name: string;
  type: 'MISSIONARY' | 'BASE';
  country: string;
  city: string;
  gps: string;
  organization: string;
  sender: string;
  testimony: string;
  date: string;
  daysField: number;
  coords: [number, number]; // [lng, lat] for Mapbox
  image?: string;
}

interface GlobeView {
  longitude: number;
  latitude: number;
}

const SATELLITE_MAP_STYLE = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ] as string[],
      tileSize: 256,
      attribution: 'Esri, Maxar'
    }
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite',
      minzoom: 0,
      maxzoom: 20
    }
  ]
} as const;

const LOCATIONS: Missionary[] = [
  // Missionaries
  {
    id: '1',
    name: 'SARAH MARTINS',
    type: 'MISSIONARY',
    country: 'ANGOLA',
    city: 'LUANDA',
    gps: '08°50\'20"S 13°17\'20"E',
    organization: 'GEOCUM',
    sender: 'IGREJA LOCAL',
    testimony: 'Hoje foi um dia marcante. Conseguimos <span class="font-normal not-italic text-cream">finalizar a estrutura da escola local</span>. As crianças já começaram a usar o espaço. Deus tem sido fiel em cada detalhe, mesmo quando os recursos pareciam escassos. O tempo está mudando e a estação das chuvas se aproxima, mas o trabalho continua. Orem pela nossa saúde neste período de transição.',
    date: '12 MAR 2026',
    daysField: 124,
    coords: [13.289, -8.839]
  },
  {
    id: '2',
    name: 'JOÃO PEDRO',
    type: 'MISSIONARY',
    country: 'JAPÃO',
    city: 'OSAKA',
    gps: '34°41\'37"N 135°30\'08"E',
    organization: 'DUNAMIS',
    sender: 'BASE SÃO PAULO',
    testimony: 'Tivemos uma reunião profunda com estudantes universitários. A maioria deles <span class="font-normal not-italic text-cream">nunca tinha ouvido falar de Jesus</span>. O coração do Japão pode parecer duro por fora, mas há um vazio que só o Evangelho preenche. Estamos vendo pequenas sementes brotando. Uma jovem entregou sua vida a Cristo ontem. A missão é real.',
    date: '10 MAR 2026',
    daysField: 45,
    coords: [135.5023, 34.6937]
  },
  {
    id: '3',
    name: 'MATEUS & CLARA',
    type: 'MISSIONARY',
    country: 'TAILÂNDIA',
    city: 'CHIANG MAI',
    gps: '18°47\'17"N 98°59\'07"E',
    organization: 'YWAM',
    sender: 'IGREJA X',
    testimony: 'Semana intensa na casa de acolhimento. Recebemos mais três <span class="font-normal not-italic text-cream">crianças resgatadas das ruas</span> de Chiang Mai. O trauma delas é grande, mas o amor fala mais alto. Estamos ensinando inglês e compartilhando histórias bíblicas todas as noites. A luz está brilhando onde antes havia apenas escuridão e medo. Deus está aqui.',
    date: '08 MAR 2026',
    daysField: 312,
    coords: [98.9853, 18.7883]
  },
  // Mission Bases
  {
    id: 'base-1',
    name: 'DUNAMIS FARM',
    type: 'BASE',
    country: 'BRASIL',
    city: 'PARIQUERA-AÇU',
    gps: '24°42\'54"S 47°52\'52"W',
    organization: 'DUNAMIS MOVEMENT',
    sender: 'CENTRO DE TREINAMENTO',
    testimony: 'A Dunamis Farm é um hub de treinamento e envio. Aqui, <span class="font-normal not-italic text-cream">líderes são forjados</span> para impactar as esferas da sociedade. Um lugar de avivamento e cultura bíblica no interior de São Paulo.',
    date: 'OPERACIONAL',
    daysField: 3650,
    coords: [-47.881, -24.715]
  },
  {
    id: 'base-2',
    name: 'UofN KONA (YWAM)',
    type: 'BASE',
    country: 'USA',
    city: 'KAILUA-KONA',
    gps: '19°38\'20"N 155°59\'49"W',
    organization: 'YWAM / JOCUM',
    sender: 'UNIVERSITY OF THE NATIONS',
    testimony: 'A maior base da JOCUM no mundo. Um centro global de <span class="font-normal not-italic text-cream">mobilização missionária</span>, enviando milhares para os confins da terra todos os anos.',
    date: 'OPERACIONAL',
    daysField: 18200,
    coords: [-155.997, 19.639]
  },
  {
    id: 'base-3',
    name: 'IRIS PEMBA',
    type: 'BASE',
    country: 'MOÇAMBIQUE',
    city: 'PEMBA',
    gps: '12°58\'08"S 40°31\'57"E',
    organization: 'IRIS GLOBAL',
    sender: 'VILLAGE OF JOY',
    testimony: 'Onde o amor se torna visível. Um centro de <span class="font-normal not-italic text-cream">acolhimento, educação e evangelismo</span> servindo a nação de Moçambique sob a liderança de Heidi e Rolland Baker.',
    date: 'OPERACIONAL',
    daysField: 9125,
    coords: [40.532, -12.969]
  },
  {
    id: 'missionary-4',
    name: 'VITOR AMARO',
    type: 'MISSIONARY',
    country: 'EQUADOR',
    city: 'QUITO',
    gps: '00°10\'12"S 78°29\'02"W',
    organization: 'DUNAMIS',
    sender: 'ZION QUITO',
    testimony: 'Servindo na <span class="font-normal not-italic text-cream">igreja local Zion em Quito</span>. O Equador é uma terra de contrastes, onde a altitude desafia o corpo, mas a fome de Deus move a alma. Estamos vendo uma nova geração de equatorianos se levantando com um coração ardente pelas nações.',
    date: '15 MAR 2026',
    daysField: 29,
    coords: [-78.484, -0.170],
    image: '/vitinho.jpg'
  },
  {
    id: 'missionary-5',
    name: 'MATEUS & MARIELY BRITO',
    type: 'MISSIONARY',
    country: 'USA',
    city: 'DENVER',
    gps: '39°44\'21"N 104°59\'25"W',
    organization: 'IGREJA LOCAL',
    sender: 'ENVIADOS POR IGREJA LOCAL',
    testimony: 'Servindo a <span class="font-normal not-italic text-cream">igreja local em Denver</span>. Nosso foco é o fortalecimento da comunidade e o discipulado intensivo. Denver é um centro de influência no Colorado, e cremos que o Reino de Deus está se expandindo através do serviço humilde e da pregação fiel.',
    date: '24 MAR 2026',
    daysField: 150,
    coords: [-104.9903, 39.7392],
    image: '/mat&mari.jpg'
  },
  {
    id: 'missionary-6',
    name: 'TALITA SENA',
    type: 'MISSIONARY',
    country: 'BRASIL',
    city: 'DUNAMIS FARM',
    gps: '24°42\'54"S 47°52\'52"W',
    organization: 'DUNAMIS',
    sender: 'TREINAMENTO',
    testimony: 'Em <span class="font-normal not-italic text-cream">preparação intensa para o campo missionário</span> na Dunamis Farm. Cada dia aqui é um degrau na forja do caráter e na clareza do chamado. O foco agora é o discipulado e a capacitação prática para os desafios transculturais que virão.',
    date: '25 MAR 2026',
    daysField: 32, // Calculated manually for now, or dynamic below
    coords: [-47.881, -24.715]
  }
];

function ZoomBar({ onSearch }: { onSearch: (m: Missionary) => void }) {
  const { current: map } = useMap();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filtered = LOCATIONS.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.country.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);
  
  return (
    <div className="flex items-center gap-6 bg-paper/90 backdrop-blur-md border border-ink/10 px-8 py-4 rounded-full pointer-events-auto shadow-2xl relative min-w-[420px]">
      <div className="flex items-center gap-3 relative w-full">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-rust font-bold">PESQUISAR</span>
        <input 
          type="text" 
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="bg-transparent border-b border-ink/10 focus:border-rust outline-none font-mono text-[12px] uppercase tracking-[1px] text-ink w-full placeholder:opacity-30"
          placeholder="NOME OU LOCAL"
        />
        
        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && search.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 mb-4 bg-paper border border-ink/10 w-64 shadow-2xl p-2 rounded-lg"
            >
              {filtered.length > 0 ? (
                filtered.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSearch(m);
                      setSearch('');
                      setShowResults(false);
                      map?.flyTo({ center: m.coords, zoom: 6, duration: 2000 });
                    }}
                    className="w-full text-left p-3 hover:bg-ink/5 transition-colors border-b border-ink/5 last:border-0"
                  >
                    <p className="font-heading font-bold uppercase text-[12px] text-ink">{m.name}</p>
                    <p className="font-mono text-[9px] text-rust uppercase tracking-[1px]">{m.city}, {m.country}</p>
                  </button>
                ))
              ) : (
                <p className="p-3 font-mono text-[9px] text-muted text-center italic">Nenhum resultado</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MapboxMap({ onInteractionStart, onInteractionEnd, showZoomBar, zoom: scrollZoom, events }: MapProps) {
  const [selectedMissionary, setSelectedMissionary] = useState<(Missionary & { image?: string }) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeView, setGlobeView] = useState<GlobeView>({
    longitude: 34.8516,
    latitude: 31.0461,
  });
  const mapRef = useRef<MapRef>(null);
  const threeLayerRef = useRef<ThreeLayer | null>(null);
  const defaultZoom = useMotionValue(2.5);
  const interactionResetRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    center: { lng: number; lat: number };
  } | null>(null);

  const [userInteracting, setUserInteracting] = useState(false);
  const requestRef = useRef<number | null>(null);

  // Sync scroll progress with map zoom - ONLY when not manually interacting
  useMotionValueEvent(scrollZoom || defaultZoom, "change", (latest) => {
    if (mapRef.current && !userInteracting && !showZoomBar) {
      mapRef.current.getMap().setZoom(latest);
    }
  });

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setShowGlobe(true);
    }, 1800);

    return () => window.clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (!isLoaded || !showGlobe) return;

    const readyTimer = window.setTimeout(() => {
      setGlobeReady(true);
    }, 60);

    return () => window.clearTimeout(readyTimer);
  }, [isLoaded, showGlobe]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !isLoaded) return;

    if (showZoomBar) {
      map.dragPan.enable();
      map.dragRotate.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
      map.keyboard.enable();
      return;
    }

    map.dragPan.disable();
    map.dragRotate.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.keyboard.disable();
  }, [isLoaded, showZoomBar]);

  useEffect(() => {
    return () => {
      if (interactionResetRef.current) {
        window.clearTimeout(interactionResetRef.current);
      }
    };
  }, []);

  // Auto-rotation logic
  useEffect(() => {
    const rotate = () => {
      if (mapRef.current && !userInteracting && showGlobe) {
        const m = mapRef.current.getMap();
        const z = m.getZoom();
        
        // Orbital drift: Rotate + subtle bearing shift
        if (z < 10) {
          const c = m.getCenter();
          c.lng -= 0.04; // Slow planet rotation
          m.setCenter(c);
          
          // Subtle orbital oscillation
          const time = Date.now() / 5000;
          m.setBearing(Math.sin(time) * 2);
          m.setPitch(45 + Math.cos(time) * 1);
        }
      }
      requestRef.current = requestAnimationFrame(rotate);
    };

    requestRef.current = requestAnimationFrame(rotate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [showGlobe, userInteracting]);

  const isPointOnVisibleHemisphere = (coords: [number, number]) => {
    const toRadians = (value: number) => (value * Math.PI) / 180;

    const lat1 = toRadians(globeView.latitude);
    const lon1 = toRadians(globeView.longitude);
    const lat2 = toRadians(coords[1]);
    const lon2 = toRadians(coords[0]);

    const dot =
      Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    return dot > 0;
  };

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden bg-black"
      onMouseDown={(event) => {
        if (!showZoomBar) return;
        if ((event.target as HTMLElement).closest("[data-search-bar='true']")) return;

        const map = mapRef.current?.getMap();
        if (!map) return;

        const center = map.getCenter();
        dragStateRef.current = {
          startX: event.clientX,
          startY: event.clientY,
          center: { lng: center.lng, lat: center.lat },
        };

        setUserInteracting(true);
        onInteractionStart?.();
      }}
      onMouseMove={(event) => {
        if (!showZoomBar || !dragStateRef.current) return;

        const map = mapRef.current?.getMap();
        if (!map) return;

        const { startX, startY, center } = dragStateRef.current;
        const centerPoint = map.project([center.lng, center.lat]);
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const nextCenter = map.unproject([centerPoint.x - dx, centerPoint.y - dy]);
        map.setCenter(nextCenter);
      }}
      onMouseUp={() => {
        if (!dragStateRef.current) return;
        dragStateRef.current = null;
        setUserInteracting(false);
        onInteractionEnd?.();
      }}
      onMouseLeave={() => {
        if (!dragStateRef.current) return;
        dragStateRef.current = null;
        setUserInteracting(false);
        onInteractionEnd?.();
      }}
      onWheelCapture={(event) => {
        if (!showZoomBar || !showGlobe) return;

        const map = mapRef.current?.getMap();
        if (!map) return;

        event.preventDefault();
        event.stopPropagation();

        setUserInteracting(true);
        onInteractionStart?.();

        const currentZoom = map.getZoom();
        const nextZoom =
          event.deltaY > 0 ? currentZoom + 0.45 : currentZoom - 0.45;
        const clampedZoom = Math.min(15, Math.max(2, nextZoom));

        map.easeTo({
          zoom: clampedZoom,
          duration: 220,
        });

        if (interactionResetRef.current) {
          window.clearTimeout(interactionResetRef.current);
        }

        interactionResetRef.current = window.setTimeout(() => {
          setUserInteracting(false);
          onInteractionEnd?.();
        }, 260);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-center bg-cover opacity-18"
        style={{ backgroundImage: 'url("/galaxia.jpg")' }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(9,15,28,0.08)_0%,rgba(3,6,14,0.48)_52%,rgba(0,0,0,0.82)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
        animate={{
          opacity: showZoomBar ? 0 : 1,
          y: showZoomBar ? -10 : 0,
          filter: showZoomBar ? "blur(10px)" : "blur(0px)",
        }}
        transition={{ delay: showZoomBar ? 0 : 0.52, duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 z-[2] max-w-[1400px] w-full mx-auto px-8 lg:px-16 flex flex-col justify-end pb-[42vh]"
      >
        <div className="mb-8 max-w-[1000px] relative">
          <span 
            className="absolute inset-0 block font-heading text-[100px] md:text-[140px] lg:text-[180px] uppercase text-[#f2cc9d]/10 blur-[8px] translate-x-[2px] translate-y-[-2px]"
            style={{ fontKerning: 'none', fontVariantLigatures: 'none', letterSpacing: '-0.03em', textRendering: 'geometricPrecision' }}
          >
            CONFINS
          </span>
          <span 
            className="block font-heading text-[100px] md:text-[140px] lg:text-[180px] uppercase text-[#f5e8d3] [text-shadow:0_10px_35px_rgba(0,0,0,0.38),0_0_20px_rgba(255,245,210,0.08)]"
            style={{ fontKerning: 'none', fontVariantLigatures: 'none', letterSpacing: '-0.03em', textRendering: 'geometricPrecision' }}
          >
            CONFINS
          </span>
          <span className="absolute left-[1%] top-[56%] h-px w-[88%] bg-gradient-to-r from-transparent via-rust/40 to-transparent opacity-70" />
        </div>
      </motion.div>

      <Map
        ref={mapRef}
        onLoad={(e) => {
          setIsLoaded(true);
          const map = e.target;
          // Set globe-like atmosphere fog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (map as any).setFog === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (map as any).setFog({
              'range': [0.5, 10],
              'color': '#ffffff',
              'horizon-blend': 0.1,
              'high-color': '#000000',
              'space-color': '#000000',
              'star-intensity': 0.15
            });
          }

          // Add Three.js Layer for Bases
          if (!threeLayerRef.current) {
            threeLayerRef.current = new ThreeLayer(
              LOCATIONS,
              (base) => setSelectedMissionary(base),
              (base) => {
                // We can handle hover-specific UI here if needed
              }
            );
            map.addLayer(threeLayerRef.current as any);
          }

          // Tactical Label Dimming - Dim all labels to 0.2 opacity
          const layers = map.getStyle().layers;
          if (layers) {
            layers.forEach(layer => {
              if (layer.id.includes('label') || layer.id.includes('place') || layer.id.includes('country')) {
                try {
                  map.setPaintProperty(layer.id, 'text-opacity', [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    2, 0.2,   // 20% opacity at globe view
                    8, 0.8    // 80% opacity when zoomed in
                  ]);
                } catch (err) {
                  // Some layers might not have text-opacity
                }
              }
            });
          }
        }}
        onMove={(event) => {
          const { longitude, latitude } = event.viewState;
          setGlobeView({ longitude, latitude });
        }}
        initialViewState={{
          longitude: 34.8516,
          latitude: 31.0461,
          zoom: 2.5
        }}
        projection="globe"
        minZoom={2}
        maxZoom={15}
        scrollZoom={false}
        dragPan={false}
        dragRotate={false}
        doubleClickZoom={true}
        touchZoomRotate={true}
        keyboard={true}
        boxZoom={false}
        onDragStart={() => {
          setUserInteracting(true);
          onInteractionStart?.();
        }}
        onDragEnd={() => {
          setUserInteracting(false);
          onInteractionEnd?.();
        }}
        onZoomStart={() => {
          setUserInteracting(true);
          onInteractionStart?.();
        }}
        onZoomEnd={() => {
          setUserInteracting(false);
          onInteractionEnd?.();
        }}
        onRotateStart={() => {
          setUserInteracting(true);
          onInteractionStart?.();
        }}
        onRotateEnd={() => {
          setUserInteracting(false);
          onInteractionEnd?.();
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: globeReady ? 1 : 0,
          transform: globeReady ? 'translateY(0) scale(1)' : 'translateY(34vh) scale(1.08)',
          transformOrigin: '50% 100%',
          transition: 'transform 3.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s linear',
          cursor: showZoomBar ? (userInteracting ? 'grabbing' : 'grab') : 'default',
          position: 'relative',
          zIndex: 5
        }}
        mapStyle={SATELLITE_MAP_STYLE as any}
        attributionControl={false}
        onMouseMove={(e) => {
          if (threeLayerRef.current) {
            threeLayerRef.current.onMouseAction(e as any, 'mousemove');
          }
        }}
        onClick={(e) => {
          if (threeLayerRef.current) {
            threeLayerRef.current.onMouseAction(e as any, 'click');
          }
        }}
      >
        <AnimatePresence>
          {showZoomBar && (
            <motion.div 
              drag
              dragMomentum={false}
              initial={{ opacity: 0, x: "-50%", y: 20 }}
              animate={{ 
                opacity: userInteracting ? 0 : 1, 
                x: "-50%",
                y: userInteracting ? 30 : 0,
                pointerEvents: userInteracting ? 'none' : 'auto'
              }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-24 left-1/2 z-50 cursor-move pointer-events-auto"
              data-search-bar="true"
            >
              <ZoomBar onSearch={setSelectedMissionary} />
            </motion.div>
          )}
        </AnimatePresence>

        {LOCATIONS.filter((m) => m.type !== 'BASE' && isPointOnVisibleHemisphere(m.coords)).map(m => (
          <Marker 
            key={m.id} 
            longitude={m.coords[0]} 
            latitude={m.coords[1]}
            anchor="center"
            onClick={() => {
              setSelectedMissionary(m);
            }}
          >
            <div className="w-[10px] h-[10px] rounded-full bg-[#FACC15] cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.5)] marker-war-pulse" />
          </Marker>
        ))}

        {/* Tactical Alert Signals */}
        {events.filter((s) => isPointOnVisibleHemisphere(s.coords)).map((s) => (
          <Marker
            key={s.id}
            longitude={s.coords[0]}
            latitude={s.coords[1]}
            anchor="center"
          >
            <div className="relative group cursor-help">
              <div className={`w-3 h-3 rotate-45 border-2 ${s.priority === 'HIGH' ? 'border-red-500 bg-red-500/20' : 'border-rust bg-rust/20'} animate-pulse`} />
              <div className={`absolute inset-0 w-3 h-3 rotate-45 border ${s.priority === 'HIGH' ? 'border-red-500' : 'border-rust'} animate-ping opacity-75`} />
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap bg-paper/90 border border-rust/30 p-2 pointer-events-none z-50">
                <p className="font-mono text-[8px] text-rust font-bold tracking-tighter">[{s.category}]</p>
                <p className="font-heading text-[10px] text-ink uppercase">{s.headline}</p>
              </div>
            </div>
          </Marker>
        ))}
      </Map>

      {/* Field Report Panel */}
      <AnimatePresence>
        {selectedMissionary && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
            className="absolute top-0 right-0 w-[600px] h-full bg-paper/95 border-l border-ink/10 shadow-2xl z-50 flex flex-col backdrop-blur-md"
          >
            {/* Main content grid */}
            <div className="flex-1 grid grid-cols-2 gap-8 p-12 overflow-y-auto pointer-events-auto">
              
              {/* Left Column: Data */}
              <div className="flex flex-col gap-6">
                <div>
                  <span className="font-mono text-[11px] text-rust uppercase tracking-[2px] mb-2 block">
                    — MISSIONÁRIO EM CAMPO
                  </span>
                  
                  {selectedMissionary.image && (
                    <div className="w-full aspect-square border border-ink/10 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden mb-6">
                      <img 
                        src={selectedMissionary.image} 
                        alt={selectedMissionary.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="font-heading font-bold uppercase text-[22px] tracking-wide text-ink mb-1">
                    {selectedMissionary.name}
                  </h3>
                  <p className="font-mono text-[11px] text-muted uppercase tracking-[1px] mb-1">
                    {selectedMissionary.country} · {selectedMissionary.city}
                  </p>
                  <p className="font-mono text-[11px] text-muted opacity-40 uppercase tracking-[1px]">
                    {selectedMissionary.gps}
                  </p>
                </div>

                <div className="border border-ink/10 p-3 mt-4">
                  <p className="font-mono text-[10px] uppercase text-ink tracking-[1px] leading-[1.6]">
                    <span className="text-muted">ORG:</span> {selectedMissionary.organization}<br/>
                    <span className="text-muted">ENCARGO:</span> {selectedMissionary.sender}
                  </p>
                </div>
              </div>

              {/* Right Column: Testimony */}
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-rust uppercase tracking-[2px] mb-6 block">
                  — TESTEMUNHO · {selectedMissionary.date}
                </span>
                
                <p 
                  className="font-serif italic text-[14px] text-ink leading-[1.8] font-medium"
                  dangerouslySetInnerHTML={{ __html: selectedMissionary.testimony.replace('text-cream', 'text-rust font-bold') }}
                />
              </div>

            </div>

            {/* Footer */}
            <div className="h-[100px] border-t border-ink/10 flex justify-between items-center px-12 pointer-events-auto bg-paper shrink-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-[28px] text-ink leading-none mt-1">
                    {selectedMissionary.id === 'missionary-6' ? 
                      Math.floor((new Date('2026-03-25').getTime() - new Date('2026-02-21').getTime()) / (1000 * 60 * 60 * 24)) 
                      : selectedMissionary.daysField}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[1px] text-muted">
                    DIAS EM MISSÃO
                  </span>
                </div>
                {selectedMissionary.id === 'missionary-6' && (
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="font-heading font-bold text-[18px] text-rust leading-none">
                      {Math.floor((new Date('2026-12-31').getTime() - new Date('2026-03-25').getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[1px] text-muted">
                      DIAS PARA FINALIZAR
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[2px] text-muted">
                  ATIVO
                </span>
                <span className={`w-2 h-2 rounded-full animate-pulse ${selectedMissionary.type === 'BASE' ? 'bg-[#22C55E]' : 'bg-[#FACC15]'}`} />
              </div>
            </div>
            
            {/* Close Hitbox Overlay */}
            <div 
              className="absolute inset-y-0 -left-[100vw] w-[100vw] cursor-pointer" 
              onClick={() => setSelectedMissionary(null)}
            />

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function areMapPropsEqual(prev: MapProps, next: MapProps) {
  return (
    prev.events === next.events &&
    prev.showZoomBar === next.showZoomBar &&
    prev.zoom === next.zoom
  );
}

export default memo(MapboxMap, areMapPropsEqual);
