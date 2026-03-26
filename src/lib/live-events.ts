export type LiveEventCategory =
  | "CONFLITO"
  | "DESASTRE"
  | "PERSEGUICAO"
  | "CRISE"
  | "ORACAO";

export type LiveEventPriority = "HIGH" | "MEDIUM";

export type LiveEventConfidence = "SINAL" | "VERIFICADO" | "CONFIRMADO";

export interface LiveEvent {
  id: string;
  category: LiveEventCategory;
  headline: string;
  location: string;
  coords: [number, number];
  priority: LiveEventPriority;
  confidence: LiveEventConfidence;
  source: string;
  updatedAt: string;
}

const FALLBACK_EVENTS: LiveEvent[] = [
  {
    id: "evt-iraq-1",
    category: "ORACAO",
    headline: "PEDIDO DE ORACAO URGENTE POR OBREIROS EM AREA DE TENSAO.",
    location: "ORIENTE MEDIO",
    coords: [44.366, 33.315],
    priority: "HIGH",
    confidence: "VERIFICADO",
    source: "REDE DE PARCEIROS",
    updatedAt: "2026-03-25T03:12:00.000Z",
  },
  {
    id: "evt-myanmar-1",
    category: "CRISE",
    headline: "DESLOCAMENTOS E RESTRICAO DE ACESSO AFETAM FRENTES MISSIONARIAS.",
    location: "MYANMAR",
    coords: [96.158, 16.8661],
    priority: "HIGH",
    confidence: "VERIFICADO",
    source: "RELIEFWEB",
    updatedAt: "2026-03-25T02:48:00.000Z",
  },
  {
    id: "evt-china-1",
    category: "PERSEGUICAO",
    headline: "NOVOS RELATOS DE PRESSAO SOBRE COMUNIDADES CRISTAS LOCAIS.",
    location: "TIBET / CHINA",
    coords: [91.1172, 29.6469],
    priority: "MEDIUM",
    confidence: "SINAL",
    source: "MONITORAMENTO REGIONAL",
    updatedAt: "2026-03-25T02:15:00.000Z",
  },
  {
    id: "evt-mozambique-1",
    category: "CONFLITO",
    headline: "INSTABILIDADE NO NORTE EXIGE ATENCAO DE EQUIPES E BASES LOCAIS.",
    location: "PEMBA / MOCAMBIQUE",
    coords: [40.532, -12.969],
    priority: "HIGH",
    confidence: "CONFIRMADO",
    source: "PARCEIRO LOCAL",
    updatedAt: "2026-03-25T01:36:00.000Z",
  },
  {
    id: "evt-japan-1",
    category: "DESASTRE",
    headline: "ABALO SISMICO MONITORADO PROXIMO A REGIOES DE ATUACAO NO JAPAO.",
    location: "OSAKA / JAPAO",
    coords: [135.5023, 34.6937],
    priority: "MEDIUM",
    confidence: "VERIFICADO",
    source: "USGS",
    updatedAt: "2026-03-25T00:58:00.000Z",
  },
];

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    title: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

interface UsgsFeedResponse {
  features: UsgsFeature[];
}

interface ReliefWebReport {
  id: string | number;
  fields?: {
    title?: string;
    date?: {
      created?: string;
      original?: string;
    };
    primary_country?: {
      shortname?: string;
      name?: string;
      iso3?: string;
    };
    country?: Array<{
      shortname?: string;
      name?: string;
    }>;
    source?: Array<{
      shortname?: string;
      name?: string;
    }>;
    disaster_type?: Array<{
      name?: string;
    }>;
    file?: unknown[];
  };
}

interface ReliefWebResponse {
  data: ReliefWebReport[];
}

interface NewsApiArticle {
  source?: {
    id?: string | null;
    name?: string;
  };
  title?: string;
  publishedAt?: string;
  url?: string;
}

interface NewsApiResponse {
  articles?: NewsApiArticle[];
}

interface RssItem {
  guid?: string;
  title?: string;
  pubDate?: string;
  link?: string;
}

interface RssJsonResponse {
  items?: RssItem[];
}

