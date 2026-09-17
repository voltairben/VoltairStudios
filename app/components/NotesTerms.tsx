// Shared free-text block, optionally paired with a heading-labelled
// list (bank details for an invoice, or any future terms list) — kept
// generic rather than "InvoiceNotes"/"QuoteNotes" since both just need
// "some prose, maybe a labelled list under it."
export default function NotesTerms({
  notes,
  listLabel,
  list,
}: {
  notes?: string;
  listLabel?: string;
  list?: string[];
}) {
  if (!notes && !list?.length) return null;
  return (
    <div className="notes-terms avoid-break">
      {notes && <p className="notes-text">{notes}</p>}
      {list && list.length > 0 && (
        <div className="notes-list">
          {listLabel && <div className="notes-list-label">{listLabel}</div>}
          {list.map((line, i) => (
            <div key={i} className="notes-list-line">{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
