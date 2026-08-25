import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
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
    <html lang="en" className={plexMono.variable}>
      <body>
        {/* The skybox/loading-screen and the zero-scroll layout are
            homepage-only concerns — moved into app/page.tsx itself so
            /work/[slug] case-study pages get plain, normal document
            flow instead of inheriting the hero's fixed-viewport chrome. */}
        {/* ViewTransitions wraps the whole tree (root layout, not just
            the reel) because the morph is cross-page: the browser's
            View Transitions API needs to see the navigation itself,
            which only next-view-transitions' Link/router hook trigger —
            plain next/link navigations wouldn't animate even with a
            matching viewTransitionName on both sides. */}
        <ViewTransitions>{children}</ViewTransitions>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=5ce2e7e7-3747-4dee-a2e4-04ce45a1e1d3"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
