import type { Metadata } from "next";
import QuoteTemplate from "../components/QuoteTemplate";
import { SAMPLE_QUOTE } from "../data/invoice";

export const metadata: Metadata = {
  title: "Quote — Voltair Studio",
  robots: { index: false, follow: false },
};

// Same story as app/invoice/page.tsx -- renders with sample data;
// issuing a real quote means duplicating SAMPLE_QUOTE with real
// numbers before printing.
export default function QuotePage() {
  return <QuoteTemplate data={SAMPLE_QUOTE} />;
}
