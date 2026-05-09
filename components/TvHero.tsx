import Image from "next/image";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { TmdbTvDetails } from "@/lib/tmdb/types";

function formatSeasonCount(count: number): string {
  return count === 1 ? "1 temporada" : `${count} temporadas`;
}

function formatEpisodeCount(count: number): string {
  return count === 1 ? "1 episodio" : `${count} episodios`;
}

export function TvHero({ tv }: { tv: TmdbTvDetails }) {
  const backdropUrl = tmdbImageUrl(tv.backdrop_path, "w1280");
  const posterUrl = tmdbImageUrl(tv.poster_path, "w342");
  const year = tv.first_air_date?.slice(0, 4);
  const seasons = tv.number_of_seasons > 0 ? formatSeasonCount(tv.number_of_seasons) : null;
  const episodes = tv.number_of_episodes > 0 ? formatEpisodeCount(tv.number_of_episodes) : null;
  const genres = tv.genres.map((g) => g.name).join(", ");

  return (
    <section className="relative">
      {backdropUrl && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/85 to-neutral-950" />
        </div>
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-16 pt-20 sm:flex-row sm:gap-10 sm:pt-32">
        {posterUrl && (
          <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 sm:w-56">
            <Image
              src={posterUrl}
              alt={`Póster de ${tv.name}`}
              fill
              sizes="(min-width: 640px) 224px, 192px"
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-400">
            {year && <span>{year}</span>}
            {seasons && (
              <>
                <span aria-hidden="true">·</span>
                <span>{seasons}</span>
              </>
            )}
            {episodes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{episodes}</span>
              </>
            )}
            {genres && (
              <>
                <span aria-hidden="true">·</span>
                <span>{genres}</span>
              </>
            )}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {tv.name}
          </h1>
          {tv.original_name && tv.original_name !== tv.name && (
            <p className="mt-1 text-sm text-neutral-500">
              Título original: {tv.original_name}
            </p>
          )}
          {tv.tagline && (
            <p className="mt-5 text-lg italic text-amber-500">{tv.tagline}</p>
          )}
          {tv.overview && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300">
              {tv.overview}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
