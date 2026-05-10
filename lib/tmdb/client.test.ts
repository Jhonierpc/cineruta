import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockInstance,
} from "vitest";
import { tmdbFetch, tmdbImageUrl } from "./client";

/**
 * The TMDB client reads `process.env.TMDB_*` at call time, so we set/reset
 * envs around each test for full isolation.
 */
const ORIGINAL_ENV = { ...process.env };

function makeOkResponse<T>(payload: T): Response {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => payload,
  } as unknown as Response;
}

function makeErrorResponse(status: number, statusText: string): Response {
  return {
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  } as unknown as Response;
}

describe("tmdb/client", () => {
  let fetchSpy: MockInstance<typeof fetch>;

  beforeEach(() => {
    process.env.TMDB_API_KEY = "test-bearer-token";
    process.env.TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
    process.env.TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
    process.env.TMDB_DEFAULT_LANG = "es-ES";

    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  describe("tmdbFetch", () => {
    it("builds the request with Bearer auth, Accept JSON and language=es-ES by default", async () => {
      fetchSpy.mockResolvedValueOnce(makeOkResponse({ id: 42 }));

      const data = await tmdbFetch<{ id: number }>("/movie/42");

      expect(data).toEqual({ id: 42 });
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      const [urlArg, init] = fetchSpy.mock.calls[0];
      const url = urlArg as URL;
      expect(url).toBeInstanceOf(URL);
      expect(url.origin + url.pathname).toBe(
        "https://api.themoviedb.org/3/movie/42",
      );
      expect(url.searchParams.get("language")).toBe("es-ES");

      const headers = (init?.headers ?? {}) as Record<string, string>;
      expect(headers.Authorization).toBe("Bearer test-bearer-token");
      expect(headers.Accept).toBe("application/json");
    });

    it("forwards the revalidate option to Next.js fetch (default 24h)", async () => {
      fetchSpy.mockResolvedValueOnce(makeOkResponse({}));

      await tmdbFetch("/configuration");

      const init = fetchSpy.mock.calls[0][1] as RequestInit & {
        next?: { revalidate?: number };
      };
      expect(init.next?.revalidate).toBe(60 * 60 * 24);
    });

    it("honors a custom revalidate when provided", async () => {
      fetchSpy.mockResolvedValueOnce(makeOkResponse({}));

      await tmdbFetch("/movie/1", { revalidate: 60 });

      const init = fetchSpy.mock.calls[0][1] as RequestInit & {
        next?: { revalidate?: number };
      };
      expect(init.next?.revalidate).toBe(60);
    });

    it("honors a custom language override", async () => {
      fetchSpy.mockResolvedValueOnce(makeOkResponse({}));

      await tmdbFetch("/movie/1", { lang: "en-US" });

      const url = fetchSpy.mock.calls[0][0] as URL;
      expect(url.searchParams.get("language")).toBe("en-US");
    });

    it("throws a sanitized error including status and statusText on non-2xx", async () => {
      fetchSpy.mockResolvedValueOnce(makeErrorResponse(404, "Not Found"));

      await expect(tmdbFetch("/movie/999999999")).rejects.toThrow(
        "TMDB 404: Not Found",
      );
    });

    it("throws a clear error when TMDB_API_KEY is missing (no fetch call)", async () => {
      delete process.env.TMDB_API_KEY;

      await expect(tmdbFetch("/movie/1")).rejects.toThrow(
        /TMDB_API_KEY no está configurada/,
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe("tmdbImageUrl", () => {
    it("returns null when path is null", () => {
      expect(tmdbImageUrl(null)).toBeNull();
    });

    it("builds a w500 URL by default", () => {
      expect(tmdbImageUrl("/abc.jpg")).toBe(
        "https://image.tmdb.org/t/p/w500/abc.jpg",
      );
    });

    it("respects a custom size", () => {
      expect(tmdbImageUrl("/abc.jpg", "original")).toBe(
        "https://image.tmdb.org/t/p/original/abc.jpg",
      );
    });
  });
});
