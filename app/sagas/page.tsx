import type { Metadata } from "next";
import { SagaCard } from "@/components/SagaCard";
import { getAllSagas } from "@/lib/chronologies/loader";

export const metadata: Metadata = {
  title: "Sagas — CineRuta",
  description:
    "Cronologías curadas de las grandes franquicias y universos del cine.",
};

export default async function SagasPage() {
  const sagas = await getAllSagas();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
          Cronologías curadas
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Sagas
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-400">
          Encuentra el orden cronológico narrativo y de estreno de cada saga.
          Datos revisados manualmente.
        </p>
      </header>

      {sagas.length === 0 ? (
        <p className="mt-16 text-neutral-500">
          Aún no hay sagas curadas. Pronto agregaremos las primeras.
        </p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sagas.map((saga) => (
            <li key={saga.slug}>
              <SagaCard saga={saga} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
