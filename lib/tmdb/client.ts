const TMDB_BASE_URL =
  process.env.TMDB_API_BASE_URL ?? "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL =
  process.env.TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";
const DEFAULT_LANG = process.env.TMDB_DEFAULT_LANG ?? "es-ES";

interface FetchOptions {
  lang?: string;
  revalidate?: number;
}

export async function tmdbFetch<T>(
  path: string,
  { lang = DEFAULT_LANG, revalidate = 60 * 60 * 24 }: FetchOptions = {},
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY no está configurada en .env.local");
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("language", lang);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function tmdbImageUrl(
  path: string | null,
  size: string = "w500",
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
