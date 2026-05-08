import { tmdbFetch } from "./client";
import type { TmdbCredits, TmdbMovieDetails } from "./types";

export function getMovie(id: number): Promise<TmdbMovieDetails> {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${id}`);
}

export function getMovieCredits(id: number): Promise<TmdbCredits> {
  return tmdbFetch<TmdbCredits>(`/movie/${id}/credits`);
}
