import ChromeBar from "./components/ChromeBar";
import TerminalPane from "./components/TerminalPane";
import StatusBar from "./components/StatusBar";

export default function Home() {
  return (
    <div className="page">
      <ChromeBar />
      <TerminalPane />
      <StatusBar />
    </div>
  );
}
