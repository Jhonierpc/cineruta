import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockInstance,
} from "vitest";
import { getPopularMovies, TMDB_MAX_PAGE } from "./movies";
import type { TmdbMovie, TmdbPaginatedResponse } from "./types";

const ORIGINAL_ENV = { ...process.env };

function makeOkResponse<T>(payload: T): Response {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => payload,
  } as unknown as Response;
}

const SAMPLE_PAGE: TmdbPaginatedResponse<TmdbMovie> = {
  page: 2,
  total_pages: 100,
  total_results: 2000,
  results: [
    {
      id: 550,
      title: "El club de la pelea",
      original_title: "Fight Club",
      overview: "...",
      release_date: "1999-10-15",
      poster_path: "/poster.jpg",
      backdrop_path: "/back.jpg",
      vote_average: 8.4,
      genre_ids: [18],
    },
  ],
};

describe("tmdb/movies — getPopularMovies", () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    process.env.TMDB_API_KEY = "test-bearer-token";
    process.env.TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
    process.env.TMDB_DEFAULT_LANG = "es-ES";

    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  it("hits /movie/popular with page=1 by default and returns the parsed payload", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    const data = await getPopularMovies();

    expect(data).toEqual(SAMPLE_PAGE);
    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.pathname).toBe("/3/movie/popular");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("language")).toBe("es-ES");
  });

  it("forwards a valid page in [1, 500]", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularMovies(42);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("42");
  });

  it("clamps page below 1 to 1", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularMovies(0);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("clamps page above TMDB_MAX_PAGE to 500", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularMovies(9999);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe(String(TMDB_MAX_PAGE));
  });

  it("truncates fractional page values", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularMovies(3.9);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("3");
  });

  it("falls back to page 1 when given NaN", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularMovies(Number.NaN);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("1");
  });
});
