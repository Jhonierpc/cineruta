import { describe, it, expect } from "vitest";
import { getAllSagas, getSagaBySlug } from "./loader";
import type { Saga } from "./types";

describe("chronologies/loader", () => {
  describe("getAllSagas", () => {
    it("loads every curated saga JSON from data/sagas/", async () => {
      const sagas = await getAllSagas();

      // Currently 6 curated sagas: mcu, disney-plus-mcu, star-wars,
      // star-wars-machete, harry-potter, middle-earth.
      // Use >= so adding new sagas doesn't break the suite.
      expect(sagas.length).toBeGreaterThanOrEqual(6);

      const slugs = sagas.map((s) => s.slug);
      expect(slugs).toContain("mcu");
      expect(slugs).toContain("star-wars");
      expect(slugs).toContain("star-wars-machete");
      expect(slugs).toContain("harry-potter");
      expect(slugs).toContain("middle-earth");
      expect(slugs).toContain("disney-plus-mcu");
    });

    it("returns sagas sorted alphabetically by name (es locale)", async () => {
      const sagas = await getAllSagas();
      const names = sagas.map((s) => s.name);
      const sorted = [...names].sort((a, b) => a.localeCompare(b, "es"));
      expect(names).toEqual(sorted);
    });

    it("each saga conforms to the Saga shape with non-empty entries", async () => {
      const sagas = await getAllSagas();

      for (const saga of sagas) {
        expect(typeof saga.slug).toBe("string");
        expect(saga.slug.length).toBeGreaterThan(0);
        expect(typeof saga.name).toBe("string");
        expect(typeof saga.description).toBe("string");
        expect(typeof saga.curatedAt).toBe("string");
        expect(Array.isArray(saga.entries)).toBe(true);
        expect(saga.entries.length).toBeGreaterThan(0);

        for (const entry of saga.entries) {
          expect(typeof entry.tmdbId).toBe("number");
          expect(entry.tmdbId).toBeGreaterThan(0);
          expect(["movie", "tv", "anime"]).toContain(entry.kind);
          expect(typeof entry.title).toBe("string");
          expect(typeof entry.releaseYear).toBe("number");
          expect(typeof entry.narrativeOrder).toBe("number");
          expect(typeof entry.releaseOrder).toBe("number");
        }
      }
    });
  });

  describe("getSagaBySlug", () => {
    it("returns the matching saga for an existing slug", async () => {
      const saga = await getSagaBySlug("mcu");
      expect(saga).not.toBeNull();
      const mcu = saga as Saga;
      expect(mcu.slug).toBe("mcu");
      expect(mcu.name).toMatch(/Marvel/i);
      expect(mcu.entries.length).toBeGreaterThan(0);
    });

    it("returns null for a non-existent slug (ENOENT swallowed)", async () => {
      const saga = await getSagaBySlug("does-not-exist-saga-xyz");
      expect(saga).toBeNull();
    });

    it("loads the Star Wars Machete order with the curated entries", async () => {
      const saga = await getSagaBySlug("star-wars-machete");
      expect(saga).not.toBeNull();
      const machete = saga as Saga;
      // Machete Order intentionally drops Episode I → 5 entries (IV, V, II, III, VI).
      expect(machete.entries.length).toBe(5);

      // narrativeOrder must form a 1..N permutation.
      const narrative = machete.entries
        .map((e) => e.narrativeOrder)
        .sort((a, b) => a - b);
      expect(narrative).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
