import Link from "next/link";
import type { ChronologyEntry } from "@/lib/chronologies/types";
import type { SagaAppearance } from "@/lib/chronologies/sagaLookup";

export function SagaConnection({
  appearances,
}: {
  appearances: SagaAppearance[];
}) {
  if (appearances.length === 0) return null;

  return (
    <section
      aria-label="Conexión con saga"
      className="mx-auto max-w-6xl px-6 py-8"
    >
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
        {appearances.length === 1 ? "Parte de una saga" : "Parte de varias sagas"}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {appearances.map((a) => (
          <SagaCard key={a.saga.slug} appearance={a} />
        ))}
      </div>
    </section>
  );
}

function SagaCard({ appearance }: { appearance: SagaAppearance }) {
  const { saga, entry, totalEntries, prevNarrative, nextNarrative } =
    appearance;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight text-neutral-50">
          {saga.name}
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-neutral-500">Cronológicamente</dt>
          <dd className="text-neutral-200">
            <span className="font-medium text-neutral-50">
              #{entry.narrativeOrder}
            </span>{" "}
            <span className="text-neutral-500">de {totalEntries}</span>
          </dd>
          <dt className="text-neutral-500">Por estreno</dt>
          <dd className="text-neutral-200">
            <span className="font-medium text-neutral-50">
              #{entry.releaseOrder}
            </span>{" "}
            <span className="text-neutral-500">de {totalEntries}</span>
          </dd>
        </dl>
      </header>

      {(prevNarrative || nextNarrative) && (
        <div className="space-y-1.5 text-sm">
          {prevNarrative && (
            <NeighborLink direction="prev" entry={prevNarrative} />
          )}
          {nextNarrative && (
            <NeighborLink direction="next" entry={nextNarrative} />
          )}
        </div>
      )}

      <Link
        href={`/sagas/${saga.slug}`}
        className="mt-auto inline-flex items-center text-sm font-medium text-amber-500 transition-colors hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-sm"
      >
        Ver timeline completo →
      </Link>
    </article>
  );
}

function NeighborLink({
  direction,
  entry,
}: {
  direction: "prev" | "next";
  entry: ChronologyEntry;
}) {
  const arrow = direction === "prev" ? "←" : "→";
  const label = direction === "prev" ? "Anterior" : "Siguiente";
  const path = entry.kind === "tv" ? "/series" : "/peliculas";

  return (
    <Link
      href={`${path}/${entry.tmdbId}`}
      className="group flex items-baseline gap-2 text-neutral-300 transition-colors hover:text-neutral-50 focus:outline-none focus-visible:text-amber-500"
    >
      <span aria-hidden="true" className="text-neutral-500">
        {arrow}
      </span>
      <span className="text-neutral-500">{label}:</span>
      <span className="line-clamp-1 font-medium group-hover:text-amber-500">
        {entry.title}
      </span>
    </Link>
  );
}
