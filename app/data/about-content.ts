// Real, user-authored content — the full "This Is Voltair" essay,
// dropped in as a .txt file (This Is Voltair/This Is Voltair by
// Bennie.txt) with a direct request to put it on the About page. Light
// copy-editing only (a few typos/apostrophes, one added dash for a
// pause the surrounding sentences already use that shape for) — the
// actual content, structure, and voice are the user's own, not
// invented or rewritten here. Structured (not one long string) so
// AboutContent.tsx can give each real heading level its own color per
// direct request ("each head piece of the text in the correct
// colour"), matching this system's established amber-bright-for-
// headings / cursor-flash-for-body hierarchy rather than flattening
// the whole essay into a single paragraph tag.
//
// NL is a first-pass translation, same status as every other Dutch
// string on this site right now (see DESIGN.md / memory: the user is
// a native Dutch speaker and will review all NL copy himself once the
// site is done) — not the final word on it.

export type AboutContentShape = {
  kicker: string;
  lead: string[];
  philosophyTitle: string;
  philosophyIntro: string;
  subsections: { title: string; body: string }[];
  outroTitle: string;
  outroParagraphs: string[];
  closing: string;
};

export const ABOUT_CONTENT: Record<"en" | "nl", AboutContentShape> = {
  en: {
    kicker: "This Is Voltair — by Bennie",
    lead: [
      "I run Voltair Studios — a creative space where I build custom things for the web. To put it simply: I make websites that feel like real, physical objects.",
      "I don't do standard, boring, corporate templates. You know the ones — where every company looks exactly the same, with the same dry text, flat grids, and lifeless layouts. I think the internet should be way more fun, interactive, and alive than that.",
      "I build digital playrooms. Spaces where you can click, drag, explore, and actually feel like you're interacting with something solid and tactile under your fingertips.",
    ],
    philosophyTitle: "My Philosophy: Craft Over Copy-Pasting",
    philosophyIntro:
      "I have a deep love for old-school terminal screens, clean typography, and snappy movements. If something is on the screen, it needs to have a purpose. No useless clutter.",
    subsections: [
      {
        title: "The Power of Simplicity",
        body: "I lock my designs into a single, clean font. It forces me to make the layout itself beautiful, rather than hiding behind flashy, unnecessary decorations.",
      },
      {
        title: "A Web You Can Feel",
        body: "By using smooth animations and subtle sound effects (like the physical click of a keyboard), I want my websites to feel like premium, hand-crafted hardware.",
      },
      {
        title: "Snappy Momentum",
        body: "I am obsessed with movement and pacing. A great website should feel fluid, fast, and responsive — like a physical object in motion. I bring that same snappy, energetic momentum into every interaction and line of code I write.",
      },
    ],
    outroTitle: "The Human Outro",
    outroParagraphs: [
      "When I'm not coding or tweaking pixels, you can usually find me in the gym — I like to work out a lot and live a healthy lifestyle. I like building Lego and walking in nature. I'm also a gamer who likes MMO games, which I've spent a long time playing.",
      "My love for building sites and becoming a web developer comes from the creativity it uses and the freedom you have building and designing them. It's honestly the most fun I've had in years.",
      "At the end of the day, I built this space because I got bored of seeing the same copy-paste websites everywhere. Most of the internet looks exactly the same now, and I wanted a place where I actually enjoy clicking around. This is basically my personal digital workshop — it has its quirks, and I'm constantly tweaking things, but it's mine.",
    ],
    closing:
      "So go ahead: mess around with the terminal, switch up the colors, or see what you can break. And if you have an idea for something that actually stands out from the crowd, let's build it.",
  },
  nl: {
    kicker: "Dit Is Voltair — door Bennie",
    lead: [
      "Ik run Voltair Studios — een creatieve ruimte waar ik custom dingen bouw voor het web. Simpel gezegd: ik maak websites die aanvoelen als echte, fysieke objecten.",
      "Ik doe niet aan standaard, saaie, corporate templates. Je kent ze wel — waar elk bedrijf er precies hetzelfde uitziet, met dezelfde droge tekst, platte grids en levenloze layouts. Ik vind dat het internet veel leuker, interactiever en levendiger zou moeten zijn dan dat.",
      "Ik bouw digitale speelkamers. Ruimtes waar je kunt klikken, slepen, verkennen, en echt het gevoel hebt dat je met iets solides en tastbaars onder je vingers werkt.",
    ],
    philosophyTitle: "Mijn Filosofie: Vakmanschap Boven Copy-Pasten",
    philosophyIntro:
      "Ik heb een diepe liefde voor old-school terminalschermen, strakke typografie en snelle, doelgerichte beweging. Als iets op het scherm staat, moet het een doel hebben. Geen nutteloze rommel.",
    subsections: [
      {
        title: "De Kracht van Eenvoud",
        body: "Ik hou mijn designs vast aan één strak lettertype. Dat dwingt me om de layout zelf mooi te maken, in plaats van te verschuilen achter opzichtige, onnodige versieringen.",
      },
      {
        title: "Een Web Dat Je Kunt Voelen",
        body: "Door vloeiende animaties en subtiele geluidseffecten te gebruiken (zoals de fysieke klik van een toetsenbord), wil ik dat mijn websites aanvoelen als premium, handgemaakte hardware.",
      },
      {
        title: "Snelheid en Momentum",
        body: "Ik ben geobsedeerd door beweging en tempo. Een goede website moet vloeiend, snel en responsief aanvoelen — als een fysiek object in beweging. Ik breng diezelfde strakke, energieke momentum in elke interactie en elke regel code die ik schrijf.",
      },
    ],
    outroTitle: "Het Menselijke Verhaal",
    outroParagraphs: [
      "Als ik niet aan het coderen ben of pixels aan het bijschaven ben, vind je me meestal in de sportschool — ik train graag veel en leef een gezonde levensstijl. Ik bouw graag met Lego en wandel graag in de natuur. Ik ben ook een gamer die van MMO's houdt, waar ik al veel tijd in heb gestoken.",
      "Mijn liefde voor het bouwen van sites en het worden van webontwikkelaar komt voort uit de creativiteit die het vraagt en de vrijheid die je hebt bij het bouwen en ontwerpen ervan. Het is eerlijk gezegd het leukste wat ik in jaren heb gedaan.",
      "Uiteindelijk heb ik deze ruimte gebouwd omdat ik het beu was om overal dezelfde copy-paste websites te zien. Het grootste deel van het internet ziet er nu precies hetzelfde uit, en ik wilde een plek waar ik het zelf leuk vind om rond te klikken. Dit is in feite mijn persoonlijke digitale werkplaats — het heeft zijn eigenaardigheden en ik sleutel er constant aan, maar het is van mij.",
    ],
    closing:
      "Dus ga je gang: speel met de terminal, wissel van kleuren, of kijk wat je kapot kunt krijgen. En als je een idee hebt voor iets dat écht opvalt tussen de massa, laten we het bouwen.",
  },
};
