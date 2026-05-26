"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { ShowCastPicker } from "@/components/admin/show-cast-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Member, Show } from "@/lib/db/schema";
import type { ShowCastCredit } from "@/lib/show-content";
import { createShow, deleteShow, updateShow } from "@/lib/admin/actions";

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : isNew ? "Create show" : "Save"}
    </Button>
  );
}

export function ShowForm({
  show,
  members,
  saved = false,
}: {
  show?: Show;
  members: Member[];
  saved?: boolean;
}) {
  const [heroImageUrl, setHeroImageUrl] = useState(show?.heroImageUrl ?? "");
  const action = show ? updateShow.bind(null, show.slug) : createShow;
  const castCredits = (show?.castCredits ?? []) as ShowCastCredit[];

  return (
    <form action={action} className="space-y-6">
      {saved && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800"
        >
          Changes saved.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={show?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL identifier</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={show?.slug}
            placeholder="e.g. fairytales — auto-generated from title if left blank"
          />
          <p className="text-xs text-muted-foreground">
            The last part of the show URL, e.g. /shows/fairytales/
          </p>
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
          placeholder="Short blurb shown on the homepage under the show title. Press Enter for a new line."
        />
      </div>

      <ImageUploadField
        label="Hero image"
        name="heroImageUrl"
        value={heroImageUrl}
        onChange={setHeroImageUrl}
        hiddenName="cardImageUrl"
        aspectClassName="aspect-[21/9]"
      />

      <div className="space-y-2">
        <Label htmlFor="aboutText">About the show</Label>
        <Textarea
          id="aboutText"
          name="aboutText"
          rows={8}
          defaultValue={show?.aboutText ?? ""}
          placeholder="Plain text only. Use a blank line between paragraphs."
        />
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <h2 className="text-lg font-semibold">Upcoming performance</h2>
        <div className="space-y-2">
          <Label htmlFor="performanceSummary">Date and time summary</Label>
          <Textarea
            id="performanceSummary"
            name="performanceSummary"
            rows={2}
            defaultValue={show?.performanceSummary ?? ""}
            placeholder="Sunday, May 10th, doors open at 11:00AM, show starts at 11:45AM"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ticketUrl">Ticket URL</Label>
          <Input
            id="ticketUrl"
            name="ticketUrl"
            type="url"
            defaultValue={show?.ticketUrl ?? ""}
            placeholder="https://..."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Ticket price</Label>
            <Textarea
              id="price"
              name="price"
              rows={2}
              defaultValue={show?.price ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Schedule</Label>
            <Textarea
              id="duration"
              name="duration"
              rows={2}
              defaultValue={show?.duration ?? ""}
              placeholder={"Doors open at 11:00.\nShow runs 12:00–13:00."}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" defaultValue={show?.venue ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              name="language"
              defaultValue={show?.language ?? ""}
              placeholder="English"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval">Interval</Label>
            <Input id="interval" name="interval" defaultValue={show?.interval ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatingNote">Seating note</Label>
            <Input
              id="seatingNote"
              name="seatingNote"
              defaultValue={show?.seatingNote ?? ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventNotes">Extra details</Label>
          <Textarea
            id="eventNotes"
            name="eventNotes"
            rows={3}
            defaultValue={show?.eventNotes ?? ""}
            placeholder="One detail per line, e.g. brunch add-on info"
          />
        </div>
      </div>

      <ShowCastPicker members={members} initialCredits={castCredits} />

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

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton isNew={!show} />
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
