import Image from "next/image";
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
    <article>
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-neutral-900">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
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
      <h3 className="mt-3 text-sm font-semibold leading-tight">
        {person.name}
      </h3>
      {person.character && (
        <p className="mt-0.5 text-xs leading-tight text-neutral-500">
          {person.character}
        </p>
      )}
    </article>
  );
}
