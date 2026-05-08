import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilmographyList } from "@/components/FilmographyList";
import { PersonHero } from "@/components/PersonHero";
import {
  getPerson,
  getPersonCombinedCredits,
} from "@/lib/tmdb/persons";
import type { TmdbPersonCredit } from "@/lib/tmdb/types";

type Props = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function creditDate(c: TmdbPersonCredit): string {
  return c.media_type === "movie" ? c.release_date : c.first_air_date;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const personId = parseId(id);
  if (!personId) return { title: "Actor no encontrado — CineRuta" };

  const person = await getPerson(personId).catch(() => null);
  if (!person) return { title: "Actor no encontrado — CineRuta" };

  return {
    title: `${person.name} — CineRuta`,
    description: person.biography
      ? person.biography.slice(0, 160)
      : `Filmografía cronológica de ${person.name}.`,
  };
}

export default async function PersonDetailPage({ params }: Props) {
  const { id } = await params;
  const personId = parseId(id);
  if (!personId) notFound();

  const [person, credits] = await Promise.all([
    getPerson(personId).catch((error) => {
      console.error(`[person/${id}] details fetch failed:`, error);
      return null;
    }),
    getPersonCombinedCredits(personId).catch((error) => {
      console.error(`[person/${id}] credits fetch failed:`, error);
      return null;
    }),
  ]);

  if (!person) notFound();

  const filmography = (credits?.cast ?? [])
    .filter((c) => {
      const date = creditDate(c);
      return date && date.length >= 4;
    })
    .sort((a, b) => creditDate(a).localeCompare(creditDate(b)));

  return (
    <>
      <PersonHero person={person} />
      <section
        aria-labelledby="filmography-heading"
        className="mx-auto max-w-6xl px-6 pb-16"
      >
        <h2
          id="filmography-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Filmografía cronológica
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          {filmography.length} créditos como reparto, del más antiguo al más
          reciente.
        </p>
        <div className="mt-8">
          <FilmographyList credits={filmography} />
        </div>
      </section>
    </>
  );
}
