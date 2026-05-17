"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Show } from "@/lib/db/schema";
import { createShow, deleteShow, updateShow } from "@/lib/admin/actions";

export function ShowForm({ show }: { show?: Show }) {
  const [heroImageUrl, setHeroImageUrl] = useState(show?.heroImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const action = show ? updateShow.bind(null, show.slug) : createShow;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload/", { method: "POST", body: fd });
    const data = (await res.json()) as { url: string };
    setHeroImageUrl(data.url);
    setUploading(false);
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={show?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={show?.slug} placeholder="auto-from-title" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={show?.status ?? "current"}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="current">Currently playing</option>
          <option value="archived">Previous show</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featuredOnHome"
          name="featuredOnHome"
          defaultChecked={show?.featuredOnHome ?? !show}
          className="size-4 rounded border"
        />
        <Label htmlFor="featuredOnHome">Upcoming show on homepage</Label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="upcomingAt">Next performance date</Label>
          <Input
            id="upcomingAt"
            name="upcomingAt"
            type="date"
            defaultValue={show?.upcomingAt?.slice(0, 10) ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline (optional)</Label>
          <Input id="tagline" name="tagline" defaultValue={show?.tagline ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homeTeaser">Homepage teaser</Label>
        <Textarea
          id="homeTeaser"
          name="homeTeaser"
          rows={3}
          defaultValue={show?.homeTeaser ?? ""}
          placeholder="Short blurb shown on the homepage under the show title"
        />
      </div>

      <div className="space-y-2">
        <Label>Hero image</Label>
        <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        <Input
          name="heroImageUrl"
          value={heroImageUrl}
          onChange={(e) => setHeroImageUrl(e.target.value)}
        />
        <input type="hidden" name="cardImageUrl" value={heroImageUrl} readOnly />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">About the show</Label>
        <Textarea id="body" name="body" rows={12} defaultValue={show?.body} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" defaultValue={show?.price ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" defaultValue={show?.duration ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interval">Interval</Label>
          <Input id="interval" name="interval" defaultValue={show?.interval ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" name="venue" defaultValue={show?.venue ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input id="language" name="language" defaultValue={show?.language ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={show?.sortOrder ?? 0} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta description</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          rows={2}
          defaultValue={show?.metaDescription ?? ""}
        />
      </div>

      <input type="hidden" name="published" value="on" />

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{show ? "Save" : "Create show"}</Button>
        {show && (
          <>
            <Link
              href={`/shows/${show.slug}/`}
              target="_blank"
              className={buttonVariants({ variant: "outline" })}
            >
              Preview
            </Link>
            <Button type="button" variant="destructive" formAction={deleteShow.bind(null, show.slug)}>
              Delete
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
