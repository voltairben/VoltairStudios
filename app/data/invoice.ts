// Types + pure calculation helpers for the Invoice/Quote template
// system — shared by both templates so "Line Total = Qty * Rate",
// "Subtotal = sum of line totals", etc. exist in exactly one place,
// not re-derived per component. Real business documents (KVK number,
// address) follow the same "real value or an explicit placeholder,
// never fabricated" rule the rest of this codebase already holds to
// (see legal-content.ts) — bank details/address below are marked
// exactly that way, not invented.

export interface LineItem {
  description: string;
  /** Groups consecutive items under a phase heading (quotes use this
   *  for "phased project deliverables"; invoices can leave it unset). */
  phase?: string;
  qty: number;
  /** Unit rate in the document's own currency, major units (euros,
   *  not cents) — formatCurrency below handles display formatting. */
  rate: number;
}

export interface PartyInfo {
  name: string;
  /** Each entry is one printed line (street, city, country, ...). */
  address: string[];
  email: string;
  kvk?: string;
}

export interface ClientInfo {
  name: string;
  company?: string;
  address?: string[];
  email?: string;
}

export interface Milestone {
  label: string;
  /** 0-100. Callers are responsible for the set summing to 100 —
   *  deliberately not enforced here, a quote mid-edit is allowed to
   *  be temporarily inconsistent. */
  percent: number;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceData {
  documentNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  billedFrom: PartyInfo;
  billedTo: ClientInfo;
  items: LineItem[];
  taxRatePercent: number;
  currency: string;
  bankDetails: string[];
  notes?: string;
}

export interface QuoteData {
  documentNumber: string;
  issueDate: string;
  expirationDate: string;
  preparedBy: PartyInfo;
  preparedFor: ClientInfo;
  items: LineItem[];
  currency: string;
  milestones: Milestone[];
  notes?: string;
}

export function lineTotal(item: LineItem): number {
  return item.qty * item.rate;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function taxAmount(sub: number, taxRatePercent: number): number {
  return sub * (taxRatePercent / 100);
}

export function totalDue(sub: number, tax: number): number {
  return sub + tax;
}

/** Never hand-format currency at a call site — Intl.NumberFormat
 *  handles locale-correct grouping/decimal separators and the actual
 *  currency symbol, which a hardcoded `$${n.toFixed(2)}` gets wrong
 *  for EUR (symbol position, decimal comma) the moment this studio
 *  bills a client in it. Defaults match the studio's own real
 *  market (NL/EUR), not hardcoded into every call site. */
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
  locale: string = "nl-NL",
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

// Real studio identity, same placeholder convention legal-content.ts
// already uses for the same two not-yet-real facts (KVK number,
// street address) — flagged in the copy itself, not silently
// invented. Bank details are placeholder for the same reason: no
// real IBAN exists to put here yet.
export const STUDIO_PARTY: PartyInfo = {
  name: "Voltair Studio",
  address: ["[Address to be added]", "Netherlands"],
  email: "contact@voltairstudio.com",
  kvk: "KVK (Dutch Chamber of Commerce) number: registration pending",
};

export const PLACEHOLDER_BANK_DETAILS: string[] = [
  "Account holder: Voltair Studio",
  "IBAN: [IBAN to be added]",
  "BIC/SWIFT: [BIC to be added]",
  "Reference: invoice number above",
];

// Sample data — the templates render with this by default so both
// views are inspectable/printable immediately (per the brief's own
// acceptance criteria). There's no database or admin form behind
// this yet (out of scope for a template system); issuing a real
// document means duplicating one of these objects with real client
// values before printing — see the preview pages' own comments.
export const SAMPLE_INVOICE: InvoiceData = {
  documentNumber: "INV-2026-014",
  issueDate: "2026-09-17",
  dueDate: "2026-10-01",
  status: "sent",
  billedFrom: STUDIO_PARTY,
  billedTo: {
    name: "Sander de Vries",
    company: "KrachtigFit B.V.",
    address: ["Sportlaan 12", "3011 AB Rotterdam", "Netherlands"],
    email: "sander@krachtigfit.nl",
  },
  items: [
    { description: "UX/UI Strategy & Wireframing", qty: 1, rate: 1450 },
    { description: "Next.js Development (App Router, TypeScript)", qty: 32, rate: 85 },
    { description: "CMS Integration & Technical SEO", qty: 1, rate: 890 },
  ],
  taxRatePercent: 21,
  currency: "EUR",
  bankDetails: PLACEHOLDER_BANK_DETAILS,
  notes: "Thank you for building with Voltair Studio. Payment due within 14 days of the issue date.",
};

export const SAMPLE_QUOTE: QuoteData = {
  documentNumber: "QUO-2026-031",
  issueDate: "2026-09-17",
  expirationDate: "2026-10-17",
  preparedBy: STUDIO_PARTY,
  preparedFor: {
    name: "Amira El Idrissi",
    company: "Sol DNB",
    email: "amira@soldnb.com",
  },
  items: [
    { phase: "Phase 1 — Discovery & Strategy", description: "UX/UI Strategy & Art Direction", qty: 1, rate: 1800 },
    { phase: "Phase 1 — Discovery & Strategy", description: "Technical Architecture Planning", qty: 1, rate: 650 },
    { phase: "Phase 2 — Build", description: "Next.js Development (App Router, TypeScript)", qty: 60, rate: 85 },
    { phase: "Phase 2 — Build", description: "CMS & Technical SEO", qty: 1, rate: 950 },
    { phase: "Phase 3 — Launch", description: "QA, Deployment & Handover", qty: 1, rate: 600 },
  ],
  currency: "EUR",
  milestones: [
    { label: "Deposit — on acceptance", percent: 50 },
    { label: "Design approval", percent: 25 },
    { label: "Deployment", percent: 25 },
  ],
  notes: "This estimate is valid for 30 days from the issue date. Scope changes after acceptance may affect the total.",
};
