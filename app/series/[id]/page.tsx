import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CastList } from "@/components/CastList";
import { SagaConnection } from "@/components/SagaConnection";
import { SeasonsList } from "@/components/SeasonsList";
import { TvHero } from "@/components/TvHero";
import { findSagaAppearances } from "@/lib/chronologies/sagaLookup";
import { getTvShow, getTvCredits } from "@/lib/tmdb/tv";

type Props = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tvId = parseId(id);
  if (!tvId) return { title: "Serie no encontrada — CineRuta" };

  const tv = await getTvShow(tvId).catch(() => null);
  if (!tv) return { title: "Serie no encontrada — CineRuta" };

  const year = tv.first_air_date?.slice(0, 4);
  return {
    title: `${tv.name}${year ? ` (${year})` : ""} — CineRuta`,
    description:
      tv.overview || `${tv.name}${year ? ` (${year})` : ""} en CineRuta.`,
  };
}

export default async function TvDetailPage({ params }: Props) {
  const { id } = await params;
  const tvId = parseId(id);
  if (!tvId) notFound();

  const [tv, credits, appearances] = await Promise.all([
    getTvShow(tvId).catch((error) => {
      console.error(`[tv/${id}] details fetch failed:`, error);
      return null;
    }),
    getTvCredits(tvId).catch((error) => {
      console.error(`[tv/${id}] credits fetch failed:`, error);
      return null;
    }),
    findSagaAppearances(tvId, "tv").catch((error) => {
      console.error(`[tv/${id}] saga lookup failed:`, error);
      return [];
    }),
  ]);

  if (!tv) notFound();

  const topCast = credits?.cast.slice(0, 12) ?? [];

  return (
    <>
      <TvHero tv={tv} />
      <SagaConnection appearances={appearances} />
      <SeasonsList seasons={tv.seasons ?? []} />
      <CastList cast={topCast} />
    </>
  );
}
