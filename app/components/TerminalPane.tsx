import ScrambleText from "./ScrambleText";
import ProjectReel from "./ProjectReel";
import ProjectIndex from "./ProjectIndex";
import { ProjectShowcaseProvider } from "./project-showcase-context";

export default function TerminalPane() {
  return (

    <div className="hero-row">
      <main className="content">
        <h1 className="headline">
          <ScrambleText text="Creative" className="type-target" />
          <br />
          <ScrambleText text="Designers" className="headline-line2" delayMs={150} />
          <span className="cursor" aria-hidden="true">
            ▌
          </span>
        </h1>
        <p className="position">Engineering the Architecture Behind the Aesthetics.</p>

        <a href="mailto:contact@voltairstudio.com" className="cta">
          <span className="cta-text">contact@voltairstudio.com</span>
        </a>

      </main>

      <ProjectShowcaseProvider>
        <ProjectReel />
        <ProjectIndex />
      </ProjectShowcaseProvider>
    </div>

  );
}
