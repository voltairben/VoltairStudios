"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { useSkybox, SKYBOXES, type SkyboxName } from "./skybox-context";
import { PROJECTS } from "../data/projects";

type Line = { kind: "input" | "output" | "error"; text: string };

const HELP_TEXT = [
  "help              show this list",
  "work              list projects",
  "work <n|slug>     open a case study",
  "skybox            show the active skybox",
  "skybox --skybox=<name>   switch it",
  "contact           email the studio",
  "clear             clear this log",
].join("\n");

function isSkyboxName(v: string): v is SkyboxName {
  return (SKYBOXES as readonly string[]).includes(v);
}

export default function TerminalCLI() {
  const { active, setSkybox } = useSkybox();
  const router = useTransitionRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const cmdHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const print = (kind: Line["kind"], text: string) => {
    setLines((prev) => [...prev, { kind, text }]);
    // Auto-scroll the bounded log to its latest line, same idea as any
    // real terminal — runs after the DOM actually has the new line.
    requestAnimationFrame(() => {
      const el = outputRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const run = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    print("input", trimmed);
    cmdHistoryRef.current.push(trimmed);
    historyIndexRef.current = null;

    // `--skybox=name` also works as a bare command on its own, matching
    // the footer flag's own look — not just as an argument to `skybox`.
    const flagMatch = trimmed.match(/^(?:skybox\s+)?--skybox=(\S+)$/i);
    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ");

    if (flagMatch) {
      const name = flagMatch[1].toLowerCase();
      if (isSkyboxName(name)) {
        setSkybox(name);
        print("output", `--skybox=${name}`);
      } else {
        print("error", `unknown skybox '${name}'. try: ${SKYBOXES.join(", ")}`);
      }
      return;
    }

    switch (cmd.toLowerCase()) {
      case "help":
        print("output", HELP_TEXT);
        break;

      case "work": {
        if (!arg) {
          print(
            "output",
            PROJECTS.map((p, i) => `${i + 1}. ${p.name} (${p.slug})`).join("\n"),
          );
          break;
        }
        const byIndex = PROJECTS[Number(arg) - 1];
        const bySlug = PROJECTS.find((p) => p.slug === arg || p.name.toLowerCase() === arg.toLowerCase());
        const project = byIndex ?? bySlug;
        if (!project) {
          print("error", `no project matching '${arg}' — try 'work' to list them`);
          break;
        }
        print("output", `opening ${project.slug}...`);
        router.push(`/work/${project.slug}`);
        break;
      }

      case "skybox":
        print("output", `--skybox=${active} (available: ${SKYBOXES.join(", ")})`);
        break;

      case "contact":
        print("output", "opening mail client...");
        window.location.href = "mailto:contact@voltairstudio.com";
        break;

      case "clear":
        setLines([]);
        return; // nothing to print after clearing

      default:
        print("error", `command not found: ${cmd} — try 'help'`);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
      return;
    }
    // Arrow-key history recall, most-recent first — standard shell feel.
    const hist = cmdHistoryRef.current;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hist.length === 0) return;
      const next = historyIndexRef.current === null ? hist.length - 1 : Math.max(0, historyIndexRef.current - 1);
      historyIndexRef.current = next;
      setValue(hist[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndexRef.current === null) return;
      const next = historyIndexRef.current + 1;
      if (next >= hist.length) {
        historyIndexRef.current = null;
        setValue("");
      } else {
        historyIndexRef.current = next;
        setValue(hist[next]);
      }
    }
  };

  return (
    <div className="cli" onClick={() => inputRef.current?.focus()}>
      {lines.length > 0 && (
        <div className="cli-output" ref={outputRef} role="log" aria-live="polite">
          {lines.map((line, i) => (
            <div key={i} className={`cli-line cli-line-${line.kind}`}>
              {line.kind === "input" ? `$ ${line.text}` : line.text}
            </div>
          ))}
        </div>
      )}
      <div className="cli-prompt">
        <span className="cli-prefix" aria-hidden="true">
          $
        </span>
        <input
          ref={inputRef}
          className="cli-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ width: `${Math.max(1, value.length + 1)}ch` }}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command input — type 'help' for a list of commands"
        />
        <span className="cursor cli-cursor" aria-hidden="true">
          ▌
        </span>
      </div>
    </div>
  );
}
