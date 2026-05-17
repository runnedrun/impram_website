"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Member } from "@/lib/db/schema";
import { createMember, deleteMember, updateMember } from "@/lib/admin/actions";

export function MemberForm({ member }: { member?: Member }) {
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const action = member ? updateMember.bind(null, member.slug) : createMember;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload/", { method: "POST", body: fd });
    const data = (await res.json()) as { url: string };
    setPhotoUrl(data.url);
    setUploading(false);
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={member?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={member?.slug} placeholder="auto-from-name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" defaultValue={member?.role ?? "Improviser"} />
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        <Input name="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={8} defaultValue={member?.bio} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={member?.sortOrder ?? 0} />
      </div>

      <input type="hidden" name="published" value="on" />

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{member ? "Save" : "Create member"}</Button>
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
