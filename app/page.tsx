import ChromeBar from "./components/ChromeBar";
import TerminalPane from "./components/TerminalPane";
import StatusBar from "./components/StatusBar";
import { SkyboxProvider } from "./components/skybox-context";
import SkyboxCanvas from "./components/SkyboxCanvas";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  return (
    <SkyboxProvider>
      <SkyboxCanvas />
      <div className="page">
        <ChromeBar />
        <TerminalPane />
        <StatusBar />
      </div>
      <LoadingScreen />
    </SkyboxProvider>
  );
}
