import Image from "next/image";

export function MoviePoster({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  return (
    <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-900 sm:w-32">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 640px) 128px, 96px"
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-3xl text-neutral-700"
          aria-hidden="true"
        >
          ▢
        </div>
      )}
    </div>
  );
}
