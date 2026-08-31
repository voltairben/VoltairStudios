// Single source of truth for the project set — ProjectReel, ProjectIndex,
// and /work/[slug] all read from this instead of each independently
// generating a project list, so the tiles, the index list, and the
// actual link destinations can never drift out of sync.

export type Project = {
  slug: string;
  name: string;
  /** Live site link — when present, the case-study page shows it in
   *  place of the generic "in progress" placeholder text. Optional:
   *  most slots are still placeholders (PRODUCT.md — nothing fabricated
   *  in their place) until real projects exist for them. */
  url?: string;
  /** Real screenshots of the live site's actual sections/pages — never
   *  stock or invented imagery, and never a fabricated "Dashboard" or
   *  "Settings" screen for a site that has no such thing (see
   *  DESIGN.md). `label` is that real section's own real name. Absent
   *  for every placeholder slot; the viewer shows a clearly-labeled
   *  empty state instead. */
  mockups?: { label: string; src: string }[];
  /** Real thumbnail for this project's tile in ProjectReel/ProjectIndex —
   *  a different slot from `mockups` above, which is the case-study
   *  page's own carousel. Absent for every placeholder slot; the tile
   *  shows the diagonal "content goes here" glass pattern instead (see
   *  PRODUCT.md — nothing fabricated in its place). */
  image?: string;
  year?: string;
  role?: string;
  /** EN/NL, rendered via <Localized> — real per-project content, not a
   *  shared UI string, so it doesn't live in data/i18n.ts's dictionary.
   *  A job-title-style `role` above stays a single plain string on
   *  purpose (matching how project *names* also aren't translated). */
  description?: { en: string; nl: string };
};

const PLACEHOLDER_COUNT = 6;

export const PROJECTS: Project[] = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
  slug: `placeholder-${i + 1}`,
  name: `Placeholder ${i + 1}`,
}));

// First real project — direct request, replaces slot 1.
PROJECTS[0] = {
  slug: "krachtig-fit",
  name: "KrachtigFit",
  url: "https://krachtig-fit-two.vercel.app/",
  // Reel/index tile thumbnail — a real photo of Sander (the trainer),
  // not a site screenshot. Direct request: goes on the tile itself,
  // not in the case-study mockups carousel below.
  image: "/photos/krachtig-fit-sander.jpg",
  // 5 real screenshots of the live site's own real sections/pages —
  // captured directly, not invented. KrachtigFit is a single-page
  // coaching site (checked its real nav/routes directly, no SaaS
  // dashboard exists), so these are real anchors + one real route
  // (/kennismaking) instead of the generic "Dashboard/Settings/
  // Pricing" a request asked for — see DESIGN.md. Curated by actually
  // reviewing the whole page (a full scroll-through, not just following
  // nav anchors mechanically) and picking the 5 that read best, in a
  // deliberate order: intro, who's behind it, proof, what you get, how
  // to start.
  mockups: [
    { label: "Home", src: "/mockups/krachtig-fit.png" },
    { label: "Over mij", src: "/mockups/krachtig-fit-about.png" },
    { label: "Klanten resultaten", src: "/mockups/krachtig-fit-results.png" },
    { label: "Programma's", src: "/mockups/krachtig-fit-programs.png" },
    { label: "Kennismaking", src: "/mockups/krachtig-fit-kennismaking.png" },
  ],
  // Direct request — the first real value provided for this field.
  // role still intentionally left unset: not fabricating metadata that
  // hasn't actually been provided.
  year: "2026",
  // Direct follow-up request, matching SOL_DNB's own description style
  // once that one shipped — re-checked the real site before writing
  // this rather than working from memory of the mockup labels above:
  // the three real program tracks (strength/nutrition/combined),
  // weekly check-ins, and the real free "kennismaking" entry point.
  // Left out the site's own "500+ clients" claim — that's a stat,
  // exactly the kind of proof PRODUCT.md says not to assert without it
  // being independently verified, not a structural fact about what the
  // service offers the way the other three details are.
  description: {
    en: "A coaching site for a personal trainer in Herten — flexible strength and nutrition programs built around your schedule, weekly check-ins, and a free intro consultation to start.",
    nl: "Een coachingsite voor een personal trainer in Herten — flexibele kracht- en voedingsprogramma's die om je schema heen passen, wekelijkse check-ins, en een gratis kennismaking om te starten.",
  },
};

// Second real project — replaces slot 2. Verified live before writing
// anything: soldnb.com is a real, live site whose own footer credits
// "designed by VOLTAIR_STUDIO" — a genuinely different situation from
// an earlier request this project declined (5 fabricated client names,
// including one for this exact slot) — this one checked out as real,
// not fabricated, so it was built rather than declined. Every feature
// named below (Kick/Twitch monitoring, the session-gated request
// queue, the synth waveform module) was independently confirmed on the
// real page, not taken on faith from the request describing them.
PROJECTS[1] = {
  slug: "soldnb",
  name: "SOL_DNB // terminal club",
  url: "https://soldnb.com",
  // Reel/index tile — a real photo of Sol (the artist), direct request
  // to swap in for the site-hero screenshot this shipped with first.
  // Same "real photo, not a screenshot" choice krachtig-fit-sander.jpg
  // already made for its own tile — not a special case invented here.
  image: "/photos/soldnb-sol.jpeg",
  // 4 real screenshots — direct follow-up replacing an earlier 5 that
  // were all cropped mid-scroll off the homepage; these are clean,
  // full-viewport captures of 4 actually distinct real destinations —
  // the homepage hero, the two real sub-routes (/about, /schedule) the
  // first pass never visited, and the socials panel — same real
  // full-viewport technique krachtig-fit.png's own mockups used.
  mockups: [
    { label: "Hero", src: "/mockups/soldnb-hero.png" },
    { label: "About", src: "/mockups/soldnb-about.png" },
    { label: "Schedule", src: "/mockups/soldnb-schedule.png" },
    { label: "Links.Socials", src: "/mockups/soldnb-socials.png" },
  ],
  year: "2026", // confirmed independently via the site's own footer
    // copyright line ("© 2026 PROJECT_SOL"), not just taken from the request
  role: "Creative Frontend Developer",
  description: {
    en: "A terminal-styled console for a drum & bass streamer — live Kick/Twitch status, a session-gated track request queue, and a real-time synth waveform display.",
    // First-pass NL, same as every other translated string on this
    // site right now — see DESIGN.md/memory: the user is a native
    // Dutch speaker and will review all Dutch copy himself once the
    // whole site is done, this isn't meant to be the final word on it.
    nl: "Een console in terminal-stijl voor een drum & bass-streamer — live Kick/Twitch-status, een sessiegebonden verzoeklijst voor tracks, en een real-time synth-waveformweergave.",
  },
};

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
