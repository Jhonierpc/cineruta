import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChronologyTimeline } from "@/components/ChronologyTimeline";
import { OrderTabs, type ChronologyOrder } from "@/components/OrderTabs";
import { getAllSagas, getSagaBySlug } from "@/lib/chronologies/loader";
import type {
  ChronologyEntry,
  EnrichedEntry,
} from "@/lib/chronologies/types";
import { tmdbImageUrl } from "@/lib/tmdb/client";
import { getMovie } from "@/lib/tmdb/movies";
import { getTvShow } from "@/lib/tmdb/tv";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order?: string }>;
};

export async function generateStaticParams() {
  const sagas = await getAllSagas();
  return sagas.map((saga) => ({ slug: saga.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const saga = await getSagaBySlug(slug);
  if (!saga) {
    return { title: "Saga no encontrada — CineRuta" };
  }
  return {
    title: `${saga.name} — CineRuta`,
    description: saga.description,
  };
}

async function enrichEntry(entry: ChronologyEntry): Promise<EnrichedEntry> {
  try {
    if (entry.kind === "movie") {
      const movie = await getMovie(entry.tmdbId);
      return { ...entry, posterUrl: tmdbImageUrl(movie.poster_path, "w185") };
    }
    const tv = await getTvShow(entry.tmdbId);
    return { ...entry, posterUrl: tmdbImageUrl(tv.poster_path, "w185") };
  } catch (error) {
    console.error(
      `[saga] TMDB fetch failed for ${entry.kind}/${entry.tmdbId}:`,
      error,
    );
    return { ...entry, posterUrl: null };
  }
}

export default async function SagaDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { order: orderParam } = await searchParams;

  const saga = await getSagaBySlug(slug);
  if (!saga) notFound();

  const order: ChronologyOrder =
    orderParam === "release" ? "release" : "narrative";

  const enrichedEntries = await Promise.all(saga.entries.map(enrichEntry));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <header>
        <Link
          href="/sagas"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-300 focus:outline-none focus-visible:text-amber-500"
        >
          <span aria-hidden="true">←</span>
          Volver a sagas
        </Link>
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
          Saga curada
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {saga.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-400">
          {saga.description}
        </p>
      </header>

      <OrderTabs slug={saga.slug} active={order} />

      <ChronologyTimeline entries={enrichedEntries} order={order} />
    </div>
  );
}
