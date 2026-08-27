"use client";

import ScrambleText from "./ScrambleText";
import KineticTypography from "./KineticTypography";
import ProjectReel from "./ProjectReel";
import ProjectIndex from "./ProjectIndex";
import TerminalInput from "./TerminalInput";
import { ProjectShowcaseProvider } from "./project-showcase-context";
import { useLang } from "./lang-context";
import { t } from "../data/i18n";

export default function TerminalPane() {
  // ScrambleText/`.position` need plain strings (not JSX), unlike the
  // server-rendered pages' <T k="..." /> — so this reads useLang()
  // directly instead, same as ChromeBar/TerminalInput.
  const { lang } = useLang();
  return (

    <div className="hero-row">
      <KineticTypography />
      <main className="content">
        <h1 className="headline">
          <ScrambleText text={t(lang, "hero.headline1")} className="type-target" />
          <br />
          <ScrambleText
            text={t(lang, "hero.headline2")}
            className="headline-line2"
            delayMs={150}
          />
          <span className="cursor" aria-hidden="true">
            ▌
          </span>
        </h1>
        <p className="position">{t(lang, "hero.tagline")}</p>

        <a href="mailto:contact@voltairstudio.com" className="cta">
          <span className="cta-text">contact@voltairstudio.com</span>
        </a>

        {/* Real functional command line, direct request — reuses the
            same skybox/about state everything else on the page already
            shares, not a separate one-off. See TerminalInput.tsx. */}
        <TerminalInput />
      </main>

      <ProjectShowcaseProvider>
        <ProjectReel />
        <ProjectIndex />
      </ProjectShowcaseProvider>
    </div>

  );
}
