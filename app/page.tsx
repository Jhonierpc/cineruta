import Link from "next/link";

const FEATURES = [
  {
    title: "Cronologías curadas",
    description:
      "Orden narrativo y de estreno de las grandes sagas, revisado a mano.",
  },
  {
    title: "Catálogo completo",
    description:
      "Películas, series y animes con su información detallada vía TMDB.",
  },
  {
    title: "Reparto y filmografía",
    description:
      "Reparto de cada producción y filmografía cronológica de cada actor.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
          Tu guía cronológica del cine
        </p>
        <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-7xl">
          Encuentra el orden correcto.
          <br />
          <span className="text-neutral-500">Disfruta cada saga.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-400">
          Descubre el orden cronológico narrativo y de estreno de las grandes
          franquicias y universos cinematográficos. Sin reproducir contenido —
          solo la ruta correcta para verlos.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/sagas"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-neutral-950 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Explorar sagas
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/peliculas"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm text-neutral-400 transition-colors hover:text-neutral-100 focus:outline-none focus-visible:text-amber-500"
          >
            Ver catálogo completo
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <h2
          id="features-heading"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          ¿Qué encontrarás aquí?
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-neutral-900 bg-neutral-950/40 p-6 transition-colors hover:border-neutral-800"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
