import type { Metadata } from "next";
import ComingSoonContent from "./ComingSoonContent";

// Direct request ("make an under construction screen...so people cant
// enter it"). middleware.ts rewrites every route to this one for any
// visitor without the preview bypass cookie — see its own comment for
// the full mechanism. noindex here too: middleware's X-Robots-Tag
// header covers the rewritten responses, this covers a direct/bookmarked
// hit on /coming-soon itself.
export const metadata: Metadata = {
  title: "Voltair Studio",
  robots: { index: false, follow: false },
};

// No ChromeBar/StatusBar here on purpose — this page IS the entire
// site while the gate is up, not one route among several; nav links
// to /about or /contact would just get rewritten straight back to
// this same page anyway (see middleware.ts), so offering them would
// be a dead end dressed up as a real choice. SkyboxCanvas/LoadingScreen
// still render underneath (they're mounted in the root layout, shared
// by every route already) — same atmospheric background as the real
// site, not a stripped-down placeholder look.
export default function ComingSoonPage() {
  return <ComingSoonContent />;
}