const COUNTRY_COORDS: Record<string, [number, number]> = {
  Afghanistan: [67.71, 33.94],
  Angola: [17.87, -11.2],
  Brazil: [-51.93, -14.24],
  China: [104.19, 35.86],
  Ecuador: [-78.18, -1.83],
  Haiti: [-72.29, 18.97],
  India: [78.96, 20.59],
  Iraq: [43.68, 33.22],
  Israel: [34.85, 31.05],
  Japan: [138.25, 36.2],
  Lebanon: [35.86, 33.85],
  Mozambique: [35.53, -18.67],
  Myanmar: [95.96, 21.91],
  Nepal: [84.12, 28.39],
  Nigeria: [8.68, 9.08],
  Pakistan: [69.35, 30.38],
  Sudan: [30.22, 12.86],
  Syria: [38.99, 34.8],
  Thailand: [100.99, 15.87],
  Turkey: [35.24, 38.96],
  Ukraine: [31.17, 48.38],
  Yemen: [48.52, 15.55],
};

function normalizeHeadline(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortEvents(events: LiveEvent[], limit?: number) {
  const ordered = [...events].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

async function fetchUsgsEvents(): Promise<LiveEvent[]> {
  const response = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`USGS request failed with ${response.status}`);
  }

  const data = (await response.json()) as UsgsFeedResponse;

  return data.features.slice(0, 8).map((feature) => {
    const magnitude = feature.properties.mag ?? 0;
    const place = feature.properties.place ?? "LOCAL NAO IDENTIFICADO";

    return {
      id: `usgs-${feature.id}`,
      category: "DESASTRE",
      headline: normalizeHeadline(
        `ABALO SISMICO M${magnitude.toFixed(1)} REGISTRADO EM ${place}.`
      ),
      location: normalizeHeadline(place),
      coords: [
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ],
      priority: magnitude >= 5 ? "HIGH" : "MEDIUM",
      confidence: "VERIFICADO",
      source: "USGS",
      updatedAt: new Date(feature.properties.time).toISOString(),
    };
  });
}

function getReliefCoords(report: ReliefWebReport): [number, number] | null {
  const primaryCountry =
    report.fields?.primary_country?.name ||
    report.fields?.primary_country?.shortname ||
    report.fields?.country?.[0]?.name ||
    report.fields?.country?.[0]?.shortname;

  if (!primaryCountry) return null;
  return COUNTRY_COORDS[primaryCountry] ?? null;
}

