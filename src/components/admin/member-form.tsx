"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Member } from "@/lib/db/schema";
import { createMember, deleteMember, updateMember } from "@/lib/admin/actions";

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : isNew ? "Create member" : "Save"}
    </Button>
  );
}

export function MemberForm({
  member,
  saved = false,
}: {
  member?: Member;
  saved?: boolean;
}) {
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const action = member ? updateMember.bind(null, member.slug) : createMember;

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
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={member?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL identifier</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={member?.slug}
            placeholder="e.g. xq-lu — auto-generated from name if left blank"
          />
          <p className="text-xs text-muted-foreground">
            The last part of the cast page URL, e.g. /xq-lu/
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" defaultValue={member?.role ?? "Improviser"} />
      </div>

      <ImageUploadField
        label="Photo"
        name="photoUrl"
        value={photoUrl}
        onChange={setPhotoUrl}
        aspectClassName="aspect-square max-w-[200px]"
        previewClassName="max-w-[200px]"
      />

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={8}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <input type="hidden" name="published" value="on" />

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton isNew={!member} />
        {member && (
          <>
            <Link
              href={`/${member.slug}/`}
              target="_blank"
              className={buttonVariants({ variant: "outline" })}
            >
              Preview
            </Link>
            <Button
              type="submit"
              variant="destructive"
              formAction={deleteMember.bind(null, member.slug)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
