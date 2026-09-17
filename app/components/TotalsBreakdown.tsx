import type { Milestone } from "../data/invoice";
import { formatCurrency } from "../data/invoice";

// Invoice mode: subtotal -> tax -> balance due. Quote mode: subtotal
// -> milestone rows -> total estimate. One component instead of two,
// since both are fundamentally "subtotal, a breakdown, a grand total"
// — only what fills the middle differs.
export default function TotalsBreakdown({
  subtotal,
  currency,
  taxRatePercent,
  taxAmount,
  grandTotal,
  grandTotalLabel,
  milestones,
}: {
  subtotal: number;
  currency: string;
  taxRatePercent?: number;
  taxAmount?: number;
  grandTotal: number;
  grandTotalLabel: string;
  milestones?: Milestone[];
}) {
  return (
    <div className="totals-breakdown avoid-break">
      <div className="totals-row">
        <span>Subtotal</span>
        <span className="tabular">{formatCurrency(subtotal, currency)}</span>
      </div>
      {taxRatePercent !== undefined && taxAmount !== undefined && (
        <div className="totals-row">
          <span>Tax ({taxRatePercent}%)</span>
          <span className="tabular">{formatCurrency(taxAmount, currency)}</span>
        </div>
      )}
      {milestones?.map((m) => (
        <div key={m.label} className="totals-row totals-row-milestone">
          <span>{m.label} ({m.percent}%)</span>
          <span className="tabular">{formatCurrency((subtotal * m.percent) / 100, currency)}</span>
        </div>
      ))}
      <div className="totals-row totals-row-grand">
        <span>{grandTotalLabel}</span>
        <span className="tabular">{formatCurrency(grandTotal, currency)}</span>
      </div>
    </div>
  );
}
