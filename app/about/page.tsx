import type { Metadata } from "next";
import ChromeBar from "../components/ChromeBar";
import StatusBar from "../components/StatusBar";
import AboutContent from "./AboutContent";

export const metadata: Metadata = { title: "About — Voltair Studio" };

// A real route (see DESIGN.md for the modal-to-route history). Been
// through real scrolling and back — a full essay once needed it, a
// later full rebuild (AboutContent.tsx's own comment has that
// history) replaced the essay with a short corner layout that fits
// one fixed viewport again, zero-scroll like .page's own 3-row grid.
// .skybox-canvas lives in the root layout (position: fixed,
// pointer-events: none — see layout.tsx), so it's already rendering
// behind this route with zero extra wiring. Still uses the same
// fixed-chrome/fixed-footer shell /work/[slug] uses for its own real,
// long-form scrolling content (.scroll-page-chrome/.scroll-page-footer —
// shared, not duplicated, see globals.css) even though this page
// itself no longer scrolls past them — .about-page's own padding
// reserves the space either way.
//
// StatusBar's `left` override, direct request — AboutContent's own
// meta cluster already shows "status: Available October 2026," so
// this footer's default copy of the same line would be a real
// duplicate here, not on any other route (each renders its own
// separate <StatusBar />). `.about-status-left` unconditionally shows
// `.status-tz`/`.status-copyright` (see globals.css) — the shared
// component's own default left content hides those below 480px/720px
// on the assumption "Available October 2026" is always there to
// anchor the row; without it, that breakpoint math left this footer
// showing a stray leading " · " or nothing at all in that range,
// caught on review.
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
        <StatusBar
          left={
            <span className="about-status-left">
              <span className="status-tz">UTC</span>
              <span className="status-copyright"> · © 2026</span>
            </span>
          }
        />
      </div>
    </>
  );
}
