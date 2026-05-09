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

export interface TmdbPersonDetails extends TmdbPerson {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  also_known_as: string[];
  imdb_id: string | null;
  gender: number;
}

export interface TmdbPersonMovieCredit {
  id: number;
  media_type: "movie";
  title: string;
  original_title: string;
  character: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  popularity: number;
  order: number;
}

export interface TmdbPersonTvCredit {
  id: number;
  media_type: "tv";
  name: string;
  original_name: string;
  character: string;
  first_air_date: string;
  poster_path: string | null;
  episode_count: number;
  vote_average: number;
  popularity: number;
}

export type TmdbPersonCredit = TmdbPersonMovieCredit | TmdbPersonTvCredit;

export interface TmdbCombinedCredits {
  id: number;
  cast: TmdbPersonCredit[];
  crew: Array<TmdbPersonCredit & { job: string; department: string }>;
}
