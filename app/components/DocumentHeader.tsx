import Image from "next/image";
// Real source is Logo/VoltairLogo1.png, the glossy 3D render — but
// that file's own background is baked-in dark glow, not real
// transparency (confirmed directly: even luminance-derived alpha left
// a muddy gray halo once composited onto this document's white page,
// screenshotted before ruling it out). This derived asset carries the
// same mark, genuinely transparent, recolored to the document's own
// persimmon accent — the flat vector source (Logo/3e3c5a99...png)
// already used everywhere else on the live site for exactly this
// "real alpha, recolorable" reason (see ChromeBar.tsx's own comment).
import logo from "../../Logo/VoltairLogo1-invoice.png";

interface DateField {
  label: string;
  value: string;
}

// Shared by both templates — title, logo, document number and its
// dates, optional status badge slot. `dates` is a list rather than
// two fixed props since Invoice needs Issue/Due and Quote needs
// Issue/Expiration — same shape, different labels, one component.
export default function DocumentHeader({
  title,
  documentNumber,
  dates,
  statusSlot,
}: {
  title: string;
  documentNumber: string;
  dates: DateField[];
  statusSlot?: React.ReactNode;
}) {
  return (
    <header className="doc-header">
      <div className="doc-header-brand">
        <Image src={logo} alt="" width={40} height={40} className="doc-logo" priority />
        <span className="doc-studio-name">Voltair Studio</span>
      </div>
      <div className="doc-header-meta">
        <h1 className="doc-title">{title}</h1>
        <div className="doc-number">{documentNumber}</div>
        <dl className="doc-dates">
          {dates.map((d) => (
            <div key={d.label} className="doc-date-row">
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
        {statusSlot}
      </div>
    </header>
  );
}
