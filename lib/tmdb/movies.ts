import { tmdbFetch } from "./client";
import type {
  TmdbCredits,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbPaginatedResponse,
} from "./types";

export const TMDB_MAX_PAGE = 500;

export function getMovie(id: number): Promise<TmdbMovieDetails> {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${id}`);
}

export function getMovieCredits(id: number): Promise<TmdbCredits> {
  return tmdbFetch<TmdbCredits>(`/movie/${id}/credits`);
}

export function getPopularMovies(
  page: number = 1,
): Promise<TmdbPaginatedResponse<TmdbMovie>> {
  const safePage = Math.min(Math.max(Math.trunc(page) || 1, 1), TMDB_MAX_PAGE);
  return tmdbFetch<TmdbPaginatedResponse<TmdbMovie>>(
    `/movie/popular?page=${safePage}`,
  );
}
