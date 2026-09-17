import type { QuoteData } from "../data/invoice";
import { subtotal as calcSubtotal } from "../data/invoice";
import DocumentHeader from "./DocumentHeader";
import ClientSummaryCard from "./ClientSummaryCard";
import ItemizedTable from "./ItemizedTable";
import TotalsBreakdown from "./TotalsBreakdown";
import NotesTerms from "./NotesTerms";
import PrintButton from "./PrintButton";

export default function QuoteTemplate({ data }: { data: QuoteData }) {
  const subtotal = calcSubtotal(data.items);

  return (
    <article className="doc-page">
      <PrintButton />
      <DocumentHeader
        title="Estimate / Quote"
        documentNumber={data.documentNumber}
        dates={[
          { label: "Issue date", value: data.issueDate },
          { label: "Expires", value: data.expirationDate },
        ]}
      />

      <section className="doc-parties">
        <ClientSummaryCard label="Prepared By" party={data.preparedBy} />
        <ClientSummaryCard label="Prepared For" party={data.preparedFor} />
      </section>

      <ItemizedTable items={data.items} currency={data.currency} />

      <TotalsBreakdown
        subtotal={subtotal}
        currency={data.currency}
        milestones={data.milestones}
        grandTotal={subtotal}
        grandTotalLabel="Total Estimate"
      />

      <NotesTerms notes={data.notes} />

      {/* Sign-off -- quote-only, no invoice needs a client signature,
         so this stays local rather than becoming a shared component
         with an unused prop on the other template. */}
      <div className="signoff avoid-break">
        <div className="signoff-title">Client Acceptance</div>
        <p className="signoff-text">
          By signing below, {data.preparedFor.company ?? data.preparedFor.name} accepts this
          estimate and authorizes Voltair Studio to begin work per the milestone schedule above.
        </p>
        <div className="signoff-lines">
          <div className="signoff-line">
            <span className="signoff-line-fill" />
            <span className="signoff-line-label">Signature</span>
          </div>
          <div className="signoff-line signoff-line-date">
            <span className="signoff-line-fill" />
            <span className="signoff-line-label">Date</span>
          </div>
        </div>
      </div>
    </article>
  );
}
