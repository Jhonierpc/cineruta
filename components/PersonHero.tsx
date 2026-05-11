import Image from "next/image";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import type { TmdbPersonDetails } from "@/lib/tmdb/types";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return DATE_FORMATTER.format(d);
}

function eyebrow(department: string): string {
  if (department === "Acting") return "Actor / Actriz";
  if (department === "Directing") return "Dirección";
  if (department === "Writing") return "Guion";
  if (department === "Production") return "Producción";
  return department;
}

export function PersonHero({ person }: { person: TmdbPersonDetails }) {
  const photoUrl = tmdbImageUrl(person.profile_path, "w342");
  const birth = formatDate(person.birthday);
  const death = formatDate(person.deathday);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12 pt-16 sm:pt-24">
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        {photoUrl && (
          <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 sm:w-56">
            <Image
              src={photoUrl}
              alt={`Foto de ${person.name}`}
              fill
              priority
              sizes="(min-width: 640px) 224px, 192px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
            {eyebrow(person.known_for_department)}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {person.name}
          </h1>
          {(birth || person.place_of_birth) && (
            <p className="mt-3 text-sm text-neutral-400">
              {birth && <>Nacimiento: {birth}</>}
              {birth && person.place_of_birth && (
                <span aria-hidden="true"> · </span>
              )}
              {person.place_of_birth}
            </p>
          )}
          {death && (
            <p className="mt-1 text-sm text-neutral-400">
              Fallecimiento: {death}
            </p>
          )}
          {person.biography && (
            <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-neutral-300">
              {person.biography}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
