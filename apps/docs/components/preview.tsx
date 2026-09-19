"use client";

import * as React from "react";

export interface Collaborator {
  name: string;
  color: string;
  /** Position as a percentage of the canvas, 0-100. */
  top: number;
  left: number;
  /** "drift1" | "drift2" | "join" — which motion this cursor uses. */
  motion?: "drift1" | "drift2" | "join";
  /** Animation delay in seconds, mainly used for the "join" motion. */
  delay?: number;
}

export interface AuthCanvasPreviewProps {
  className?: string;
  /** Fixed lead-in text before the rotating word. */
  taglinePrefix?: string;
  /** Words that rotate at the end of the tagline. */
  words?: { text: string; color: string }[];
  /** Collaborator cursors shown on the canvas. */
  collaborators?: Collaborator[];
}

const DEFAULT_WORDS = [
  { text: "sketch", color: "var(--cs-accent, #7F77DD)" },
  { text: "brainstorm", color: "#1D9E75" },
  { text: "iterate", color: "#D85A30" },
  { text: "ship fast", color: "#D4537E" },
];

const DEFAULT_COLLABORATORS: Collaborator[] = [
  { name: "Priya", color: "#D4537E", top: 19, left: 39, motion: "drift1" },
  { name: "Devon", color: "#1D9E75", top: 47, left: 68, motion: "drift2" },
  { name: "You joined", color: "#7F77DD", top: 72, left: 16, motion: "join", delay: 5.2 },
];

/**
 * Animated hero panel for the auth screen's side image slot.
 * A canvas of shapes draws itself in, a few collaborator cursors
 * drift around, and a tagline rotates through value props below.
 *
 * Fully respects prefers-reduced-motion: falls back to a static
 * frame with the first word shown and no motion.
 *
 * Usage:
 *   <AuthCanvasPreview />
 *   <AuthCanvasPreview
 *     taglinePrefix="Built for teams who"
 *     words={[{ text: "design", color: "#7F77DD" }]}
 *   />
 */
export function Preview({
  className,
  taglinePrefix = "Built for teams who",
  words = DEFAULT_WORDS,
  collaborators = DEFAULT_COLLABORATORS,
}: AuthCanvasPreviewProps) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (words.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, 2200);

    return () => clearInterval(interval);
  }, [words.length]);

  const activeWord = words[wordIndex] ?? words[0];

  return (
    <div className={`cs-panel ${className ?? ""}`}>
      <style>{`
        .cs-panel {
          background: var(--cs-surface-1, #f4f4f2);
          border-radius: 12px;
          padding: 1rem;
          box-sizing: border-box;
        }
        .cs-canvas {
          position: relative;
          background: var(--cs-surface-2, #ffffff);
          border: 0.5px solid var(--cs-border, #e2e2df);
          border-radius: 8px;
          height: 320px;
          overflow: hidden;
          background-image: radial-gradient(circle, var(--cs-border, #e2e2df) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .cs-shape {
          fill: none;
          stroke-linecap: round;
        }
        .cs-shape-1 { stroke-dasharray: 360; stroke-dashoffset: 360; animation: cs-draw 2.2s ease-out .2s forwards; }
        .cs-shape-2 { stroke-dasharray: 264; stroke-dashoffset: 264; animation: cs-draw 1.8s ease-out 1.6s forwards; }
        .cs-shape-3 { stroke-dasharray: 220; stroke-dashoffset: 220; animation: cs-draw 1.4s ease-out 3.2s forwards; }
        .cs-shape-4 { stroke-dasharray: 280; stroke-dashoffset: 280; animation: cs-draw 1.6s ease-out 4.4s forwards; }
        @keyframes cs-draw { to { stroke-dashoffset: 0; } }

        .cs-cursor {
          position: absolute;
          display: flex;
          align-items: flex-start;
          gap: 4px;
        }
        .cs-cursor-dot {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 6px 9px 0;
          transform: rotate(-15deg);
          margin-top: 2px;
        }
        .cs-cursor-label {
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .cs-motion-drift1 { animation: cs-drift1 4s ease-in-out infinite; }
        .cs-motion-drift2 { animation: cs-drift2 5s ease-in-out infinite; }
        .cs-motion-join { opacity: 0; animation: cs-popin .4s ease-out forwards; }
        @keyframes cs-drift1 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(10px,-8px); } }
        @keyframes cs-drift2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-8px,10px); } }
        @keyframes cs-popin { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: scale(1); } }

        .cs-tagline {
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          color: var(--cs-text-primary, #1a1a18);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        .cs-word-track {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          min-width: 100px;
          text-align: left;
          white-space: nowrap;
        }
        .cs-word {
          display: inline-block;
          transition: opacity 0.3s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-shape-1, .cs-shape-2, .cs-shape-3, .cs-shape-4 {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
          .cs-motion-drift1, .cs-motion-drift2, .cs-motion-join {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .cs-word {
            transition: none !important;
          }
        }
      `}</style>

      <div className="cs-canvas" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 440 320" style={{ position: "absolute", top: 0, left: 0 }}>
          <rect className="cs-shape cs-shape-1" x="60" y="50" width="110" height="70" rx="6" stroke="#7F77DD" strokeWidth={3} />
          <circle className="cs-shape cs-shape-2" cx="290" cy="90" r="42" stroke="#1D9E75" strokeWidth={3} />
          <path className="cs-shape cs-shape-3" d="M 130 160 Q 220 100 310 170" stroke="#D85A30" strokeWidth={3} />
          <rect className="cs-shape cs-shape-4" x="90" y="200" width="90" height="50" rx="6" stroke="#D4537E" strokeWidth={3} />
        </svg>

        {collaborators.map((c, i) => (
          <div
            key={i}
            className={`cs-cursor ${c.motion ? `cs-motion-${c.motion}` : ""}`}
            style={{
              top: `${c.top}%`,
              left: `${c.left}%`,
              animationDelay: c.motion === "join" ? `${c.delay ?? 0}s` : undefined,
            }}
          >
            <span className="cs-cursor-dot" style={{ borderColor: `transparent ${c.color} ${c.color} transparent` }} />
            <span className="cs-cursor-label" style={{ background: c.color }}>
              {c.name}
            </span>
          </div>
        ))}
      </div>

      <p className="cs-tagline">
        <span>{taglinePrefix}</span>
        <span className="cs-word-track" role="text" aria-label={activeWord?.text}>
          <span
            className="cs-word"
            style={{
              color: activeWord?.color,
              opacity: visible ? 1 : 0,
            }}
          >
            {activeWord?.text}
          </span>
        </span>
      </p>
    </div>
  );
}


export default Preview;