import Link from "next/link";
import type { Saga } from "@/lib/chronologies/types";

export function SagaCard({ saga }: { saga: Saga }) {
  const entryCount = saga.entries.length;
  const yearRange = formatYearRange(saga.entries);

  return (
    <Link
      href={`/sagas/${saga.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 transition-colors hover:border-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-amber-500">
          {saga.name}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
          {saga.description}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
        <span>
          {entryCount} {entryCount === 1 ? "entrada" : "entradas"}
        </span>
        {yearRange && (
          <>
            <span aria-hidden="true">·</span>
            <span>{yearRange}</span>
          </>
        )}
      </div>
    </Link>
  );
}

function formatYearRange(entries: Saga["entries"]): string | null {
  const years = entries
    .map((e) => e.releaseYear)
    .filter((y): y is number => typeof y === "number" && Number.isFinite(y));
  if (years.length === 0) return null;

  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? `${min}` : `${min}–${max}`;
}
