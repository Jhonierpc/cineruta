import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav
      aria-label="Paginación"
      className="mt-12 flex items-center justify-between gap-4"
    >
      <PageLink
        href={prevPage ? buildHref(basePath, prevPage) : null}
        rel="prev"
      >
        ← Anterior
      </PageLink>

      <p className="text-sm text-neutral-400" aria-live="polite">
        Página{" "}
        <span className="font-medium text-neutral-100">{currentPage}</span> de{" "}
        <span className="font-medium text-neutral-100">{totalPages}</span>
      </p>

      <PageLink
        href={nextPage ? buildHref(basePath, nextPage) : null}
        rel="next"
      >
        Siguiente →
      </PageLink>
    </nav>
  );
}

function buildHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

function PageLink({
  href,
  rel,
  children,
}: {
  href: string | null;
  rel: "prev" | "next";
  children: React.ReactNode;
}) {
  const baseClasses =
    "inline-flex items-center rounded-md border border-neutral-800 px-4 py-2 text-sm font-medium transition-colors";

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClasses} cursor-not-allowed text-neutral-700`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      rel={rel}
      className={`${baseClasses} text-neutral-200 hover:border-neutral-600 hover:text-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`}
    >
      {children}
    </Link>
  );
}
