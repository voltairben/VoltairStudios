import type { PartyInfo, ClientInfo } from "../data/invoice";

// One card shape, two roles: Invoice calls it "Billed From"/"Billed
// To", Quote calls the same shape "Prepared By"/"Prepared For" — the
// label is the only thing that changes per the brief's own spec.
export default function ClientSummaryCard({
  label,
  party,
}: {
  label: string;
  party: PartyInfo | ClientInfo;
}) {
  return (
    <div className="client-card">
      <div className="client-card-label">{label}</div>
      <div className="client-card-name">{party.name}</div>
      {"company" in party && party.company && <div className="client-card-company">{party.company}</div>}
      {party.address?.map((line, i) => (
        <div key={i} className="client-card-line">{line}</div>
      ))}
      {party.email && <div className="client-card-line">{party.email}</div>}
      {"kvk" in party && party.kvk && <div className="client-card-line client-card-kvk">{party.kvk}</div>}
    </div>
  );
}
