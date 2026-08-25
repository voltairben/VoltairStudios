import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
