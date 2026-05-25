import { sanitizeContent } from "@/lib/sanitize";

export function ProseContent({ html }: { html: string }) {
  const safe = sanitizeContent(html);
  return (
    <div
      className="max-w-none space-y-5 text-lg leading-relaxed text-muted-foreground [&_a]:text-impram-link [&_a]:no-underline hover:[&_a]:underline [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-impram-section [&_h2:first-child]:mt-0 [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-impram-section [&_img]:rounded-2xl [&_img]:shadow-sm [&_p+p]:mt-5 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
