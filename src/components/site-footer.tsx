import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 text-foreground pb-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 py-12 md:flex-row sm:px-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="font-[family-name:var(--font-limelight)] text-3xl text-impram-navy mb-1">Impram</p>
          <p className="text-base text-muted-foreground">Improv in Gothenburg</p>
        </div>
        <div className="flex items-center gap-8 text-[15px] font-medium">
          <a
            href="https://www.facebook.com/impramgothenburg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 transition-colors hover:text-impram-link"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/impramgothenburg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 transition-colors hover:text-impram-link"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-border/60 py-6 text-center text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <p>© {new Date().getFullYear()} Impram. All rights reserved.</p>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-border"></div>
          <Link href="/privacy-policy/" className="transition-colors hover:text-impram-link">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
