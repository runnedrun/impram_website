import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon } from "@/components/social-icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 text-foreground pb-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
          <Link href="/" className="relative block h-12 w-28 shrink-0 sm:h-14 sm:w-32">
            <Image
              src="/logo.png"
              alt="Impram"
              fill
              className="object-contain object-center"
              sizes="128px"
            />
          </Link>
          <p className="text-center text-base font-medium text-muted-foreground md:text-left">
            English Improv in Gothenburg
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <a
            href="https://www.facebook.com/ImpramImprov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[15px] font-medium text-foreground/80 transition-colors hover:text-impram-link"
            aria-label="Impram on Facebook"
          >
            <FacebookIcon className="size-5 shrink-0" />
            <span>ImpramImprov</span>
          </a>
          <a
            href="https://www.instagram.com/impramgbg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[15px] font-medium text-foreground/80 transition-colors hover:text-impram-link"
            aria-label="Impram on Instagram"
          >
            <InstagramIcon className="size-5 shrink-0" />
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
