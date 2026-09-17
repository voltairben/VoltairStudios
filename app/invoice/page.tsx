import type { Metadata } from "next";
import InvoiceTemplate from "../components/InvoiceTemplate";
import { SAMPLE_INVOICE } from "../data/invoice";

// Internal tool, not marketing content -- excluded from robots.ts/
// sitemap.ts (see robots.ts's own comment on why this route exists at
// all now). noindex here too, defense in depth against a direct link
// getting crawled before robots.txt is even consulted.
export const metadata: Metadata = {
  title: "Invoice — Voltair Studio",
  robots: { index: false, follow: false },
};

// Renders with SAMPLE_INVOICE (app/data/invoice.ts) -- there's no
// database or form behind this, by design (a template system, not a
// billing app; see the brief this was built from). To issue a real
// invoice: duplicate SAMPLE_INVOICE with the real client's numbers,
// pass it to <InvoiceTemplate data={...} /> here, then Print / Save
// as PDF from the button this page renders.
export default function InvoicePage() {
  return <InvoiceTemplate data={SAMPLE_INVOICE} />;
}
