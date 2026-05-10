import { describe, it, expect } from "vitest";
import {
  findAppearancesInSagas,
  findSagaAppearances,
} from "./sagaLookup";
import type { Saga } from "./types";

const FAKE_SAGA: Saga = {
  slug: "fake-saga",
  name: "Fake Saga",
  description: "Solo para tests.",
  curatedAt: "2026-05-10",
  entries: [
    {
      tmdbId: 100,
      kind: "movie",
      title: "Origin",
      releaseYear: 2000,
      narrativeOrder: 1,
      releaseOrder: 2,
    },
    {
      tmdbId: 101,
      kind: "movie",
      title: "Sequel",
      releaseYear: 2002,
      narrativeOrder: 2,
      releaseOrder: 1,
    },
    {
      tmdbId: 102,
      kind: "tv",
      title: "Spinoff Series",
      releaseYear: 2024,
      narrativeOrder: 3,
      releaseOrder: 3,
    },
  ],
};

const SECOND_SAGA: Saga = {
  slug: "alt-order",
  name: "Alternate Order",
  description: "Misma franquicia, distinto orden.",
  curatedAt: "2026-05-10",
  entries: [
    {
      tmdbId: 101,
      kind: "movie",
      title: "Sequel",
      releaseYear: 2002,
      narrativeOrder: 1,
      releaseOrder: 1,
    },
    {
      tmdbId: 100,
      kind: "movie",
      title: "Origin",
      releaseYear: 2000,
      narrativeOrder: 2,
      releaseOrder: 2,
    },
  ],
};

describe("chronologies/sagaLookup — findAppearancesInSagas", () => {
  it("returns an empty array when the tmdbId is not in any saga", () => {
    const result = findAppearancesInSagas([FAKE_SAGA], 9999, "movie");
    expect(result).toEqual([]);
  });

  it("respects kind: a movie tmdbId queried as tv must not match", () => {
    const result = findAppearancesInSagas([FAKE_SAGA], 100, "tv");
    expect(result).toEqual([]);
  });

  it("finds a single appearance and exposes saga + entry + total", () => {
    const [match] = findAppearancesInSagas([FAKE_SAGA], 101, "movie");
    expect(match.saga.slug).toBe("fake-saga");
    expect(match.saga.name).toBe("Fake Saga");
    expect(match.entry.tmdbId).toBe(101);
    expect(match.entry.narrativeOrder).toBe(2);
    expect(match.entry.releaseOrder).toBe(1);
    expect(match.totalEntries).toBe(3);
  });

  it("computes prevNarrative and nextNarrative based on narrativeOrder", () => {
    const [match] = findAppearancesInSagas([FAKE_SAGA], 101, "movie");
    expect(match.prevNarrative?.tmdbId).toBe(100);
    expect(match.nextNarrative?.tmdbId).toBe(102);
  });

  it("returns null prevNarrative for the first entry", () => {
    const [match] = findAppearancesInSagas([FAKE_SAGA], 100, "movie");
    expect(match.prevNarrative).toBeNull();
    expect(match.nextNarrative?.tmdbId).toBe(101);
  });

  it("returns null nextNarrative for the last entry", () => {
    const [match] = findAppearancesInSagas([FAKE_SAGA], 102, "tv");
    expect(match.prevNarrative?.tmdbId).toBe(101);
    expect(match.nextNarrative).toBeNull();
  });

  it("returns one appearance per saga when an entry exists in multiple sagas", () => {
    const matches = findAppearancesInSagas(
      [FAKE_SAGA, SECOND_SAGA],
      101,
      "movie",
    );
    expect(matches).toHaveLength(2);
    const slugs = matches.map((m) => m.saga.slug);
    expect(slugs).toContain("fake-saga");
    expect(slugs).toContain("alt-order");

    const fake = matches.find((m) => m.saga.slug === "fake-saga")!;
    const alt = matches.find((m) => m.saga.slug === "alt-order")!;
    expect(fake.entry.narrativeOrder).toBe(2);
    expect(alt.entry.narrativeOrder).toBe(1);
    expect(alt.prevNarrative).toBeNull();
  });

  it("sorts appearances alphabetically by saga name (es locale)", () => {
    const matches = findAppearancesInSagas(
      [FAKE_SAGA, SECOND_SAGA],
      101,
      "movie",
    );
    expect(matches.map((m) => m.saga.name)).toEqual([
      "Alternate Order",
      "Fake Saga",
    ]);
  });
});

describe("chronologies/sagaLookup — findSagaAppearances (integration)", () => {
  it("finds Iron Man (1726) as a movie inside MCU", async () => {
    const matches = await findSagaAppearances(1726, "movie");
    const mcu = matches.find((m) => m.saga.slug === "mcu");
    expect(mcu).toBeDefined();
    expect(mcu!.entry.title).toMatch(/Iron Man/i);
    expect(mcu!.entry.narrativeOrder).toBeGreaterThan(0);
    expect(mcu!.totalEntries).toBeGreaterThanOrEqual(34);
  });

  it("returns an empty array for a tmdbId that is not curated", async () => {
    const matches = await findSagaAppearances(999_999_999, "movie");
    expect(matches).toEqual([]);
  });

  it("Empire Strikes Back (1891) appears in BOTH star-wars and star-wars-machete", async () => {
    const matches = await findSagaAppearances(1891, "movie");
    const slugs = matches.map((m) => m.saga.slug);
    expect(slugs).toContain("star-wars");
    expect(slugs).toContain("star-wars-machete");
  });
});
