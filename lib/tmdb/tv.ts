import { tmdbFetch } from "./client";
import { TMDB_MAX_PAGE } from "./movies";
import type {
  TmdbCredits,
  TmdbPaginatedResponse,
  TmdbTvDetails,
  TmdbTvShow,
} from "./types";

export function getTvShow(id: number): Promise<TmdbTvDetails> {
  return tmdbFetch<TmdbTvDetails>(`/tv/${id}`);
}

export function getTvCredits(id: number): Promise<TmdbCredits> {
  return tmdbFetch<TmdbCredits>(`/tv/${id}/credits`);
}

export function getPopularTv(
  page: number = 1,
): Promise<TmdbPaginatedResponse<TmdbTvShow>> {
  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), TMDB_MAX_PAGE);
  return tmdbFetch<TmdbPaginatedResponse<TmdbTvShow>>(
    `/tv/popular?page=${safePage}`,
  );
}
