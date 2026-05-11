import Image from "next/image";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { TmdbTvSeason } from "@/lib/tmdb/types";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function formatAirDate(date: string | null): string | null {
  if (!date || date.length < 4) return null;
  return DATE_FORMATTER.format(new Date(date));
}

function formatEpisodes(count: number): string {
  return count === 1 ? "1 episodio" : `${count} episodios`;
}

export function SeasonsList({ seasons }: { seasons: TmdbTvSeason[] }) {
  const visible = seasons
    .filter((s) => s.season_number > 0 && s.episode_count > 0)
    .sort((a, b) => a.season_number - b.season_number);

  if (visible.length === 0) return null;

  return (
    <section
      aria-labelledby="seasons-heading"
      className="mx-auto max-w-6xl px-6 py-12"
    >
      <h2
        id="seasons-heading"
        className="text-2xl font-bold tracking-tight sm:text-3xl"
      >
        Temporadas
      </h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((season) => (
          <li key={season.id}>
            <SeasonCard season={season} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SeasonCard({ season }: { season: TmdbTvSeason }) {
  const posterUrl = tmdbImageUrl(season.poster_path, "w185");
  const airDate = formatAirDate(season.air_date);

  return (
    <article className="flex gap-4 rounded-2xl border border-neutral-900 bg-neutral-950/40 p-4">
      <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-900">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-2xl text-neutral-700"
            aria-hidden="true"
          >
            ▢
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-tight text-neutral-50">
          {season.name}
        </h3>
        <p className="mt-1 text-xs text-neutral-500">
          {formatEpisodes(season.episode_count)}
          {airDate && (
            <>
              <span aria-hidden="true"> · </span>
              {airDate}
            </>
          )}
        </p>
        {season.overview && (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-neutral-300">
            {season.overview}
          </p>
        )}
      </div>
    </article>
  );
}
