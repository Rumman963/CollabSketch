"use client"
import {
  Hand,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Eraser,
} from "lucide-react"

export type Tool =
  | "hand"
  | "select"
  | "rect"
  | "diamond"
  | "circle"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "eraser"

const tools = [
  { id: "hand", icon: Hand, label: "Hand", key: "H" },
  { id: "rect", icon: Square, label: "Rectangle", key: "R" },
  { id: "diamond", icon: Diamond, label: "Diamond", key: "D" },
  { id: "circle", icon: Circle, label: "Circle", key: "O" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", key: "A" },
  { id: "line", icon: Minus, label: "Line", key: "L" },
  { id: "pencil", icon: Pencil, label: "Pencil", key: "P" },
  { id: "text", icon: Type, label: "Text", key: "T" },
  { id: "eraser", icon: Eraser, label: "Eraser", key: "E" },
] as const

export function Toolbar({
  tool,
  onChange,
}: {
  tool: Tool
  onChange: (t: Tool) => void
}) {
  return (
    <div className="fixed left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
      {tools.map(({ id, icon: Icon, label, key }) => (
        <button
          key={id}
          title={`${label} - ${key}`}
          onClick={() => onChange(id)}
          className={`relative flex size-10 items-center justify-center rounded-lg transition ${
            tool === id
              ? "bg-violet-100 text-violet-700"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          <Icon className="size-5" />
          <span className="absolute bottom-0.5 right-1 text-[9px] text-neutral-400">
            {key}
          </span>
        </button>
      ))}
    </div>
  )
}