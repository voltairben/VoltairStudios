import type { Metadata } from "next";
import ChromeBar from "../components/ChromeBar";
import StatusBar from "../components/StatusBar";
import TermsContent from "./TermsContent";

export const metadata: Metadata = { title: "Algemene Voorwaarden — Voltair Studio" };

// Same shell/pattern as /privacy (see that page's own comment) — one
// more real long-form legal page, not a new page type. Reachable from
// every page's footer via StatusBar's own --terms flag.
export default function TermsPage() {
  return (
    <>
      <div className="scroll-page-chrome scroll-page-glass">
        <ChromeBar />
      </div>
      <main className="legal-page">
        <TermsContent />
      </main>
      <div className="scroll-page-footer scroll-page-glass">
        <StatusBar />
      </div>
    </>
  );
}
