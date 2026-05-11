import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockInstance,
} from "vitest";
import { TMDB_MAX_PAGE } from "./movies";
import { getPopularTv } from "./tv";
import type { TmdbPaginatedResponse, TmdbTvShow } from "./types";

const ORIGINAL_ENV = { ...process.env };

function makeOkResponse<T>(payload: T): Response {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => payload,
  } as unknown as Response;
}

const SAMPLE_PAGE: TmdbPaginatedResponse<TmdbTvShow> = {
  page: 2,
  total_pages: 100,
  total_results: 2000,
  results: [
    {
      id: 1399,
      name: "Juego de tronos",
      original_name: "Game of Thrones",
      overview: "...",
      first_air_date: "2011-04-17",
      poster_path: "/poster.jpg",
      backdrop_path: "/back.jpg",
      vote_average: 8.4,
      genre_ids: [10765, 18],
    },
  ],
};

describe("tmdb/tv — getPopularTv", () => {
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

  it("hits /tv/popular with page=1 by default and returns the parsed payload", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    const data = await getPopularTv();

    expect(data).toEqual(SAMPLE_PAGE);
    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.pathname).toBe("/3/tv/popular");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("language")).toBe("es-ES");
  });

  it("forwards a valid page in [1, 500]", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularTv(42);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("42");
  });

  it("clamps page below 1 to 1", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularTv(0);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("clamps page above TMDB_MAX_PAGE to 500", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularTv(9999);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe(String(TMDB_MAX_PAGE));
  });

  it("truncates fractional page values", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularTv(3.9);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("3");
  });

  it("falls back to page 1 when given NaN", async () => {
    fetchSpy.mockResolvedValueOnce(makeOkResponse(SAMPLE_PAGE));

    await getPopularTv(Number.NaN);

    const url = fetchSpy.mock.calls[0][0] as URL;
    expect(url.searchParams.get("page")).toBe("1");
  });
});
