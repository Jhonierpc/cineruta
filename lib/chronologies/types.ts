export type MediaKind = "movie" | "tv" | "anime";

export interface ChronologyEntry {
  tmdbId: number;
  kind: MediaKind;
  title: string;
  releaseYear: number;
  narrativeOrder: number;
  releaseOrder: number;
  notes?: string;
}

export interface Saga {
  slug: string;
  name: string;
  description: string;
  entries: ChronologyEntry[];
  curatedAt: string;
  curatedBy?: string;
}

export interface EnrichedEntry extends ChronologyEntry {
  posterUrl: string | null;
}
