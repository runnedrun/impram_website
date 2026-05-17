import { sanitizeContent } from "@/lib/sanitize";

export function ProseContent({ html }: { html: string }) {
  const safe = sanitizeContent(html);
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-[family-name:var(--font-limelight)] prose-headings:font-normal prose-a:text-impram-link"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
