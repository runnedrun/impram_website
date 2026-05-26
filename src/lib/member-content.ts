import { aboutParagraphs } from "@/lib/show-content";

const SHOW_CREDIT_TAIL =
  /\s+(?:Summertime|Fragments|The Impram [Ss]how|The Ever After|Marriage of Genres|A Night of Improv|Impram(?: &amp;| &)? Friends|Hats Off!|Playlist|Utopia|Oh No! Oh Yes!|The Island|Passing Through|The Family Tree|Human Condition|Improv Match|The Fika|The Living Room|Global Stage|Oh No!)\b[\s\S]*$/i;

const PARAGRAPH_BREAKS = [
  /(?<=\.)\s+(?=In the summer of \d{4})/i,
  /(?<=\.)\s+(?=After more than)/i,
  /(?<=\.)\s+(?=When (?:not|he|she|they|she's|he's|I))/i,
  /(?<=\.)\s+(?=Some of (?:her|his|their) favorite)/i,
  /(?<=\.)\s+(?=She also has)/i,
  /(?<=\.)\s+(?=He particularly loves)/i,
  /(?<=\.)\s+(?=He strongly believes)/i,
  /(?<=\.)\s+(?=She strongly believes)/i,
  /(?<=\.)\s+(?=He has a penchant)/i,
  /(?<=\.)\s+(?=He believes that)/i,
  /(?<=\.)\s+(?=While in Chicago)/i,
  /(?<=\.)\s+(?=(?:Stefan|Louis|Christofer|Tomas|Lisa|XQ) joined)/i,
  /(?<=\.)\s+(?=Tomas is part of)/i,
  /(?<=\.)\s+(?=He was one of)/i,
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function cleanMemberBio(bio: string, name: string): string {
  let text = bio.replace(/&amp;/g, "&").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  text = text.replace(/^Meet our cast\s+/i, "");

  const namePattern = new RegExp(`^${escapeRegExp(name)}\\s+`, "i");
  text = text.replace(namePattern, "");

  const firstName = name.split(/\s+/)[0];
  if (firstName.length > 1) {
    const duplicateName = new RegExp(`^(${escapeRegExp(firstName)})\\s+\\1(?=\\s)`, "i");
    text = text.replace(duplicateName, "$1");
  }

  text = text.replace(SHOW_CREDIT_TAIL, "").trim();
  return text;
}

export function memberBioParagraphs(bio: string, name: string): string[] {
  const cleaned = cleanMemberBio(bio, name);
  if (!cleaned) return [];

  if (cleaned.includes("\n")) {
    return aboutParagraphs(cleaned);
  }

  let formatted = cleaned;
  for (const pattern of PARAGRAPH_BREAKS) {
    formatted = formatted.replace(pattern, "\n\n");
  }

  const paragraphs = aboutParagraphs(formatted);
  if (paragraphs.length > 1) return paragraphs;

  const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [cleaned];
  if (sentences.length <= 3) return [cleaned];

  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(" "));
  }
  return chunks;
}
