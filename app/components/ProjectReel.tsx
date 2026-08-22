const PLACEHOLDER_COUNT = 6;

// No real project screenshots exist yet (see PRODUCT.md — nothing gets
// fabricated in their place). This renders clearly-labeled placeholder
// slots instead, sized and looped the way the real thumbnails will be
// once they exist, so swapping them in later is a content change, not
// a layout one.
//
// Autoplay-only, matching the reference exactly: segerman.dev's own
// image column doesn't respond to scroll/wheel input at all (confirmed
// by testing it directly — no scrollable container exists anywhere on
// that page, and simulated wheel events produced no movement). A
// version of this component briefly went the other way (real
// overflow-y:auto user-scrolling) before reverting to this, by direct
// choice, once that discrepancy was surfaced.
export default function ProjectReel() {
  const items = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => i + 1);
  // Duplicated once so the CSS loop (0 -> -50%) wraps with no visible seam.
  const looped = [...items, ...items];

  return (
    <aside className="project-reel" aria-hidden="true">
      <div className="project-reel-track">
        {looped.map((n, i) => (
          <div className="project-reel-item" key={i}>
            <span className="project-reel-label">
              project_{String(n).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
