"use client";

// The whole "export to PDF" story per the brief's own constraint
// ("don't install a heavyweight library if window print styling
// suffices") — every browser's native Print dialog already offers
// "Save as PDF" as a destination; @media print in globals.css (the
// invoice/quote §) does the actual layout work. .no-print hides this
// button itself when the dialog is actually open/printing.
export default function PrintButton() {
  return (
    <button type="button" className="print-button no-print" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
