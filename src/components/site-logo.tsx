import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src="/logo.png"
      alt="Impram"
      className={cn("h-full w-full object-contain object-left", className)}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
