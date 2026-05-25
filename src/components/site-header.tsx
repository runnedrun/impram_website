"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/about-us/", label: "About us" },
  { href: "/shows/", label: "Shows" },
  { href: "/cast/", label: "Cast" },
  { href: "/join-us/", label: "Join us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="relative block h-12 w-44 shrink-0 overflow-hidden rounded-md bg-white sm:h-14 sm:w-52">
            <Image
              src="/logo.png"
              alt="Impram"
              fill
              className="object-contain object-left"
              priority
              sizes="(max-width: 640px) 176px, 208px"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-foreground/80 transition-colors hover:text-impram-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </Button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-impram-navy text-impram-cream md:hidden">
          <div className="flex items-center justify-end p-6">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="text-impram-cream hover:bg-white/10 hover:text-impram-accent"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-8" />
            </Button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-[family-name:var(--font-limelight)] text-4xl tracking-wide transition-colors hover:text-impram-accent sm:text-5xl"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="pb-10 text-center text-sm text-impram-cream/80">
            Improv in Gothenburg
          </p>
        </div>
      )}
    </>
  );
}
