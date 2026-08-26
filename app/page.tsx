import ChromeBar from "./components/ChromeBar";
import TerminalPane from "./components/TerminalPane";
import StatusBar from "./components/StatusBar";

// SkyboxProvider/SkyboxCanvas/LoadingScreen moved up to app/layout.tsx —
// shared across every route now (direct request: skybox behind the
// /work/[slug] case-study pages too), not homepage-only. This keeps
// only what's genuinely homepage-only: the zero-scroll .page grid.
export default function Home() {
  return (
    <div className="page">
      <ChromeBar />
      <TerminalPane />
      <StatusBar />
    </div>
  );
}
