"use client"

import type { ReactNode } from "react"

/* ---------- small helpers that build SVG path strings ---------- */

const rect = (x: number, y: number, w: number, h: number, r = 8) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy}`

const VIOLET = "#7F77DD"
const GREEN = "#1D9E75"
const ORANGE = "#D85A30"
const PINK = "#D4537E"
const INK = "#525252"

/* ---------- what can appear in a scene ---------- */

type Item =
  // a line that draws itself
  | { t: "stroke"; d: string; c: string; w?: number; delay?: number }
  // a solid shape that pops in (transform is optional)
  | { t: "fill"; d: string; c: string; transform?: string; delay?: number }
  // a sticky note
  | { t: "note"; x: number; y: number; rot: number; delay?: number }
  // a round avatar with a letter
  | { t: "avatar"; x: number; y: number; r: number; c: string; letter: string; delay?: number }
  // a dashed empty circle ("invite someone")
  | { t: "ring"; x: number; y: number; r: number; c: string; delay?: number }
  // a collaborator cursor with a name tag
  | { t: "cursor"; x: number; y: number; name: string; c: string; delay?: number }

/* ---------- login scene: a flowchart you can pick back up ---------- */

const LOGIN_SCENE: Item[] = [
  // the board
  { t: "stroke", d: rect(40, 50, 340, 270, 18), c: VIOLET, w: 4, delay: 0 },
  // box -> circle -> diamond
  { t: "stroke", d: rect(64, 100, 70, 56, 8), c: VIOLET, delay: 0.5 },
  { t: "stroke", d: "M134 128 H166 M158 121 L166 128 L158 135", c: INK, delay: 1.0 },
  { t: "stroke", d: circle(200, 128, 30), c: GREEN, delay: 1.2 },
  { t: "stroke", d: "M230 128 H262 M254 121 L262 128 L254 135", c: INK, delay: 1.7 },
  { t: "stroke", d: "M300 94 L334 128 L300 162 L266 128 Z", c: ORANGE, delay: 1.9 },
  // the loop that goes back to the start
  { t: "stroke", d: "M300 168 C300 232 99 232 99 164 M92 174 L99 164 L106 174", c: PINK, delay: 2.4 },
  // a done tick with a couple of lines of notes
  { t: "stroke", d: "M66 270 L82 286 L112 250", c: GREEN, w: 5, delay: 3.0 },
  { t: "stroke", d: "M132 264 H190 M132 282 H168", c: "#a3a3a3", delay: 3.3 },
  { t: "note", x: 252, y: 246, rot: -5, delay: 3.6 },
  // sparkles
  { t: "stroke", d: "M392 22 V46 M380 34 H404", c: ORANGE, delay: 4.0 },
  { t: "stroke", d: "M24 62 V78 M16 70 H32", c: PINK, delay: 4.1 },
  // people working on it
  { t: "cursor", x: 326, y: 178, name: "Priya", c: PINK, delay: 0 },
  { t: "cursor", x: 150, y: 300, name: "Devon", c: GREEN, delay: 1.2 },
]

/* ---------- signup scene: a pencil starting something new ---------- */

const SIGNUP_SCENE: Item[] = [
  // the flourish the pencil is drawing
  { t: "stroke", d: "M36 300 C70 220 110 350 160 270 S225 190 257 150", c: PINK, w: 5, delay: 0.2 },
  // a few shapes floating around
  { t: "stroke", d: "M52 150 L92 150 L72 114 Z", c: GREEN, delay: 1.0 },
  { t: "stroke", d: circle(130, 70, 20), c: ORANGE, delay: 1.4 },
  { t: "stroke", d: "M170 60 q10 -14 20 0 t20 0 t20 0", c: VIOLET, delay: 1.8 },
  { t: "stroke", d: "M384 200 V224 M372 212 H396", c: ORANGE, delay: 2.2 },
  { t: "stroke", d: "M28 220 V236 M20 228 H36", c: VIOLET, delay: 2.4 },
  // the pencil (drawn upright, then tilted)
  { t: "fill", d: rect(-14, -116, 28, 16, 6), c: "#E58BA6", transform: "translate(290 110) rotate(40)", delay: 0 },
  { t: "fill", d: "M-14 -100 H14 V-86 H-14 Z", c: "#B8B8C0", transform: "translate(290 110) rotate(40)", delay: 0 },
  { t: "fill", d: "M-14 -86 H14 V20 H-14 Z", c: "#F5C542", transform: "translate(290 110) rotate(40)", delay: 0 },
  { t: "fill", d: "M-14 20 H14 L0 52 Z", c: "#F2D3A0", transform: "translate(290 110) rotate(40)", delay: 0 },
  { t: "fill", d: "M-4.5 40 H4.5 L0 52 Z", c: "#3f3f46", transform: "translate(290 110) rotate(40)", delay: 0 },
  // people in the room, plus an invite slot
  { t: "avatar", x: 110, y: 350, r: 22, c: PINK, letter: "R", delay: 2.8 },
  { t: "avatar", x: 150, y: 350, r: 22, c: GREEN, letter: "P", delay: 3.0 },
  { t: "avatar", x: 190, y: 350, r: 22, c: ORANGE, letter: "D", delay: 3.2 },
  { t: "ring", x: 240, y: 350, r: 22, c: VIOLET, delay: 3.4 },
  { t: "stroke", d: "M240 340 V360 M230 350 H250", c: VIOLET, delay: 3.6 },
  { t: "cursor", x: 272, y: 316, name: "You joined", c: VIOLET, delay: 0.6 },
]

/* ---------- animation styles (switched off for reduced motion) ---------- */

const styles = `
  .aa-draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: aa-draw 1.4s ease-out forwards;
  }
  @keyframes aa-draw { to { stroke-dashoffset: 0; } }

  .aa-float { animation: aa-float 4s ease-in-out infinite; }
  @keyframes aa-float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(6px, -8px); }
  }

  .aa-pop {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: aa-pop 0.5s ease-out forwards;
  }
  @keyframes aa-pop {
    from { opacity: 0; transform: scale(0.7); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .aa-draw { animation: none; stroke-dashoffset: 0; }
    .aa-float { animation: none; }
    .aa-pop { animation: none; opacity: 1; }
  }
`

/* ---------- draws a scene ---------- */

function Scene({ items }: { items: Item[] }) {
  return (
    <>
      {items.map((it, i) => {
        const delay = { animationDelay: `${it.delay ?? 0}s` }

        if (it.t === "stroke") {
          return (
            <path
              key={i}
              d={it.d}
              pathLength={1}
              className="aa-draw"
              fill="none"
              stroke={it.c}
              strokeWidth={it.w ?? 3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={delay}
            />
          )
        }

        if (it.t === "fill") {
          return (
            <g key={i} transform={it.transform}>
              <path d={it.d} fill={it.c} className="aa-pop" style={delay} />
            </g>
          )
        }

        if (it.t === "note") {
          return (
            <g key={i} transform={`translate(${it.x} ${it.y}) rotate(${it.rot})`}>
              <g className="aa-pop" style={delay}>
                <rect width="104" height="58" rx="4" fill="#FFE58A" />
                <path
                  d="M12 20 H88 M12 32 H72 M12 44 H56"
                  stroke="#B8860B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </g>
            </g>
          )
        }

        if (it.t === "avatar") {
          return (
            <g key={i} className="aa-pop" style={delay}>
              <circle cx={it.x} cy={it.y} r={it.r} fill={it.c} stroke="#fafafa" strokeWidth="3" />
              <text
                x={it.x}
                y={it.y + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="600"
                fill="white"
              >
                {it.letter}
              </text>
            </g>
          )
        }

        if (it.t === "ring") {
          return (
            <circle
              key={i}
              cx={it.x}
              cy={it.y}
              r={it.r}
              fill="none"
              stroke={it.c}
              strokeWidth="2.5"
              strokeDasharray="5 5"
              className="aa-pop"
              style={delay}
            />
          )
        }

        // cursor with a name tag
        const w = it.name.length * 6.5 + 14
        return (
          <g key={i} transform={`translate(${it.x} ${it.y})`}>
            <g className="aa-float" style={delay}>
              <path d="M0 0 L0 18 L5 13.5 L8.5 21 L11.5 19.5 L8 12.5 L15 12.5 Z" fill={it.c} />
              <rect x="12" y="18" width={w} height="19" rx="5" fill={it.c} />
              <text x="19" y="31" fontSize="11" fill="white">
                {it.name}
              </text>
            </g>
          </g>
        )
      })}
    </>
  )
}

/* ---------- the panel that fills the right side of the card ---------- */

function ArtPanel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-neutral-50 px-6 text-neutral-800"
      style={{
        backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <style>{styles}</style>
      <svg
        viewBox="0 0 420 400"
        className="w-full max-w-[290px]"
        role="img"
        aria-label={title}
      >
        {children}
      </svg>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
      </div>
    </div>
  )
}

export function LoginArt() {
  return (
    <ArtPanel
      title="Pick up where you left off"
      subtitle="Your rooms and sketches are waiting for you."
    >
      <Scene items={LOGIN_SCENE} />
    </ArtPanel>
  )
}

export function SignupArt() {
  return (
    <ArtPanel
      title="Start something new"
      subtitle="Make a room, invite your team, and sketch together."
    >
      <Scene items={SIGNUP_SCENE} />
    </ArtPanel>
  )
}