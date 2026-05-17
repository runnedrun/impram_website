export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-10 border-b border-border pb-8">
      <h1 className="font-[family-name:var(--font-limelight)] text-4xl text-impram-navy sm:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
