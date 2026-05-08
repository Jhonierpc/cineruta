export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-900 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center">
        <p>
          © {year} CineRuta · Una guía cronológica del cine.
        </p>
        <p>
          Datos por{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-neutral-300 hover:underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
