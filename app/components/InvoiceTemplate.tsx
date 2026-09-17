import type { InvoiceData } from "../data/invoice";
import { subtotal as calcSubtotal, taxAmount as calcTax, totalDue as calcTotal } from "../data/invoice";
import DocumentHeader from "./DocumentHeader";
import StatusBadge from "./StatusBadge";
import ClientSummaryCard from "./ClientSummaryCard";
import ItemizedTable from "./ItemizedTable";
import TotalsBreakdown from "./TotalsBreakdown";
import NotesTerms from "./NotesTerms";
import PrintButton from "./PrintButton";

// All three calculated totals are DERIVED here from `data.items`, not
// passed in separately — there is exactly one place Subtotal/Tax/Total
// get computed (app/data/invoice.ts), so a caller changing `items`
// can never leave a stale total on screen.
export default function InvoiceTemplate({ data }: { data: InvoiceData }) {
  const subtotal = calcSubtotal(data.items);
  const tax = calcTax(subtotal, data.taxRatePercent);
  const total = calcTotal(subtotal, tax);

  return (
    <article className="doc-page">
      <PrintButton />
      <DocumentHeader
        title="Invoice"
        documentNumber={data.documentNumber}
        dates={[
          { label: "Issue date", value: data.issueDate },
          { label: "Due date", value: data.dueDate },
        ]}
        statusSlot={<StatusBadge status={data.status} />}
      />

      <section className="doc-parties">
        <ClientSummaryCard label="Billed From" party={data.billedFrom} />
        <ClientSummaryCard label="Billed To" party={data.billedTo} />
      </section>

      <ItemizedTable items={data.items} currency={data.currency} />

      <TotalsBreakdown
        subtotal={subtotal}
        currency={data.currency}
        taxRatePercent={data.taxRatePercent}
        taxAmount={tax}
        grandTotal={total}
        grandTotalLabel="Balance Due"
      />

      <NotesTerms notes={data.notes} listLabel="Payment Instructions" list={data.bankDetails} />
    </article>
  );
}
