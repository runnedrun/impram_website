import { ProseContent } from "@/components/prose-content";
import { aboutParagraphs } from "@/lib/show-content";

export function MemberBio({ bio }: { bio: string }) {
  if (bio.includes("<")) {
    return <ProseContent html={bio} />;
  }

  const paragraphs = aboutParagraphs(bio.trim());
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
