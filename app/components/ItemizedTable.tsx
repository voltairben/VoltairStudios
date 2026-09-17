import { Fragment } from "react";
import type { LineItem } from "../data/invoice";
import { lineTotal, formatCurrency } from "../data/invoice";

// Groups consecutive rows under a phase heading whenever `phase`
// changes from the previous item — the one mechanism that covers both
// the invoice's flat line items (phase left unset, no headings render)
// and the quote's "phased project deliverables" without two separate
// table components.
export default function ItemizedTable({ items, currency }: { items: LineItem[]; currency: string }) {
  // Derived up front, not mutated inside the render map below (a real
  // lint error, react-hooks/immutability: reassigning a variable
  // across .map() iterations mid-render is flagged even for a plain
  // local like this one, since React may re-run render bodies).
  // i===0's own phase always shows; later ones show only when the
  // phase actually changed from the item right before them.
  const showPhaseAt = items.map((item, i) => i === 0 || item.phase !== items[i - 1].phase);

  return (
    <table className="itemized-table">
      <thead>
        <tr>
          <th className="col-description">Description</th>
          <th className="col-qty">Qty / Hrs</th>
          <th className="col-rate">Rate</th>
          <th className="col-total">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => {
          const showPhase = item.phase && showPhaseAt[i];
          return (
            <Fragment key={i}>
              {showPhase && (
                <tr className="phase-row avoid-break">
                  <td colSpan={4}>{item.phase}</td>
                </tr>
              )}
              <tr className="avoid-break">
                <td className="col-description">{item.description}</td>
                <td className="col-qty tabular">{item.qty}</td>
                <td className="col-rate tabular">{formatCurrency(item.rate, currency)}</td>
                <td className="col-total tabular">{formatCurrency(lineTotal(item), currency)}</td>
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
