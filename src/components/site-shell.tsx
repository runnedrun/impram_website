export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12 md:py-16 lg:py-20">
      {children}
    </div>
  );
}
