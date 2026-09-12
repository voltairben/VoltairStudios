import type { ReactNode } from "react";
import SkyboxSwitcher from "./SkyboxSwitcher";
import AudioToggle from "./AudioToggle";
import CrtToggle from "./CrtToggle";
import T from "./T";
import TransitionLink from "./TransitionLink";

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
        {/* Real client portal (a separate app, its own login — see
            globals.css's own comment on .flag-portal) — direct
            request, replacing --x (not used). No custom domain yet,
            just its real Vercel deployment URL, same "real over
            placeholder" standard every other link on this site holds
            to; swap in a custom domain here the same way CONTACT_EMAIL
            gets swapped once one exists. */}
        <a href="https://portalvoltairstudio.vercel.app/" className="flag flag-portal">
          --portal
        </a>
        <a
          href="https://linkedin.com/company/voltairstudio"
          className="flag flag-linkedin"
        >
          --linkedin
        </a>
        {/* Real internal route (see app/privacy/page.tsx), same
            TransitionLink block-wipe every other internal navigation on
            this site already uses — a privacy policy earns a real,
            site-wide link, not just a URL nobody would ever find. Same
            progressive-disclosure tier as --github/--x in globals.css
            (.flag-privacy), not always-visible: the narrowest floor
            (320-380px) is already budgeted down to just the skybox
            switcher, a hard-won fix documented on that same rule. */}
        <TransitionLink href="/privacy" className="flag flag-privacy">
          --privacy
        </TransitionLink>
      </div>
    </footer>
  );
}
