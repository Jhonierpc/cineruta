import { tmdbFetch } from "./client";
import type {
  TmdbCombinedCredits,
  TmdbPersonDetails,
} from "./types";

export function getPerson(id: number): Promise<TmdbPersonDetails> {
  return tmdbFetch<TmdbPersonDetails>(`/person/${id}`);
}

export function getPersonCombinedCredits(
  id: number,
): Promise<TmdbCombinedCredits> {
  return tmdbFetch<TmdbCombinedCredits>(`/person/${id}/combined_credits`);
}
