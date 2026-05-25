export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-12 border-b border-border/60 pb-10">
      <h1 className="font-[family-name:var(--font-limelight)] text-5xl text-impram-navy sm:text-6xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 text-xl text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
