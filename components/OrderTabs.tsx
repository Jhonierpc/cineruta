import Link from "next/link";

export type ChronologyOrder = "narrative" | "release";

const TABS = [
  { key: "narrative" as const, label: "Cronológico" },
  { key: "release" as const, label: "Estreno" },
];

export function OrderTabs({
  slug,
  active,
}: {
  slug: string;
  active: ChronologyOrder;
}) {
  return (
    <nav
      aria-label="Tipo de orden"
      className="mt-10 inline-flex rounded-full border border-neutral-900 bg-neutral-950/40 p-1"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const href =
          tab.key === "narrative"
            ? `/sagas/${slug}`
            : `/sagas/${slug}?order=release`;
        return (
          <Link
            key={tab.key}
            href={href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={
              "rounded-full px-5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 " +
              (isActive
                ? "bg-amber-500 text-neutral-950"
                : "text-neutral-400 hover:text-neutral-100")
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
