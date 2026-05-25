export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="relative left-1/2 mb-12 w-screen max-w-[100vw] -translate-x-1/2 bg-impram-title py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-[family-name:var(--font-limelight)] text-5xl font-normal text-white sm:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 text-xl text-white/90">{subtitle}</p>}
      </div>
    </header>
  );
}
