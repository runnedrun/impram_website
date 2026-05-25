export const groupIntro =
  "We are Impram, an English Improv group based in Gothenburg!";

export const groupIntroParagraphs = [
  "We are Impram, an English Improv group based in Gothenburg!",
  "Our group members come from all across the globe, brought together by our shared love for creating pure joy, fun, and laughter.",
  "Everything we do on stage is completely unscripted. we make up all the characters, jokes, and stories right on the spot. No two shows are ever the same, meaning every performance is a completely unique experience for the audience.",
  "We also run regular open practice sessions where absolutely anyone can come try out improv with our team!",
] as const;

export const aboutUsBody = `
<h2>Impram</h2>
<p>Impram was established in Gothenburg in 2015 by a group of people from across the globe united by a love for improv and fun-loving spirit. As expats, they recognized that the best way to find good entertainment in English would be to create it themselves.</p>
<p>Over the years, Impram have been the home of a diverse community of people. Whether as audience members, improv players or participants in our open sessions and try-out events, we have a place for everyone who enjoys our values of openness, playfulness, and joy.</p>
<p>Today the group regularly stages longform and shortform improv shows. Additionally, we arrange open sessions where newcomers can come and try out playing improv alongside the members of the group. Our calendar always has something for you to enjoy.</p>
<h2>What is improv?</h2>
<p>Improvised theater, usually referred to as improv, is a performing art where actors spontaneously create scenes, characters, and dialogue without a script. Instead of relying on predetermined lines or plots, improvisers use creativity and collaboration to explore stories and scenes in real-time. This makes each performance entirely unique and unpredictable.</p>
<div class="not-prose mt-12 grid gap-6 sm:grid-cols-2">
  <a href="/cast/" class="group block overflow-hidden rounded-2xl border border-border bg-muted/30 transition-colors hover:bg-muted/50">
    <img src="https://impram.net/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-20.00.34-768x768.jpeg" alt="Impram cast" class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" width="768" height="768" />
    <p class="p-4 text-center font-[family-name:var(--font-limelight)] text-xl text-impram-title">Our cast</p>
  </a>
  <a href="/shows/" class="group block overflow-hidden rounded-2xl border border-border bg-muted/30 transition-colors hover:bg-muted/50">
    <img src="https://impram.net/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-23-at-20.04.04-768x768.jpeg" alt="Impram shows" class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" width="768" height="768" />
    <p class="p-4 text-center font-[family-name:var(--font-limelight)] text-xl text-impram-title">Our shows</p>
  </a>
</div>
`.trim();
