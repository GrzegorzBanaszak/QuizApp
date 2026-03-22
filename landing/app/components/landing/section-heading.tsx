export function SectionHeading({
  title,
  highlight,
  description,
  centered = false,
}: {
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "space-y-4 text-center" : "space-y-4"}>
      <h2 className="font-headline text-4xl font-black tracking-[-0.03em] text-on-surface md:text-6xl">
        {title}{" "}
        {highlight ? (
          <span className={highlight.includes("!") ? "text-gradient" : "text-tertiary"}>
            {highlight}
          </span>
        ) : null}
      </h2>
      {description ? (
        <p
          className={
            centered
              ? "mx-auto max-w-3xl text-lg leading-relaxed text-on-surface-variant"
              : "max-w-2xl text-lg leading-relaxed text-on-surface-variant"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
