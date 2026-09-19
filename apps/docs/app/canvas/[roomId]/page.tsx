"use client"
import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type Tool = "rect" | "circle"

type Shape =
  | { type: "rect"; x: number; y: number; w: number; h: number }
  | { type: "circle"; x: number; y: number; radius: number }

// build a shape from the start point and the current mouse point
function makeShape(tool: Tool, x1: number, y1: number, x2: number, y2: number): Shape {
  if (tool === "circle") {
    return { type: "circle", x: x1, y: y1, radius: Math.hypot(x2 - x1, y2 - y1) }
  }
  return { type: "rect", x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}

// draw one shape on the canvas
function drawShape(ctx: CanvasRenderingContext2D, s: Shape) {
  if (s.type === "rect") {
    ctx.strokeRect(s.x, s.y, s.w, s.h)
  }
  if (s.type === "circle") {
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
    ctx.stroke()
  }
}

export default function CanvasPage() {
  const { roomId } = useParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shapesRef = useRef<Shape[]>([])
  const toolRef = useRef<Tool>("rect")
  const [tool, setTool] = useState<Tool>("rect")

  function chooseTool(t: Tool) {
    toolRef.current = t // the mouse code reads this one
    setTool(t)          // this one updates the buttons
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const redraw = (preview?: Shape) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "black"
      ctx.lineWidth = 2
      shapesRef.current.forEach((s) => drawShape(ctx, s))
      if (preview) drawShape(ctx, preview)
    }

    let drawing = false
    let startX = 0
    let startY = 0

    const onMouseDown = (e: MouseEvent) => {
      drawing = true
      startX = e.clientX
      startY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!drawing) return
      redraw(makeShape(toolRef.current, startX, startY, e.clientX, e.clientY))
    }

    const onMouseUp = (e: MouseEvent) => {
      if (!drawing) return
      drawing = false
      shapesRef.current.push(
        makeShape(toolRef.current, startX, startY, e.clientX, e.clientY)
      )
      redraw()
    }

    canvas.addEventListener("mousedown", onMouseDown)
    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mouseup", onMouseUp)

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  return (
    <>
      <div className="fixed top-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-lg bg-white p-2 shadow">
        <Button
          variant={tool === "rect" ? "default" : "outline"}
          onClick={() => chooseTool("rect")}
        >
          Rectangle
        </Button>
        <Button
          variant={tool === "circle" ? "default" : "outline"}
          onClick={() => chooseTool("circle")}
        >
          Circle
        </Button>
      </div>

      <canvas ref={canvasRef} className="block bg-white" />
    </>
  )
}