import { ProseContent } from "@/components/prose-content";
import { memberBioParagraphs } from "@/lib/member-content";

export function MemberBio({ bio, name }: { bio: string; name: string }) {
  if (bio.includes("<")) {
    return <ProseContent html={bio} />;
  }

  const paragraphs = memberBioParagraphs(bio, name);
  if (paragraphs.length === 0) return null;

  return (
    <div className="space-y-4 sm:space-y-5">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
