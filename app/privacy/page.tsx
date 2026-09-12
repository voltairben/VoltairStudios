import type { Metadata } from "next";
import ChromeBar from "../components/ChromeBar";
import StatusBar from "../components/StatusBar";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = { title: "Privacy Policy — Voltair Studio" };

// Real, normally-scrolling long-form content — same shared
// .scroll-page-chrome/.scroll-page-footer shell /about and
// /work/[slug] already use (see globals.css), not a third pattern
// invented for one more page. Reachable from every page's footer via
// StatusBar's own --privacy flag (see StatusBar.tsx), not just a URL
// nobody would ever find — a privacy policy earns a real link.
export default function PrivacyPage() {
  return (
    <>
      <div className="scroll-page-chrome">
        <ChromeBar />
      </div>
      <main className="legal-page">
        <PrivacyContent />
      </main>
      <div className="scroll-page-footer">
        <StatusBar />
      </div>
    </>
  );
}
