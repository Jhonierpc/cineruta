import Image from "next/image";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { TmdbMovieDetails } from "@/lib/tmdb/types";

export function MovieHero({ movie }: { movie: TmdbMovieDetails }) {
  const backdropUrl = tmdbImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = tmdbImageUrl(movie.poster_path, "w342");
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const genres = movie.genres.map((g) => g.name).join(", ");

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
              alt={`Póster de ${movie.title}`}
              fill
              sizes="(min-width: 640px) 224px, 192px"
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-400">
            {year && <span>{year}</span>}
            {runtime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{runtime}</span>
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
            {movie.title}
          </h1>
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="mt-1 text-sm text-neutral-500">
              Título original: {movie.original_title}
            </p>
          )}
          {movie.tagline && (
            <p className="mt-5 text-lg italic text-amber-500">
              {movie.tagline}
            </p>
          )}
          {movie.overview && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
