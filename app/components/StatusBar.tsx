import SkyboxSwitcher from "./SkyboxSwitcher";
import AudioToggle from "./AudioToggle";
import CrtToggle from "./CrtToggle";

export default function StatusBar() {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <span className="status-text">Available October 2026</span>
        <span className="status-tz"> · UTC</span>
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
