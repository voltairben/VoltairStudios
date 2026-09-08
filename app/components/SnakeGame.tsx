"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAudio } from "./audio-context";

// `snake` — a hidden terminal easter egg (direct request: not in
// COMMANDS/help/Tab-complete at all — see TerminalInput.tsx's own
// comment on the "snake" case; discoverable only via a hover-tooltip
// on the headline's blinking cursor). Full playable game: real
// movement, food, growing tail, collision, score, restart — this is
// the one command that genuinely needed its own state machine rather
// than a plain command-and-response.
const COLS = 20;
const ROWS = 10;
const TICK_MS = 150;

type Point = { x: number; y: number };

const KEY_DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
};

function initialSnake(): Point[] {
  const cy = Math.floor(ROWS / 2);
  const cx = Math.floor(COLS / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

// Picks uniformly among every real empty cell, not repeated random
// guesses — correct regardless of how much of the board the snake
// already fills, not just "usually fine" at low fill ratios.
function randomEmptyCell(occupied: Point[]): Point {
  const empties: Point[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!occupied.some((p) => p.x === x && p.y === y)) empties.push({ x, y });
    }
  }
  return empties[Math.floor(Math.random() * empties.length)];
}

export default function SnakeGame({ onExit }: { onExit: () => void }) {
  const { playClick, playThud } = useAudio();
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Point>(() => randomEmptyCell(initialSnake()));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  // Only the FIRST direction change in a given tick takes effect —
  // without this, two key presses landing in the same ~150ms window
  // (e.g. Down then Left, both valid on their own) could compound into
  // an effective 180° reversal the player never actually chose,
  // running the snake straight into its own neck.
  const turnedThisTickRef = useRef(false);

  const restart = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    setFood(randomEmptyCell(s));
    setScore(0);
    setGameOver(false);
    directionRef.current = { x: 1, y: 0 };
  }, []);

  // Game loop — a fixed-tick interval, not requestAnimationFrame: this
  // is a discrete-step grid game (classic Snake ticks, not continuous
  // motion), so a plain setInterval matches the real model instead of
  // hand-throttling rAF to the same effect. Reads `food` from the
  // closure and lists it as a dependency — the interval gets torn down
  // and recreated on every food-eat rather than reading a ref for it,
  // a deliberately simpler trade: interval churn on eating food is
  // free-cheap, a second ref-vs-state sync mechanism isn't.
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      turnedThisTickRef.current = false;
      setSnake((prev) => {
        const dir = directionRef.current;
        const head = prev[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };
        const ateFood = newHead.x === food.x && newHead.y === food.y;

        const hitWall = newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS;
        // The tail cell is about to vacate this tick (it doesn't when
        // food is eaten — the snake grows instead), so colliding with
        // it specifically isn't a real self-collision.
        const bodyToCheck = ateFood ? prev : prev.slice(0, -1);
        const hitSelf = bodyToCheck.some((p) => p.x === newHead.x && p.y === newHead.y);

        if (hitWall || hitSelf) {
          playThud();
          setGameOver(true);
          return prev; // freeze in place at the moment of collision
        }

        const nextSnake = ateFood ? [newHead, ...prev] : [newHead, ...prev.slice(0, -1)];
        if (ateFood) {
          playClick();
          setScore((s) => s + 1);
          setFood(randomEmptyCell(nextSnake));
        }
        return nextSnake;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [gameOver, food, playClick, playThud]);

  // Keyboard — window-level, not TerminalInput's own handleKeyDown:
  // this game owns all keyboard input while active. TerminalInput
  // blurs its own input and short-circuits its handleKeyDown entirely
  // whenever snake is active (see its own "snake" case comment) —
  // together, WASD/arrows never reach the history-navigation logic
  // that would otherwise fire on ArrowUp/ArrowDown. Same one-tick
  // defer as MatrixOverlay's own dismiss listener, for the same
  // reason: the Enter keystroke that ran `snake` is still bubbling up
  // the real DOM when this effect first runs.
  useEffect(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      if (gameOver) {
        restart(); // any other key restarts, matching `matrix`'s own "any key" convention
        return;
      }
      const next = KEY_DIRECTIONS[e.key];
      if (!next) return;
      e.preventDefault();
      if (turnedThisTickRef.current) return;
      const cur = directionRef.current;
      const isOpposite = next.x === -cur.x && next.y === -cur.y;
      const isSame = next.x === cur.x && next.y === cur.y;
      if (isOpposite || isSame) return; // can't reverse into your own neck; holding a direction isn't a new "turn"
      directionRef.current = next;
      turnedThisTickRef.current = true;
      playClick();
    }
    const attachTimer = setTimeout(() => window.addEventListener("keydown", onKey), 0);
    return () => {
      clearTimeout(attachTimer);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, onExit, restart]);

  return createPortal(
    <div className="snake-overlay" role="dialog" aria-label="Snake">
      <div className="snake-hud">
        <span>SCORE: {score}</span>
        <span>ESC to quit</span>
      </div>
      <div
        className="snake-grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const x = i % COLS;
          const y = Math.floor(i / COLS);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          const cls = isHead
            ? "snake-cell snake-cell-head"
            : isBody
              ? "snake-cell snake-cell-body"
              : isFood
                ? "snake-cell snake-cell-food"
                : "snake-cell";
          return <span key={i} className={cls} />;
        })}
      </div>
      {gameOver && (
        <div className="snake-gameover">
          <p>GAME OVER — SCORE: {score}</p>
          <p>press any key to restart · esc to quit</p>
        </div>
      )}
    </div>,
    document.body,
  );
}
