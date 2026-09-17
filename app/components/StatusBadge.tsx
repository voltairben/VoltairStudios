import type { InvoiceStatus } from "../data/invoice";

const LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};

// One badge, driven by the real status value — never a separate
// hand-picked color per call site, so the look can't drift out of
// sync with what the document actually says (the same reasoning
// AudioToggle/CrtToggle's own aria-pressed-driven color already uses
// elsewhere in this codebase).
export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  return <span className={`status-badge status-badge-${status}`}>{LABELS[status]}</span>;
}