async function fetchReliefWebEvents(): Promise<LiveEvent[]> {
  const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    appname: "confins",
    limit: "6",
    profile: "full",
  });

  params.append("sort[]", "date.created:desc");
  params.append("filter[field]", "date.created");
  params.append("filter[value][from]", fromDate);
  params.append("fields[include][]", "title");
  params.append("fields[include][]", "date.created");
  params.append("fields[include][]", "date.original");
  params.append("fields[include][]", "primary_country");
  params.append("fields[include][]", "country");
  params.append("fields[include][]", "source");
  params.append("fields[include][]", "disaster_type");

  const url = `https://api.reliefweb.int/v1/reports?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`ReliefWeb request failed with ${response.status}`);
  }

  const data = (await response.json()) as ReliefWebResponse;

  return data.data
    .map((report) => {
      const coords = getReliefCoords(report);
      if (!coords || !report.fields?.title) return null;

      const country =
        report.fields.primary_country?.shortname ||
        report.fields.primary_country?.name ||
        report.fields.country?.[0]?.shortname ||
        report.fields.country?.[0]?.name ||
        "REGIAO GLOBAL";

      const source =
        report.fields.source?.[0]?.shortname ||
        report.fields.source?.[0]?.name ||
        "RELIEFWEB";

      const disasterType =
        report.fields.disaster_type?.[0]?.name?.toLowerCase() ?? "";

      return {
        id: `relief-${report.id}`,
        category: disasterType.includes("earthquake") ? "DESASTRE" : "CRISE",
        headline: normalizeHeadline(report.fields.title),
        location: normalizeHeadline(country),
        coords,
        priority:
          disasterType.includes("conflict") || disasterType.includes("flood")
            ? "HIGH"
            : "MEDIUM",
        confidence: "VERIFICADO",
        source: normalizeHeadline(source),
        updatedAt:
          report.fields.date?.created ||
          report.fields.date?.original ||
          new Date().toISOString(),
      } satisfies LiveEvent;
    })
    .filter((event): event is LiveEvent => Boolean(event));
}

function inferCategoryFromText(text: string): LiveEventCategory {
  const normalized = text.toLowerCase();

  if (
    normalized.includes("persecution") ||
    normalized.includes("christian") ||
    normalized.includes("church attack")
  ) {
    return "PERSEGUICAO";
  }

  if (
    normalized.includes("earthquake") ||
    normalized.includes("flood") ||
    normalized.includes("storm") ||
    normalized.includes("wildfire")
  ) {
    return "DESASTRE";
  }

  if (
    normalized.includes("war") ||
    normalized.includes("conflict") ||
    normalized.includes("violence") ||
    normalized.includes("attack")
  ) {
    return "CONFLITO";
  }

  if (
    normalized.includes("missionary") ||
    normalized.includes("evangelism") ||
    normalized.includes("prayer")
  ) {
    return "ORACAO";
  }

  return "CRISE";
}

function inferPriorityFromText(text: string): LiveEventPriority {
  const normalized = text.toLowerCase();
  return normalized.match(/persecution|killed|attack|war|violence|urgent/)
    ? "HIGH"
    : "MEDIUM";
}

function inferLocationFromText(text: string): string {
  for (const country of Object.keys(COUNTRY_COORDS)) {
    if (text.toLowerCase().includes(country.toLowerCase())) {
      return normalizeHeadline(country);
    }
  }

  return "GLOBAL";
}

function inferCoordsFromText(text: string): [number, number] {
  for (const [country, coords] of Object.entries(COUNTRY_COORDS)) {
    if (text.toLowerCase().includes(country.toLowerCase())) {
      return coords;
    }
  }

  return [34.8516, 31.0461];
}

async function fetchNewsApiEvents(): Promise<LiveEvent[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    q: 'missionary OR "christian mission" OR persecution OR evangelism',
    language: "en",
    sortBy: "publishedAt",
    pageSize: "6",
    apiKey,
  });

  const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, {
    next: { revalidate: 28800 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`NewsAPI request failed with ${response.status}`);
  }

  const data = (await response.json()) as NewsApiResponse;

  return (data.articles ?? [])
    .filter((article) => article.title && article.publishedAt)
    .map((article, index) => {
      const title = article.title ?? "MISSION NEWS";

      return {
        id: `newsapi-${slugify(title)}-${index}`,
        category: inferCategoryFromText(title),
        headline: normalizeHeadline(title),
        location: inferLocationFromText(title),
        coords: inferCoordsFromText(title),
        priority: inferPriorityFromText(title),
        confidence: "SINAL",
        source: normalizeHeadline(article.source?.name ?? "NEWSAPI"),
        updatedAt: article.publishedAt ?? new Date().toISOString(),
      } satisfies LiveEvent;
    });
}

async function fetchRssFeedEvents(feedUrl: string, sourceLabel: string): Promise<LiveEvent[]> {
  const params = new URLSearchParams({ rss_url: feedUrl });
  const response = await fetch(
    `https://api.rss2json.com/v1/api.json?${params.toString()}`,
    {
      next: { revalidate: 28800 },
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`RSS2JSON request failed with ${response.status}`);
  }

  const data = (await response.json()) as RssJsonResponse;

  return (data.items ?? []).slice(0, 4).map((item, index) => {
    const title = item.title ?? sourceLabel;

    return {
      id: `rss-${slugify(sourceLabel)}-${slugify(title)}-${index}`,
      category:
        sourceLabel === "OPEN DOORS USA"
          ? "PERSEGUICAO"
          : inferCategoryFromText(title),
      headline: normalizeHeadline(title),
      location: inferLocationFromText(title),
      coords: inferCoordsFromText(title),
      priority:
        sourceLabel === "OPEN DOORS USA"
          ? "HIGH"
          : inferPriorityFromText(title),
      confidence: "SINAL",
      source: sourceLabel,
      updatedAt: item.pubDate ?? new Date().toISOString(),
    } satisfies LiveEvent;
  });
}

export async function getLiveEvents(limit?: number) {
  const results = await Promise.allSettled([
    fetchUsgsEvents(),
    fetchReliefWebEvents(),
    fetchNewsApiEvents(),
    fetchRssFeedEvents("https://www.opendoorsusa.org/feed/", "OPEN DOORS USA"),
    fetchRssFeedEvents("https://www.christianitytoday.com/ct/rss.xml", "CHRISTIANITY TODAY"),
    fetchRssFeedEvents("https://gospel.com/feed/", "GOSPEL"),
  ]);

  const liveEvents = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  if (liveEvents.length === 0) {
    return sortEvents(FALLBACK_EVENTS, limit);
  }

  const uniqueEvents = Array.from(
    new Map(liveEvents.map((event) => [event.id, event])).values()
  );

  return sortEvents(uniqueEvents, limit);
}
