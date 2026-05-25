import Image from "next/image";
import Link from "next/link";
import { sectionTitleClass } from "@/lib/typography";

const impramParagraphs = [
  "Impram was established in Gothenburg in 2015 by a group of people from across the globe united by a love for improv and fun-loving spirit. As expats, they recognized that the best way to find good entertainment in English would be to create it themselves.",
  "Over the years, Impram have been the home of a diverse community of people. Whether as audience members, improv players or participants in our open sessions and try-out events, we have a place for everyone who enjoys our values of openness, playfulness, and joy.",
  "Today the group regularly stages longform and shortform improv shows. Additionally, we arrange open sessions where newcomers can come and try out playing improv alongside the members of the group. Our calendar always has something for you to enjoy.",
];

const improvParagraph =
  "Improvised theater, usually referred to as improv, is a performing art where actors spontaneously create scenes, characters, and dialogue without a script. Instead of relying on predetermined lines or plots, improvisers use creativity and collaboration to explore stories and scenes in real-time. This makes each performance entirely unique and unpredictable.";

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className={`${sectionTitleClass} text-3xl sm:text-4xl`}>
      {children}
    </h2>
  );
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground">{children}</div>;
}

export function AboutUsContent() {
  return (
    <div className="space-y-14">
      <section>
        <SectionHeading>Impram</SectionHeading>
        <SectionBody>
          {impramParagraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </SectionBody>
      </section>

      <section>
        <SectionHeading>What is improv?</SectionHeading>
        <SectionBody>
          <p>{improvParagraph}</p>
        </SectionBody>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/cast/"
          className="group overflow-hidden rounded-2xl border border-border bg-muted/30 transition-colors hover:bg-muted/50"
        >
          <div className="relative aspect-square w-full">
            <Image
              src="https://impram.net/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-20.00.34-768x768.jpeg"
              alt="Impram cast"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <p className={`p-4 text-center text-xl ${sectionTitleClass}`}>
            Our cast
          </p>
        </Link>
        <Link
          href="/shows/"
          className="group overflow-hidden rounded-2xl border border-border bg-muted/30 transition-colors hover:bg-muted/50"
        >
          <div className="relative aspect-square w-full">
            <Image
              src="https://impram.net/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-20.04.04-768x768.jpeg"
              alt="Impram shows"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          <p className={`p-4 text-center text-xl ${sectionTitleClass}`}>
            Our shows
          </p>
        </Link>
      </section>
    </div>
  );
}
