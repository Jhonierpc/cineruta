import { tmdbFetch } from "./client";
import type { TmdbCredits, TmdbTvDetails } from "./types";

export function getTvShow(id: number): Promise<TmdbTvDetails> {
  return tmdbFetch<TmdbTvDetails>(`/tv/${id}`);
}

export function getTvCredits(id: number): Promise<TmdbCredits> {
  return tmdbFetch<TmdbCredits>(`/tv/${id}/credits`);
}
