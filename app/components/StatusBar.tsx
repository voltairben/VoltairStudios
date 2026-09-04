import type { ReactNode } from "react";
import SkyboxSwitcher from "./SkyboxSwitcher";
import AudioToggle from "./AudioToggle";
import CrtToggle from "./CrtToggle";
import T from "./T";

export default function StatusBar({
  left,
}: {
  // Generic override for status-left's content — not a route-specific
  // boolean (an earlier `hideAvailability` prop was exactly that, added
  // to suppress the About page's now-duplicate "Available October
  // 2026" line; caught on review as the same shape this codebase
  // already learned not to do once before — work/[slug]/page.tsx's own
  // comment records Year/Visit being moved out of StatusBar because it
  // was "the wrong location" for route-specific content). A `left`
  // slot lets any route replace the whole left cluster with its own
  // markup — the shared right-side toggles/social links stay exactly
  // as they are, not duplicated — instead of StatusBar accreting one
  // new boolean per future route-specific need.
  left?: ReactNode;
}) {
  return (
    <footer className="status-bar">
      <div className="status-left">
        {left ?? (
          <>
            <span className="status-text">
              <T k="status.available" />
            </span>
            <span className="status-tz"> · UTC</span>
            <span className="status-copyright"> · © 2026</span>
          </>
        )}
      </div>
      <div className="status-right">
        <AudioToggle />
        <CrtToggle />
        <SkyboxSwitcher />
        <a href="https://github.com/voltairstudio" className="flag flag-github">
          --github
        </a>
        <a href="https://x.com/voltairstudio" className="flag flag-x">
          --x
        </a>
        <a
          href="https://linkedin.com/company/voltairstudio"
          className="flag flag-linkedin"
        >
          --linkedin
        </a>
      </div>
    </footer>
  );
}
