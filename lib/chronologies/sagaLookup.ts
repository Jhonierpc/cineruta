import { getAllSagas } from "./loader";
import type { ChronologyEntry, MediaKind, Saga } from "./types";

export interface SagaAppearance {
  saga: Pick<Saga, "slug" | "name" | "description">;
  entry: ChronologyEntry;
  totalEntries: number;
  prevNarrative: ChronologyEntry | null;
  nextNarrative: ChronologyEntry | null;
}

export function findAppearancesInSagas(
  sagas: Saga[],
  tmdbId: number,
  kind: MediaKind,
): SagaAppearance[] {
  const appearances: SagaAppearance[] = [];

  for (const saga of sagas) {
    const entry = saga.entries.find(
      (e) => e.tmdbId === tmdbId && e.kind === kind,
    );
    if (!entry) continue;

    const byNarrative = [...saga.entries].sort(
      (a, b) => a.narrativeOrder - b.narrativeOrder,
    );
    const idx = byNarrative.findIndex(
      (e) => e.tmdbId === tmdbId && e.kind === kind,
    );

    appearances.push({
      saga: {
        slug: saga.slug,
        name: saga.name,
        description: saga.description,
      },
      entry,
      totalEntries: saga.entries.length,
      prevNarrative: idx > 0 ? byNarrative[idx - 1] : null,
      nextNarrative:
        idx >= 0 && idx < byNarrative.length - 1 ? byNarrative[idx + 1] : null,
    });
  }

  return appearances.sort((a, b) =>
    a.saga.name.localeCompare(b.saga.name, "es"),
  );
}

export async function findSagaAppearances(
  tmdbId: number,
  kind: MediaKind,
): Promise<SagaAppearance[]> {
  const sagas = await getAllSagas();
  return findAppearancesInSagas(sagas, tmdbId, kind);
}
