import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../src/lib/load-env";
import { db } from "../src/lib/db";
import { members, sitePages } from "../src/lib/db/schema";
import { aboutUsBody } from "../src/lib/site-copy";

loadEnvFiles();

async function main() {
  const photoPath = join(process.cwd(), "public", "cast", "xq-lu.jpg");
  const buffer = readFileSync(photoPath);
  let photoUrl = "/cast/xq-lu.jpg";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put("members/xq-lu.jpg", buffer, {
      access: "public",
      contentType: "image/jpeg",
    });
    photoUrl = blob.url;
    console.log("Uploaded XQ Lu photo to Blob:", photoUrl);
  }

  await db.update(members).set({ photoUrl }).where(eq(members.slug, "xq-lu"));
  console.log("Updated XQ Lu member photo");

  await db
    .update(sitePages)
    .set({ body: aboutUsBody })
    .where(eq(sitePages.slug, "about-us"));
  console.log("Updated About us page body");
}

main();
