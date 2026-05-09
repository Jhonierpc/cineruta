import Link from "next/link";

import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/sagas", label: "Sagas" },
  { href: "/peliculas", label: "Películas" },
  { href: "/series", label: "Series" },
  { href: "/actores", label: "Actores" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-sm"
        >
          <span aria-hidden="true" className="text-amber-500">
            ◉
          </span>
          <span>CineRuta</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm text-neutral-400">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-neutral-50 focus:outline-none focus-visible:text-amber-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
