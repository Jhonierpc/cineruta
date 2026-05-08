export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">CineRuta</h1>
      <p className="max-w-xl text-lg text-neutral-400">
        Tu guía cronológica de sagas, franquicias y universos cinematográficos.
      </p>
      <p className="text-sm text-neutral-500">
        Estructura base lista. Próximo paso: definir rutas y conectar TMDB.
      </p>
    </main>
  );
}
