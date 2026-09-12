// Real, honest privacy policy — direct request ("we need to have
// everything legal, make the policy"), grounded in this codebase's
// actual behavior, checked directly before writing a word of it
// (every localStorage key this app really uses, every mailto: link,
// confirmed zero cookies/analytics/tracking anywhere) rather than
// generic boilerplate. See PrivacyContent.tsx for how this renders.
//
// NL is a first-pass translation, same status as every other Dutch
// string on this site right now (see DESIGN.md / memory: the user is
// a native Dutch speaker and will review all NL copy himself) — worth
// a closer look before this goes live given it's a legal document,
// not just marketing copy.
//
// "Who we are" section: company name is real (Voltair Studio, direct
// confirmation). Address and KVK (Dutch Chamber of Commerce) number
// are NOT — the address is a deliberate placeholder (the user's own,
// not something to embed here without him actually providing it), and
// the KVK number doesn't exist yet (registration pending, expected
// imminently). Flagged plainly in the copy itself, not silently
// blanked or fabricated — same standing rule CONTACT_EMAIL's own
// placeholder-domain flag already follows in PRODUCT.md. Replace both
// the moment real values exist.

export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalContentShape = {
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

export const LEGAL_CONTENT: Record<"en" | "nl", LegalContentShape> = {
  en: {
    updated: "Last updated: September 12, 2026",
    intro: [
      "Voltair Studio (“we”, “us”) builds this site to be as honest about your data as it is about everything else on it. This page plainly explains what we do — and don’t do — with any information connected to you.",
    ],
    sections: [
      {
        title: "Who we are",
        paragraphs: ["This site is operated by:"],
        list: [
          "Voltair Studio",
          "[Address to be added]",
          "KVK (Dutch Chamber of Commerce) number: registration pending",
        ],
      },
      {
        title: "The short version",
        paragraphs: [],
        list: [
          "No cookies.",
          "No analytics, tracking, or advertising.",
          "We don’t sell or share your data with anyone.",
          "The only thing we ever receive is what you choose to send us — usually just an email.",
        ],
      },
      {
        title: "What this site stores on your device",
        paragraphs: [
          "This site remembers a few preferences locally, in your own browser (technically: localStorage, not a cookie — see “Cookies” below), so it looks and sounds the way you left it next time you visit:",
        ],
        list: [
          "Your language choice (English/Dutch)",
          "Your chosen color theme",
          "Whether sound effects are on",
          "Whether the CRT screen effect is on",
          "Whether you’ve already seen the one-time boot animation",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "This site does not use cookies of any kind — not for tracking, not for advertising, not even for the preferences above (those use a different, non-cookie browser mechanism, described above). There is nothing here to consent to.",
        ],
      },
      {
        title: "If you contact us",
        paragraphs: [
          "If you email us — by clicking a Contact link/button, or typing ‘contact’ into this site’s terminal — your email address and whatever you write become a normal email conversation between you and us. We use it only to respond to you, and keep it only as long as that makes sense (for example, an ongoing client relationship). We don’t add you to a mailing list, and we don’t share it with anyone else. You can ask us to delete it at any time.",
        ],
      },
      {
        title: "Hosting",
        paragraphs: [
          "This site is hosted on Vercel. Like virtually every website host, Vercel’s own infrastructure processes standard technical connection data (such as your IP address and request timestamps) simply to deliver the page to your browser — handled entirely by Vercel, under Vercel’s own privacy policy, not by us directly. See vercel.com/legal/privacy-policy.",
        ],
      },
      {
        title: "Links to other sites",
        paragraphs: [
          "Some pages here link out to real client projects or to our own social profiles. Once you leave this site, whatever you do there is covered by that site’s own policy, not this one.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "If you’re in the EU/EEA, you have the right under the GDPR to:",
        ],
        list: [
          "know what data we hold about you (access)",
          "have it corrected if it’s wrong (rectification)",
          "have it deleted (erasure)",
          "object to or restrict how it’s used",
          "get a copy of it in a portable format",
          "lodge a complaint with your national data protection authority (in the Netherlands: the Autoriteit Persoonsgegevens)",
        ],
      },
      {
        title: "Changes",
        paragraphs: [
          "We may update this page as the site changes. The date at the top always reflects the current version — check back if you’re unsure.",
        ],
      },
    ],
  },
  nl: {
    updated: "Laatst bijgewerkt: 12 september 2026",
    intro: [
      "Voltair Studio (“we”, “wij”) bouwt deze site net zo eerlijk over je gegevens als over al het andere erop. Deze pagina legt gewoon uit wat we wel — en niet — doen met informatie die met jou te maken heeft.",
    ],
    sections: [
      {
        title: "Wie we zijn",
        paragraphs: ["Deze site wordt beheerd door:"],
        list: [
          "Voltair Studio",
          "[Adres nog toe te voegen]",
          "KVK-nummer: registratie in aanvraag",
        ],
      },
      {
        title: "De korte versie",
        paragraphs: [],
        list: [
          "Geen cookies.",
          "Geen analytics, tracking of advertenties.",
          "We verkopen of delen je gegevens met niemand.",
          "Het enige wat we ooit ontvangen, is wat je zelf naar ons stuurt — meestal gewoon een e-mail.",
        ],
      },
      {
        title: "Wat deze site op jouw apparaat opslaat",
        paragraphs: [
          "Deze site onthoudt een paar voorkeuren lokaal, in je eigen browser (technisch: localStorage, geen cookie — zie “Cookies” hieronder), zodat de site er de volgende keer weer zo uitziet en klinkt als je hem achterliet:",
        ],
        list: [
          "Je taalkeuze (Engels/Nederlands)",
          "Je gekozen kleurthema",
          "Of geluidseffecten aanstaan",
          "Of het CRT-schermeffect aanstaat",
          "Of je de eenmalige opstartanimatie al hebt gezien",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Deze site gebruikt geen enkele vorm van cookies — niet voor tracking, niet voor advertenties, zelfs niet voor de voorkeuren hierboven (die gebruiken een ander mechanisme dan cookies, hierboven beschreven). Er is hier niets waarvoor je toestemming hoeft te geven.",
        ],
      },
      {
        title: "Als je contact met ons opneemt",
        paragraphs: [
          "Als je ons e-mailt — via een Contact-link/knop, of door ‘contact’ te typen in de terminal van deze site — worden je e-mailadres en wat je schrijft een gewoon e-mailgesprek tussen jou en ons. We gebruiken het alleen om je te antwoorden, en bewaren het alleen zolang dat zinvol is (bijvoorbeeld voor een lopende klantrelatie). We zetten je niet op een mailinglijst en delen het met niemand anders. Je kunt op elk moment vragen om het te laten verwijderen.",
        ],
      },
      {
        title: "Hosting",
        paragraphs: [
          "Deze site wordt gehost op Vercel. Zoals vrijwel elke websitehost verwerkt Vercel’s eigen infrastructuur standaard technische verbindingsgegevens (zoals je IP-adres en tijdstippen van verzoeken) puur om de pagina bij je browser af te leveren — dit gebeurt volledig door Vercel, onder Vercel’s eigen privacybeleid, niet door ons. Zie vercel.com/legal/privacy-policy.",
        ],
      },
      {
        title: "Links naar andere sites",
        paragraphs: [
          "Sommige pagina’s hier linken naar echte klantprojecten of naar onze eigen social-mediaprofielen. Zodra je deze site verlaat, valt wat je daar doet onder het beleid van die site, niet onder dit beleid.",
        ],
      },
      {
        title: "Jouw rechten",
        paragraphs: ["Als je in de EU/EER woont, heb je onder de AVG het recht om:"],
        list: [
          "te weten welke gegevens we van je hebben (inzage)",
          "ze te laten corrigeren als ze onjuist zijn (rectificatie)",
          "ze te laten verwijderen (verwijdering)",
          "bezwaar te maken tegen of beperking te vragen van het gebruik ervan",
          "een kopie te krijgen in een overdraagbaar formaat",
          "een klacht in te dienen bij je nationale toezichthouder (in Nederland: de Autoriteit Persoonsgegevens)",
        ],
      },
      {
        title: "Wijzigingen",
        paragraphs: [
          "We kunnen deze pagina bijwerken naarmate de site verandert. De datum bovenaan geeft altijd de huidige versie weer — kom gerust terug als je twijfelt.",
        ],
      },
    ],
  },
};
