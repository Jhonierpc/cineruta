import type { ChronologyEntry, MediaKind } from "@/lib/chronologies/types";
import type { ChronologyOrder } from "./OrderTabs";

const KIND_LABEL: Record<MediaKind, string> = {
  movie: "Película",
  tv: "Serie",
  anime: "Anime",
};

export function ChronologyTimeline({
  entries,
  order,
}: {
  entries: ChronologyEntry[];
  order: ChronologyOrder;
}) {
  const sorted = [...entries].sort((a, b) =>
    order === "narrative"
      ? a.narrativeOrder - b.narrativeOrder
      : a.releaseOrder - b.releaseOrder,
  );

  if (sorted.length === 0) {
    return (
      <p className="mt-12 text-neutral-500">
        Esta saga aún no tiene entradas.
      </p>
    );
  }

  return (
    <ol className="relative mt-12 space-y-10 border-l border-neutral-800 pl-8">
      {sorted.map((entry, idx) => (
        <li key={`${entry.tmdbId}-${idx}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[33px] top-2 size-3 rounded-full bg-amber-500 ring-4 ring-neutral-950"
          />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-neutral-500">
            <span className="font-mono text-amber-500">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span>{entry.releaseYear}</span>
            <span aria-hidden="true">·</span>
            <span>{KIND_LABEL[entry.kind]}</span>
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {entry.title}
          </h2>
          {entry.notes && (
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {entry.notes}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
