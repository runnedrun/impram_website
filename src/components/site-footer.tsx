import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 text-foreground pb-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center">
        <Link
          href="/"
          className="flex items-center gap-3 text-muted-foreground transition-opacity hover:opacity-80"
        >
          <span className="relative block h-9 w-16 shrink-0 sm:h-10 sm:w-[4.5rem]">
            <Image
              src="/logo.png"
              alt="Impram"
              fill
              className="object-contain object-left"
              sizes="72px"
            />
          </span>
          <span className="text-base font-medium leading-snug">
            English Improv Group in Gothenburg
          </span>
        </Link>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <a
            href="https://www.facebook.com/ImpramImprov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[15px] font-medium text-foreground/80 transition-opacity hover:opacity-80"
            aria-label="Impram on Facebook: ImpramImprov"
          >
            <Image
              src="/social/facebook.png"
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-full"
            />
            <span>ImpramImprov</span>
          </a>
          <a
            href="https://www.instagram.com/impramgbg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[15px] font-medium text-foreground/80 transition-opacity hover:opacity-80"
            aria-label="Impram on Instagram: @IMPRAMGBG"
          >
            <Image
              src="/social/instagram.png"
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-lg"
            />
            <span>@IMPRAMGBG</span>
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-4 border-t border-border/60 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:gap-6">
          <p>© {new Date().getFullYear()} Impram. All rights reserved.</p>
          <div className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <Link href="/privacy-policy/" className="transition-colors hover:text-impram-link">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
