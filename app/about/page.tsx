import type { Metadata } from "next";
import ChromeBar from "../components/ChromeBar";
import StatusBar from "../components/StatusBar";
import AboutContent from "./AboutContent";

export const metadata: Metadata = { title: "About — Voltair Studio" };

// A real route (see DESIGN.md for the modal-to-route history, and the
// zero-scroll-to-real-scroll history below). .skybox-canvas lives in
// the root layout (position: fixed, pointer-events: none — see
// layout.tsx), so it's already rendering behind this route with zero
// extra wiring.
//
// Real scrolling now, not .page's zero-scroll 3-row grid — direct
// request replaced the old one-paragraph "honest subset" placeholder
// with the full "This Is Voltair" essay (see AboutContent.tsx /
// data/about-content.ts), real user-authored content far too long to
// fit one fixed viewport without either unreadable type or clipped
// content. Same fixed-chrome/real-scroll-body shell /work/[slug]
// already uses for its own real, long-form content (.scroll-page-chrome/
// .scroll-page-footer — shared, not duplicated, see globals.css), not a
// new pattern invented for this page.
export default function AboutPage() {
  return (
    <>
      <div className="scroll-page-chrome">
        <ChromeBar />
      </div>
      <main className="about-page">
        <AboutContent />
      </main>
      <div className="scroll-page-footer">
        <StatusBar />
      </div>
    </>
  );
}
