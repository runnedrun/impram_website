import { sectionTitleClass } from "@/lib/typography";
import type { OpenRehearsalDate } from "@/lib/db/schema";

const openRehearsalsIntro = [
  "Have you always dreamt about trying improv and never found the right time? Or are you already a seasoned and passionate improviser that would love an extra evening to play with fun folks?",
  "Our open rehearsal sessions are the opportunity for anyone to join one of Impram’s regular rehearsals. You get to do fun Improv activities and see what playing improv with us is like.",
  "Open session dates are announced in our social media and on this page as soon as they are planned.",
  "Are there no session dates posted right now? You can still contact us and let us know your interest and we will put you on our waiting list.",
  "If you wish to join a session, send us an email at impram.gothenburg@gmail.com to let us know your interest, we will get back to you about booking a spot.",
];

const recruitmentParagraphs = [
  "From time to time, Impram is open to recruitment of new members to the group. If you love improv, have some experience of it and would like to be in regular shows in English, then we would love to hear from you!",
  "Reach out to us by sending an email to impram.gothenburg@gmail.com.",
];

function SectionHeading({ children }: { children: string }) {
  return <h2 className={`${sectionTitleClass} text-3xl sm:text-4xl`}>{children}</h2>;
}

export function JoinUsContent({ dates }: { dates: OpenRehearsalDate[] }) {
  return (
    <div className="space-y-14">
      <section>
        <SectionHeading>Open rehearsals</SectionHeading>
        <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground">
          {openRehearsalsIntro.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div>
            <p className="font-bold text-foreground">Upcoming open sessions:</p>
            {dates.length > 0 ? (
              <ul className="mt-3 list-none space-y-2 pl-0">
                {dates.map((date) => (
                  <li key={date.id}>{date.label}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 italic">No dates scheduled at the moment.</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionHeading>Recruitment</SectionHeading>
        <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground">
          {recruitmentParagraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
