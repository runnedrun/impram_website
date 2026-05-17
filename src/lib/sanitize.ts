import sanitizeHtml from "sanitize-html";

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  "img",
  "h1",
  "h2",
  "h3",
  "h4",
  "figure",
  "figcaption",
];

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      a: ["href", "name", "target", "rel"],
    },
  });
}
