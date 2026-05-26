import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/db/schema";
import { sectionTitleClass } from "@/lib/typography";

export function MemberCard({ member }: { member: Member }) {
  return (
    <Link href={`/${member.slug}/`} className="group flex h-full flex-col items-center text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[96px] overflow-hidden rounded-xl bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md sm:max-w-[280px] sm:aspect-[370/492] sm:rounded-2xl">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 33vw, 280px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-xs text-muted-foreground sm:text-sm">
            No photo
          </div>
        )}
      </div>
      <div className="mt-3 w-full sm:mt-5">
        <h3 className={`${sectionTitleClass} text-xs leading-snug transition-colors group-hover:text-impram-link sm:text-xl`}>
          {member.name}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-muted-foreground sm:mt-1 sm:text-sm">
          {member.role}
        </p>
      </div>
    </Link>
  );
}
