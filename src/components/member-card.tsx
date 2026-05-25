import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/db/schema";

export function MemberCard({ member }: { member: Member }) {
  return (
    <Link href={`/${member.slug}/`} className="group block text-center">
      <div className="relative mx-auto aspect-[370/492] w-full max-w-[280px] overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
            No photo
          </div>
        )}
      </div>
      <div className="mt-5">
        <h3 className="font-[family-name:var(--font-limelight)] text-xl text-foreground transition-colors group-hover:text-impram-link">
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{member.role}</p>
      </div>
    </Link>
  );
}
