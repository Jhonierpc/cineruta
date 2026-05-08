import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { TmdbCastMember } from "@/lib/tmdb/types";

export function CastList({ cast }: { cast: TmdbCastMember[] }) {
  if (cast.length === 0) return null;

  return (
    <section
      aria-labelledby="cast-heading"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <h2
        id="cast-heading"
        className="text-2xl font-bold tracking-tight sm:text-3xl"
      >
        Reparto
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cast.map((person) => (
          <li key={person.id}>
            <PersonCard person={person} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PersonCard({ person }: { person: TmdbCastMember }) {
  const photoUrl = tmdbImageUrl(person.profile_path, "w185");

  return (
    <Link
      href={`/actores/${person.id}`}
      aria-label={`Ver filmografía de ${person.name}`}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-neutral-900">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-3xl text-neutral-700"
            aria-hidden="true"
          >
            ◔
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold leading-tight transition-colors group-hover:text-amber-500">
        {person.name}
      </h3>
      {person.character && (
        <p className="mt-0.5 text-xs leading-tight text-neutral-500">
          {person.character}
        </p>
      )}
    </Link>
  );
}
