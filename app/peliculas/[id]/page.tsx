import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CastList } from "@/components/CastList";
import { MovieHero } from "@/components/MovieHero";
import { SagaConnection } from "@/components/SagaConnection";
import { findSagaAppearances } from "@/lib/chronologies/sagaLookup";
import { getMovie, getMovieCredits } from "@/lib/tmdb/movies";

type Props = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseId(id);
  if (!movieId) return { title: "Película no encontrada — CineRuta" };

  const movie = await getMovie(movieId).catch(() => null);
  if (!movie) return { title: "Película no encontrada — CineRuta" };

  const year = movie.release_date?.slice(0, 4);
  return {
    title: `${movie.title}${year ? ` (${year})` : ""} — CineRuta`,
    description:
      movie.overview ||
      `${movie.title}${year ? ` (${year})` : ""} en CineRuta.`,
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movieId = parseId(id);
  if (!movieId) notFound();

  const [movie, credits, appearances] = await Promise.all([
    getMovie(movieId).catch((error) => {
      console.error(`[movie/${id}] details fetch failed:`, error);
      return null;
    }),
    getMovieCredits(movieId).catch((error) => {
      console.error(`[movie/${id}] credits fetch failed:`, error);
      return null;
    }),
    findSagaAppearances(movieId, "movie").catch((error) => {
      console.error(`[movie/${id}] saga lookup failed:`, error);
      return [];
    }),
  ]);

  if (!movie) notFound();

  const topCast = credits?.cast.slice(0, 12) ?? [];

  return (
    <>
      <MovieHero movie={movie} />
      <SagaConnection appearances={appearances} />
      <CastList cast={topCast} />
    </>
  );
}
