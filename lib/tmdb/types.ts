export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

export interface TmdbTvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
}

export interface TmdbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export interface TmdbCastMember extends TmdbPerson {
  character: string;
  order: number;
}

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface TmdbMovieDetails extends Omit<TmdbMovie, "genre_ids"> {
  runtime: number | null;
  genres: TmdbGenre[];
  tagline: string;
  status: string;
  belongs_to_collection: TmdbCollection | null;
}

export interface TmdbTvDetails extends Omit<TmdbTvShow, "genre_ids"> {
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: TmdbGenre[];
  tagline: string;
  status: string;
}

export interface TmdbCredits {
  id: number;
  cast: TmdbCastMember[];
  crew: Array<TmdbPerson & { job: string; department: string }>;
}
