import Image from "next/image";
import Link from "next/link";
import { sectionTitleClass } from "@/lib/typography";

const impramParagraphs = [
  "Impram started in Gothenburg in 2015. We were founded by a group of international friends from all over the world who shared a love for fun, laughter, and improv theater. As expats living in Sweden, they realized the best way to enjoy great English-language entertainment was to create it themselves!",
  "Over the years, Impram has become a welcoming home for a wonderful, diverse community. Whether you want to watch our shows, perform on stage, or just join our open workshops, there is a place for everyone here. We are all about openness, playfulness, and pure joy.",
  "Today, we perform regular comedy and theater shows using both quick improv games and longer, improvised stories. We also host friendly open practice sessions where absolutely anyone can come try out improv alongside our team. Check out our \"Join Us\" page for more details. There is always something fun waiting for you!",
];

const improvParagraph =
  "Improv (short for improvised theater) is a type of performance where nothing is planned in advance. The performers do not have a script or rehearsed lines. Instead, we use our creativity and teamwork to make up all the characters, jokes, and stories right on the spot in front of the audience. Because everything happens in real-time, every single show is completely unique, surprising, and unpredictable!";

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
        <SectionHeading>About Impram</SectionHeading>
        <SectionBody>
          {impramParagraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </SectionBody>
      </section>

      <section>
        <SectionHeading>What is Improv?</SectionHeading>
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
