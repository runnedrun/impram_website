import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-impram-navy text-impram-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-limelight)] text-2xl">Impram</p>
          <p className="text-sm text-impram-cream/80">Improv in Gothenburg</p>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a
            href="https://www.facebook.com/impramgothenburg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-impram-cream transition-colors hover:text-impram-accent"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/impramgothenburg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-impram-cream transition-colors hover:text-impram-accent"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-impram-cream/70 sm:px-6">
        <p>
          © {new Date().getFullYear()} Impram.{" "}
          <Link href="/privacy-policy/" className="underline hover:text-impram-accent">
            Privacy policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
