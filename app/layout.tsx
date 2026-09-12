import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import { SkyboxProvider } from "./components/skybox-context";
import SkyboxCanvas from "./components/SkyboxCanvas";
import LoadingScreen from "./components/LoadingScreen";
import { PageTransitionProvider } from "./components/page-transition-context";
import PageTransitionOverlay from "./components/PageTransitionOverlay";
import { AudioProvider } from "./components/audio-context";
import { CrtProvider } from "./components/crt-context";
import { LangProvider } from "./components/lang-context";
import PaletteRestorer from "./components/PaletteRestorer";
import "./globals.css";

// Self-hosted, not next/font/google: Google's hosted IBM Plex Mono is
// static-weight-only (checked directly against next/font's own bundled
// font-data.json — no "variable" entry, so `weight: undefined` there
// throws "Missing weight for font" at build time, it doesn't unlock a
// variable axis). IBM published a real IBM Plex Mono Variable font
// three weeks before this (`@ibm/plex-mono-variable@1.0.0` on npm,
// OFL-1.1) — extracted just the Roman woff2 from it (temp-installed,
// copied out, uninstalled again; the package itself pulls in an IBM
// telemetry dependency neither this site nor its build needs). `weight:
// "100 700"` below is a CSS font-weight *range*, not a single value —
// that's what tells the browser this one file covers the whole
// variable axis instead of pinning it to 400. Same `variable:
// "--font-mono"` name as before, so nothing downstream (globals.css's
// --font-mono-stack, every component using it) needed to change.
const plexMono = localFont({
  src: "./fonts/IBMPlexMonoVar-Roman.woff2",
  weight: "100 700",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
});

// Direct request: Sentient for headings, Satoshi for body copy — a
// real, deliberate departure from this system's own established "one
// monospace family everywhere" rule (see DESIGN.md's Don'ts) rather
// than something to quietly second-guess. Scoped to the prose/content
// layer specifically (globals.css's own --font-heading-stack/
// --font-body-stack, applied to headline/paragraph-scale elements) —
// the terminal itself (command input, log/systeminfo/man output)
// stays IBM Plex Mono, confirmed directly: a real shell reading in a
// proportional-width serif/sans wouldn't read as a shell anymore.
// Self-hosted from Fontshare's own CDN (see Fontshare-LICENSE.txt),
// same "no third-party runtime dependency" standard plexMono already
// holds to — not next/font/google, since neither family is on Google
// Fonts at all. Static per-weight files, not a variable font: neither
// family ships one on Fontshare, and this system only ever needs the
// 2-3 real weights actually used (500/700 for Sentient headings,
// 400/500/700 for Satoshi body/label/emphasis).
const sentient = localFont({
  src: [
    { path: "./fonts/Sentient-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Sentient-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sentient",
  display: "swap",
});
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voltair Studio",
  description:
    "Voltair Studio is a small, senior web-dev team building MVP and launch websites for early-stage startup founders — brand-true UI, a production Next.js front-end, live in days.",
  openGraph: {
    title: "Voltair Studio",
    description:
      "MVP sites for startup founders — brand-true UI, a production Next.js front-end, live in days.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexMono.variable} ${sentient.variable} ${satoshi.variable}`}
    >
      <body>
        {/* Skybox now lives here, not homepage-only in app/page.tsx —
            direct request to show it behind /work/[slug] case-study
            pages too. Shared at root instead of duplicated per-page so
            navigating between them doesn't reload the texture, reset
            the active skybox, or re-run the loading screen: one
            provider, one canvas, one loading gate for the whole app.
            The zero-scroll .page grid stays homepage-only in
            app/page.tsx — .skybox-canvas is position:fixed and
            pointer-events:none (see globals.css), so it doesn't care
            what layout sits on top of it; the case-study page keeps its
            own plain, normal-scrolling flow untouched. */}
        {/* ViewTransitions wraps the whole tree (root layout, not just
            the reel) because the morph is cross-page: the browser's
            View Transitions API needs to see the navigation itself,
            which only next-view-transitions' Link/router hook trigger —
            plain next/link navigations wouldn't animate even with a
            matching viewTransitionName on both sides. */}
        {/* AudioProvider wraps SkyboxProvider (not the other way around)
            — SkyboxCanvas plays a sound on real skybox switches, so it
            needs useAudio() available; usePathname() inside
            AudioProvider itself (the route-change sweep) works
            anywhere under the App Router, doesn't need to be inside
            ViewTransitions specifically. */}
        {/* Runs on every page, not just the homepage — a real bug caught
            live: `theme` used to only restore itself from inside
            TerminalInput.tsx, which is homepage-only content, so a
            fresh load of /about or a case-study page always showed
            persimmon regardless of what was actually saved. See
            PaletteRestorer.tsx's own comment. */}
        <PaletteRestorer />
        {/* Wraps everything, same reason PaletteRestorer runs at root —
            ChromeBar/StatusBar/ScrambleText need useLang() on every
            route, not just the homepage. Its own effect corrects
            document.documentElement.lang from localStorage after
            mount; the static lang="en" on <html> above is the
            SSR-safe default until then, same shape CrtProvider already
            uses for its own body.dataset.crt correction. */}
        <LangProvider>
          <CrtProvider>
            <AudioProvider>
              <SkyboxProvider>
                {/* PageTransitionProvider wraps the same tree ViewTransitions
                    does, for the same "cross-page, not per-component" reason
                    — every trigger() call site (ChromeBar, ProjectReel,
                    work/[slug]/page.tsx, ...) lives on a different route,
                    so the state needs to survive the navigation itself, not
                    reset with whatever page happened to call trigger(). */}
                <PageTransitionProvider>
                  <SkyboxCanvas />
                  <ViewTransitions>{children}</ViewTransitions>
                  <LoadingScreen />
                  <PageTransitionOverlay />
                </PageTransitionProvider>
              </SkyboxProvider>
            </AudioProvider>
          </CrtProvider>
        </LangProvider>
      </body>
    </html>
  );
}
