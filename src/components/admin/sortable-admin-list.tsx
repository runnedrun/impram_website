"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortableItem = {
  slug: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
  editHref: string;
};

export function SortableAdminList({
  items: initialItems,
  onReorder,
}: {
  items: SortableItem[];
  onReorder: (orderedSlugs: string[]) => Promise<void>;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const itemsRef = useRef(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [pending, startTransition] = useTransition();

  itemsRef.current = items;

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function handleDragStart(index: number) {
    dragIndexRef.current = index;
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndexRef.current = index;
    setDragIndex(index);
  }

  function handleDragEnd() {
    if (dragIndexRef.current === null) return;
    dragIndexRef.current = null;
    setDragIndex(null);
    startTransition(async () => {
      await onReorder(itemsRef.current.map((r) => r.slug));
      router.refresh();
    });
  }

  return (
    <div className={cn("space-y-2", pending && "opacity-60")}>
      <p className="text-sm text-muted-foreground">
        Drag rows to change display order on the public site.
      </p>
      {items.map((item, index) => (
        <div
          key={item.slug}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={cn(
            "flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3",
            dragIndex === index && "border-impram-link ring-1 ring-impram-link/30",
          )}
        >
          <button
            type="button"
            className="flex shrink-0 cursor-grab items-center text-muted-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-5" />
          </button>
          <div className="min-w-0 flex-1 grid gap-0.5 sm:grid-cols-3 sm:gap-4">
            <span className="truncate font-medium">{item.primary}</span>
            {item.secondary && (
              <span className="truncate text-sm text-muted-foreground">
                {item.secondary}
              </span>
            )}
            {item.tertiary && (
              <span className="truncate text-sm text-muted-foreground">
                {item.tertiary}
              </span>
            )}
          </div>
          <Link
            href={item.editHref}
            className="shrink-0 text-sm text-impram-link hover:underline"
          >
            Edit
          </Link>
        </div>
      ))}
      {pending && (
        <p className="text-sm text-muted-foreground">Saving order…</p>
      )}
    </div>
  );
}
