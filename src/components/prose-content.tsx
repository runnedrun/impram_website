import { sanitizeContent } from "@/lib/sanitize";

export function ProseContent({ html }: { html: string }) {
  const safe = sanitizeContent(html);
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-[family-name:var(--font-limelight)] prose-headings:font-normal prose-headings:text-impram-navy prose-a:text-impram-link prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-sm"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
