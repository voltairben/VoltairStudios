// Real, user-authored content for the About page. Replaced the earlier
// full "This Is Voltair" essay wholesale — direct request: the essay
// was "way too long and too difficult to space out properly," and the
// user shortened it himself to these 3 paragraphs plus a short tools
// list, styled after segerman.dev's own About page (a big corner
// headline, a short bio, a small tools/meta cluster) rather than the
// earlier editorial 3-column spread. See AboutContent.tsx for how
// these map onto the new layout, and globals.css's own comment on
// .about-page for that layout's history.
//
// NL is a first-pass translation, same status as every other Dutch
// string on this site right now (see DESIGN.md / memory: the user is
// a native Dutch speaker and will review all NL copy himself once the
// site is done) — not the final word on it. Tool names are real
// product/brand names, left untranslated in both languages, same as
// every other proper noun already on this site.

export type AboutContentShape = {
  kicker: string;
  bio: string[];
  tools: string[];
};

export const ABOUT_CONTENT: Record<"en" | "nl", AboutContentShape> = {
  en: {
    kicker: "This Is Voltair, by Bennie",
    bio: [
      "I'm Bennie, the designer and developer behind Voltair Studio. I build custom websites that feel less like pages and more like places you can explore. Tactile, responsive, and fun to click around in.",
      "I care about websites that look good, feel smooth, and are satisfying to use. I like making small details matter, whether it's the way something moves, responds, or catches you off guard. The goal is simple: make digital experiences that people can feel.",
      "Voltair Studio is my own corner of the internet, built from a love of making things and seeing ideas come to life. If you have something worth building, let's make it a place people actually want to spend time in.",
    ],
    tools: ["Next.js", "Three.js", "React", "Tailwind CSS", "Supabase", "Resend", "Vercel"],
  },
  nl: {
    kicker: "Dit Is Voltair, door Bennie",
    bio: [
      "Ik ben Bennie, de designer en developer achter Voltair Studio. Ik bouw custom websites die minder aanvoelen als pagina's en meer als plekken die je kunt verkennen. Tactiel, responsief en leuk om doorheen te klikken.",
      "Ik hecht veel waarde aan websites die er goed uitzien, soepel aanvoelen en fijn zijn om te gebruiken. Ik vind het leuk om kleine details te laten opvallen, of het nou gaat om hoe iets beweegt, reageert, of je verrast. Het doel is simpel: digitale ervaringen maken die mensen kunnen voelen.",
      "Voltair Studio is mijn eigen hoekje van het internet, gebouwd vanuit een liefde voor het maken van dingen en het tot leven zien komen van ideeën. Heb je iets de moeite waard om te bouwen? Laten we er een plek van maken waar mensen ook echt willen zijn.",
    ],
    tools: ["Next.js", "Three.js", "React", "Tailwind CSS", "Supabase", "Resend", "Vercel"],
  },
};
