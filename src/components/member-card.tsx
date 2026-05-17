import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/db/schema";

export function MemberCard({ member }: { member: Member }) {
  return (
    <Link href={`/${member.slug}/`} className="group block text-center">
      <div className="relative mx-auto aspect-[370/492] w-full max-w-[280px] overflow-hidden bg-muted">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="280px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No photo
          </div>
        )}
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-limelight)] text-xl text-foreground group-hover:text-impram-link">
        {member.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
    </Link>
  );
}
