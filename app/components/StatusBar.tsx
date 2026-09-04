import SkyboxSwitcher from "./SkyboxSwitcher";
import AudioToggle from "./AudioToggle";
import CrtToggle from "./CrtToggle";
import T from "./T";

export default function StatusBar({
  hideAvailability = false,
}: {
  // About page only, direct request — its own meta cluster already
  // shows "status: Available October 2026" (see AboutContent.tsx), so
  // this footer's own copy of the same line is a real duplicate there,
  // not on any other route each with its own separate <StatusBar />
  // instance (see about/page.tsx / page.tsx / work/[slug]/page.tsx).
  hideAvailability?: boolean;
}) {
  return (
    <footer className="status-bar">
      <div className="status-left">
        {!hideAvailability && (
          <span className="status-text">
            <T k="status.available" />
          </span>
        )}
        <span className="status-tz">{hideAvailability ? "UTC" : " · UTC"}</span>
        <span className="status-copyright"> · © 2026</span>
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
