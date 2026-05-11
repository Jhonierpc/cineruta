import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { TmdbPersonCredit } from "@/lib/tmdb/types";

export function FilmographyList({ credits }: { credits: TmdbPersonCredit[] }) {
  if (credits.length === 0) {
    return (
      <p className="text-neutral-500">
        Sin filmografía registrada en TMDB.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-900">
      {credits.map((credit, idx) => (
        <li
          key={`${credit.id}-${credit.media_type}-${idx}`}
          className="[content-visibility:auto] [contain-intrinsic-size:auto_72px]"
        >
          <FilmographyRow credit={credit} />
        </li>
      ))}
    </ul>
  );
}

function FilmographyRow({ credit }: { credit: TmdbPersonCredit }) {
  const isMovie = credit.media_type === "movie";
  const title = isMovie ? credit.title : credit.name;
  const date = isMovie ? credit.release_date : credit.first_air_date;
  const year = date.slice(0, 4);
  const kindLabel = isMovie ? "Película" : "Serie";
  const posterUrl = tmdbImageUrl(credit.poster_path, "w92");
  const href = isMovie ? `/peliculas/${credit.id}` : `/series/${credit.id}`;

  return (
    <Link
      href={href}
      aria-label={`Ver detalles de ${title}`}
      className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    >
      <div className="flex items-center gap-4 px-2 py-3 transition-colors group-hover:bg-neutral-900/50 sm:gap-5 sm:px-3">
        <span className="w-10 shrink-0 font-mono text-sm tabular-nums text-amber-500 sm:w-14">
          {year}
        </span>
        <div className="relative aspect-[2/3] w-10 shrink-0 overflow-hidden rounded-md bg-neutral-900 sm:w-12">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold tracking-tight transition-colors group-hover:text-amber-500">
            {title}
          </h3>
          {credit.character && (
            <p className="truncate text-sm text-neutral-400">
              como {credit.character}
            </p>
          )}
        </div>
        <span className="hidden shrink-0 text-xs text-neutral-500 sm:inline">
          {kindLabel}
        </span>
      </div>
    </Link>
  );
}
