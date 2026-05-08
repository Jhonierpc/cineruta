import { promises as fs } from "node:fs";
import path from "node:path";
import type { Saga } from "./types";

const SAGAS_DIR = path.join(process.cwd(), "data", "sagas");

export async function getAllSagas(): Promise<Saga[]> {
  const files = await fs.readdir(SAGAS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const sagas = await Promise.all(
    jsonFiles.map(async (filename) => {
      const filePath = path.join(SAGAS_DIR, filename);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as Saga;
    }),
  );

  return sagas.sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getSagaBySlug(slug: string): Promise<Saga | null> {
  const filePath = path.join(SAGAS_DIR, `${slug}.json`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as Saga;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
