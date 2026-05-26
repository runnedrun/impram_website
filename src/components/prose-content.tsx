import { sanitizeContent } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

export function ProseContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const safe = sanitizeContent(html);
  return (
    <div
      className={cn(
        "max-w-none space-y-4 text-base leading-relaxed text-muted-foreground sm:space-y-5 sm:text-lg [&_a]:text-impram-link [&_a]:no-underline hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-impram-section [&_h2:first-child]:mt-0 sm:[&_h2]:mt-12 sm:[&_h2]:mb-4 sm:[&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-impram-section sm:[&_h3]:mt-10 sm:[&_h3]:mb-3 sm:[&_h3]:text-2xl [&_img]:rounded-2xl [&_img]:shadow-sm [&_p+p]:mt-4 sm:[&_p+p]:mt-5 [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
