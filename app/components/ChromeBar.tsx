import logo from "../../Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png";

export default function ChromeBar() {
  return (
    <header className="chrome-bar">
      <div className="wordmark">voltair_studio</div>
      <nav className="chrome-nav" aria-label="Site">
        {/* Recolored to the accent via CSS mask, not rendered as an <img> —
            the logo's real green stays only in the source file and the
            favicon; on-page it now matches "Contact", by direct request. */}
        <span
          className="chrome-logo"
          role="img"
          aria-label="Voltair Studio"
          style={{
            WebkitMaskImage: `url(${logo.src})`,
            maskImage: `url(${logo.src})`,
          }}
        />
        <span className="chrome-nav-text">About</span>
        <a href="mailto:contact@voltairstudio.com" className="chrome-nav-link">
          Contact
        </a>
      </nav>
    </header>
  );
}
