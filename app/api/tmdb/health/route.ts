import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb/client";

interface TmdbConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
  };
}

export async function GET() {
  const start = Date.now();

  try {
    const config = await tmdbFetch<TmdbConfiguration>("/configuration", {
      revalidate: 0,
    });
    return NextResponse.json({
      status: "ok",
      latencyMs: Date.now() - start,
      tmdbImageBaseUrl: config.images.secure_base_url,
    });
  } catch (error) {
    console.error("[/api/tmdb/health] TMDB call failed:", error);
    const isAuthError =
      error instanceof Error && /401|TMDB_API_KEY/i.test(error.message);
    return NextResponse.json(
      {
        status: "error",
        hint: isAuthError
          ? "TMDB_API_KEY ausente o inválida — revisa .env.local"
          : "TMDB inalcanzable — revisa conectividad y configuración",
      },
      { status: isAuthError ? 401 : 502 },
    );
  }
}
