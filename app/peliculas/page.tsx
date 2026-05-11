import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MovieGrid } from "@/components/MovieGrid";
import { Pagination } from "@/components/Pagination";
import { getPopularMovies, TMDB_MAX_PAGE } from "@/lib/tmdb/movies";

type SearchParams = Promise<{ page?: string }>;
type Props = { searchParams: SearchParams };

const BASE_PATH = "/peliculas";

function sanitizePage(raw: string | undefined): number | null {
  if (raw === undefined) return 1;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.min(Math.max(Math.trunc(n), 1), TMDB_MAX_PAGE);
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page: rawPage } = await searchParams;
  const page = sanitizePage(rawPage) ?? 1;
  const suffix = page === 1 ? "" : ` — Página ${page}`;
  return {
    title: `Películas populares${suffix} — CineRuta`,
    description:
      "Catálogo de las películas más populares según TMDB. Descubre títulos y entra al detalle de cada uno.",
  };
}

export default async function MoviesPage({ searchParams }: Props) {
  const { page: rawPage } = await searchParams;
  const sanitized = sanitizePage(rawPage);

  if (sanitized === null) redirect(BASE_PATH);

  const canonical =
    sanitized === 1 ? BASE_PATH : `${BASE_PATH}?page=${sanitized}`;
  const current =
    rawPage !== undefined ? `${BASE_PATH}?page=${rawPage}` : BASE_PATH;
  if (current !== canonical) redirect(canonical);

  const data = await getPopularMovies(sanitized).catch((error) => {
    console.error(
      `[peliculas?page=${sanitized}] popular fetch failed:`,
      error,
    );
    return null;
  });

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight">Películas</h1>
        <p className="mt-6 text-neutral-400">
          No pudimos cargar el catálogo en este momento. Inténtalo más tarde.
        </p>
      </div>
    );
  }

  const totalPages = Math.min(data.total_pages, TMDB_MAX_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
          Catálogo TMDB
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Películas populares
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-400">
          Las películas más populares hoy según TMDB. Entra a cualquiera para
          ver sinopsis, géneros y reparto.
        </p>
      </header>

      <MovieGrid movies={data.results} />

      <Pagination
        currentPage={data.page}
        totalPages={totalPages}
        basePath={BASE_PATH}
      />
    </div>
  );
}
