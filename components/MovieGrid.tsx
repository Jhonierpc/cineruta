import Image from "next/image";
import Link from "next/link";
import type { TmdbMovie } from "@/lib/tmdb/types";
import { tmdbImageUrl } from "@/lib/tmdb/client";

export function MovieGrid({ movies }: { movies: TmdbMovie[] }) {
  if (movies.length === 0) {
    return (
      <p className="mt-12 text-neutral-500">No hay películas para mostrar.</p>
    );
  }

  return (
    <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}

function MovieCard({ movie }: { movie: TmdbMovie }) {
  const posterUrl = tmdbImageUrl(movie.poster_path, "w342");
  const year = movie.release_date?.slice(0, 4) ?? null;

  return (
    <Link
      href={`/peliculas/${movie.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-lg"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-neutral-900">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`Póster de ${movie.title}`}
            fill
            sizes="(min-width: 1024px) 18vw, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl text-neutral-700"
            aria-hidden="true"
          >
            ▢
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <h2 className="line-clamp-2 text-sm font-medium text-neutral-100 transition-colors group-hover:text-amber-500">
          {movie.title}
        </h2>
        {year && <p className="mt-1 text-xs text-neutral-500">{year}</p>}
      </div>
    </Link>
  );
}
