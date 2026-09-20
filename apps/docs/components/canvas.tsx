"use client"
import { Toolbar, type Tool } from "@/components/toolbar"
import { useEffect, useRef, useState } from "react"
import { Trash2 } from "lucide-react"
import {Button} from "@/components/ui/button"
import {WS_BACKEND} from "@/lib/config"


type Shape =
  | { type: "rect"; x: number; y: number; w: number; h: number }
  | { type: "circle"; x: number; y: number; radius: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { type: "arrow"; x1: number; y1: number; x2: number; y2: number }
  | { type: "diamond"; x: number; y: number; w: number; h: number }
  | { type: "pencil"; points: { x: number; y: number }[] }
  | { type: "text"; x: number; y: number; w: number; h: number; text: string }


// build a shape from the start point and the current mouse point
function makeShape(tool: Tool, x1: number, y1: number, x2: number, y2: number): Shape {
  if (tool === "circle") {
    return { type: "circle", x: x1, y: y1, radius: Math.hypot(x2 - x1, y2 - y1) }
  }


  if (tool === "line") {
  return { type: "line", x1, y1, x2, y2 }
}
if (tool === "arrow") {
  return { type: "arrow", x1, y1, x2, y2 }
}
if (tool === "diamond") {
  return { type: "diamond", x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}




  return { type: "rect", x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  text.split("\n").forEach((paragraph) => {
    let line = ""
    paragraph.split(" ").forEach((word) => {
      const test = line ? line + " " + word : word
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = test
      }
    })
    lines.push(line)
  })
  return lines
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
  if (s.type === "line") {
  ctx.beginPath()
  ctx.moveTo(s.x1, s.y1)
  ctx.lineTo(s.x2, s.y2)
  ctx.stroke()
}
if (s.type === "arrow") {
  const angle = Math.atan2(s.y2 - s.y1, s.x2 - s.x1)
  const head = 15


  ctx.beginPath()
  // the main line
  ctx.moveTo(s.x1, s.y1)
  ctx.lineTo(s.x2, s.y2)
  // first side of the arrowhead
  ctx.moveTo(s.x2, s.y2)
  ctx.lineTo(
    s.x2 - head * Math.cos(angle - Math.PI / 6),
    s.y2 - head * Math.sin(angle - Math.PI / 6)
  )
  // second side of the arrowhead
  ctx.moveTo(s.x2, s.y2)
  ctx.lineTo(
    s.x2 - head * Math.cos(angle + Math.PI / 6),
    s.y2 - head * Math.sin(angle + Math.PI / 6)
  )
  ctx.stroke()
}
if (s.type === "diamond") {
  const cx = s.x + s.w / 2   // middle of the width
  const cy = s.y + s.h / 2   // middle of the height


  ctx.beginPath()
  ctx.moveTo(cx, s.y)           // top point
  ctx.lineTo(s.x + s.w, cy)     // right point
  ctx.lineTo(cx, s.y + s.h)     // bottom point
  ctx.lineTo(s.x, cy)           // left point
  ctx.closePath()               // line back to the top
  ctx.stroke()
}
if (s.type === "pencil") {
  if (s.points.length < 2) return
  const firstPoint = s.points[0]
  if (!firstPoint) return
  ctx.beginPath()
  ctx.moveTo(firstPoint.x, firstPoint.y)
  s.points.forEach((p) => ctx.lineTo(p.x, p.y))
  ctx.stroke()
}
  
if (s.type === "text") {
  ctx.font = "20px sans-serif"
  ctx.fillStyle = "black"
  ctx.textBaseline = "top"
  wrapText(ctx, s.text, s.w).forEach((line, i) => {
    ctx.fillText(line, s.x, s.y + i * 24)
  })
}
}

// how far the point (px, py) is from the line segment (x1,y1) to (x2,y2)
function distToSegment(
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number
) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq
  t = Math.max(0, Math.min(1, t)) // keep the closest point on the segment
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

// is the point (x, y) touching this shape's outline?
function isHit(s: Shape, x: number, y: number): boolean {
  const tol = 8 // how close (in pixels) counts as touching

  if (s.type === "line" || s.type === "arrow") {
    return distToSegment(x, y, s.x1, s.y1, s.x2, s.y2) < tol
  }

  if (s.type === "rect") {
    const x2 = s.x + s.w
    const y2 = s.y + s.h
    return (
      distToSegment(x, y, s.x, s.y, x2, s.y) < tol ||
      distToSegment(x, y, x2, s.y, x2, y2) < tol ||
      distToSegment(x, y, x2, y2, s.x, y2) < tol ||
      distToSegment(x, y, s.x, y2, s.x, s.y) < tol
    )
  }

  if (s.type === "diamond") {
    const cx = s.x + s.w / 2
    const cy = s.y + s.h / 2
    const pts = [
      [cx, s.y],
      [s.x + s.w, cy],
      [cx, s.y + s.h],
      [s.x, cy],
    ]
    return pts.some((p, i) => {
      const n = pts[(i + 1) % 4]!
      return distToSegment(x, y, p[0]!, p[1]!, n[0]!, n[1]!) < tol
    })
  }

  if (s.type === "circle") {
    return Math.abs(Math.hypot(x - s.x, y - s.y) - s.radius) < tol
  }

  if (s.type === "pencil") {
    return s.points.some(
      (p, i) =>
        i > 0 &&
        distToSegment(x, y, s.points[i - 1]!.x, s.points[i - 1]!.y, p.x, p.y) < tol
    )
  }

  if (s.type === "text") {
  const w = s.text.length * 11 // rough width of 20px text
  return x > s.x && x < s.x + w && y > s.y && y < s.y + 24
}

  return false
}


const drawableTools = ["rect", "circle", "line" , "arrow" ,"diamond" , "pencil"]
const STORAGE_KEY = "collabsketch-solo-shapes"


export function Canvas({ roomId }: { roomId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shapesRef = useRef<Shape[]>([])
  const toolRef = useRef<Tool>("rect")
  const offsetRef = useRef({ x: 0, y: 0 })
  const clearRef = useRef<() => void>(() => {})
  const wsRef = useRef<WebSocket | null>(null)
  const [tool, setTool] = useState<Tool>("rect")


  function chooseTool(t: Tool) {
    toolRef.current = t 
    setTool(t)    
    if (canvasRef.current) {
    canvasRef.current.style.cursor = t === "hand" ? "grab" : "crosshair"
  }      
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
      ctx.save() 
      ctx.translate(offsetRef.current.x, offsetRef.current.y) 
      ctx.strokeStyle = "black"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      shapesRef.current.forEach((s) => drawShape(ctx, s))
      if (preview) drawShape(ctx, preview)
         ctx.restore()   
    }

   if (!roomId) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) shapesRef.current = JSON.parse(saved)
  } catch (e) {
    console.log("could not load saved shapes", e)
    }
}
    redraw()

    const save = () => {
    if (!roomId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shapesRef.current))
  }
}

const sendShape = (shape: Shape) => {
  const ws = wsRef.current
  if (!roomId || !ws || ws.readyState !== WebSocket.OPEN) return
  ws.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify(shape),
    })
  )
}

let erasing = false

const eraseAt = (x: number, y: number) => {
  const before = shapesRef.current.length
  shapesRef.current = shapesRef.current.filter((s) => !isHit(s, x, y))
  if (shapesRef.current.length !== before) {
    save()
    redraw()
  }
}

clearRef.current = () => {
  shapesRef.current = []
  save()
  redraw()
}

// mouse down: create the box at the click point, with no size yet
const startTextBox = (x: number, y: number) => {
  // finish any text box that's still open
  document
    .querySelectorAll(".canvas-text-input")
    .forEach((el) => (el as HTMLElement).blur())

  const box = document.createElement("textarea")
  box.className = "canvas-text-input"
  Object.assign(box.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: "0px",
    height: "0px",
    font: "20px sans-serif",
    lineHeight: "24px",
    color: "black",
    padding: "0",
    margin: "0",
    border: "none",
    outline: "1px solid black",
    background: "transparent",
    resize: "none",
    overflow: "hidden",
    zIndex: "20",
    pointerEvents: "none", // so the canvas keeps getting mouse events while dragging
  })
  document.body.appendChild(box)

  textBox = box
  textStartX = x
  textStartY = y
  sizingText = true
}

// mouse move: stretch the box to follow the mouse
const sizeTextBox = (mx: number, my: number) => {
  if (!textBox) return
  textBox.style.left = `${Math.min(textStartX, mx)}px`
  textBox.style.top = `${Math.min(textStartY, my)}px`
  textBox.style.width = `${Math.abs(mx - textStartX)}px`
  textBox.style.height = `${Math.abs(my - textStartY)}px`
}

// mouse up: lock in the size and let the user type
const activateTextBox = (mx: number, my: number) => {
  const box = textBox
  if (!box) return
  sizingText = false
  textBox = null

  const x = Math.min(textStartX, mx)
  const y = Math.min(textStartY, my)
  let w = Math.abs(mx - textStartX)
  let h = Math.abs(my - textStartY)
  if (w < 40) w = 200 // just a click: use a default size
  if (h < 30) h = 30

  box.style.left = `${x}px`
  box.style.top = `${y}px`
  box.style.width = `${w}px`
  box.style.height = `${h}px`
  box.style.pointerEvents = "auto"
  setTimeout(() => box.focus(), 0)

  let done = false
  const finish = () => {
    if (done) return
    done = true
    const text = box.value.trim()
    if (text) {
       const shape: Shape = {
        type: "text",
        x: x - offsetRef.current.x,
        y: y - offsetRef.current.y,
        w,
        h: Math.max(h, box.scrollHeight),
        text,
      }
      shapesRef.current.push(shape)
      save()
      sendShape(shape)
      redraw()
    }
    box.remove()
  }

  // grow the box if the text gets longer than it
  box.addEventListener("input", () => {
    box.style.height = "auto"
    box.style.height = `${Math.max(h, box.scrollHeight)}px`
  })

  box.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault()
      finish()
    }
    if (ev.key === "Escape") {
      done = true
      box.remove()
    }
  })
  box.addEventListener("blur", finish)
}


    let drawing = false
    let panning = false
    let panStartX = 0
    let panStartY = 0
    let panOriginX = 0
    let panOriginY = 0
    let textBox: HTMLTextAreaElement | null = null
    let textStartX = 0
    let textStartY = 0
    let sizingText = false
    let startX = 0
    let startY = 0

    const worldX = (e: MouseEvent) => e.clientX - offsetRef.current.x
    const worldY = (e: MouseEvent) => e.clientY - offsetRef.current.y


    let pencilPoints: { x: number; y: number }[] = []
     
    const onMouseDown = (e: MouseEvent) => {
    if (toolRef.current === "hand") {
    panning = true
    panStartX = e.clientX
    panStartY = e.clientY
    panOriginX = offsetRef.current.x
    panOriginY = offsetRef.current.y
    canvas.style.cursor = "grabbing"
    return
  }

    if (toolRef.current === "text") {
    e.preventDefault()
    startTextBox(e.clientX, e.clientY)
    return
  }    
     if (toolRef.current === "eraser") {    
    erasing = true                          
    eraseAt(e.clientX, e.clientY)           
    return                                  
      }     
    if (!drawableTools.includes(toolRef.current)) return
    drawing = true
    startX = worldX(e)
    startY = worldY(e)
    pencilPoints = [{ x:startX, y: startY}] 
    
  }

    const onMouseMove = (e: MouseEvent) => {

    if (panning) {
    offsetRef.current = {
      x: panOriginX + (e.clientX - panStartX),
      y: panOriginY + (e.clientY - panStartY),
    }
    redraw()
    return
  }    

    if (sizingText) {
    sizeTextBox(e.clientX, e.clientY)
    return
  }

    if (erasing) {                          
    eraseAt(worldX(e), worldY(e))           
    return                                  
  }

      if (!drawing) return


      if (toolRef.current === "pencil") {
    pencilPoints.push({ x:worldX(e) , y: worldY(e) })
    redraw({ type: "pencil", points: pencilPoints })
    return
  }
      redraw(makeShape(toolRef.current, startX, startY, worldX(e), worldY(e)))
    }


    const onMouseUp = (e: MouseEvent) => {

     if (panning) {
    panning = false
    canvas.style.cursor = "grab"
    return
  }

        if (sizingText) {
    activateTextBox(e.clientX, e.clientY)
    return
  }
        erasing = false 
      if (!drawing) return
      drawing = false
    
    if (Math.abs(worldX(e) - startX) < 3 && Math.abs(worldY(e) - startY) < 3) {
    redraw()
    return
  }


    if (toolRef.current === "pencil") {
    const shape: Shape = { type: "pencil", points: pencilPoints }
    shapesRef.current.push(shape)
  
    save()
    sendShape(shape)
    redraw()
    return
  }


      const shape = makeShape(toolRef.current, startX, startY, worldX(e), worldY(e))
      shapesRef.current.push(shape)
      save()
      sendShape(shape)
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
  }, [roomId])

  useEffect(()=>{
    if(!roomId) return //solo mode:no server
    const token = localStorage.getItem("token")
    if(!token){
      console.log("no token , please log in")
      return
    }

    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`)
    wsRef.current=ws
   
    ws.onopen = () => { 
      console.log("ws connected")
      ws.send(JSON.stringify({ type: "join_room", roomId }))
    }

    ws.onmessage = (event)  => console.log("ws message")
    ws.onerror = (err) => console.log("ws error:" , err)
    ws.onclose = () =>console.log("ws closed")


    return () => {
      ws.close()
      wsRef.current = null
    }

  },[roomId])


  return (
    <>


    <Toolbar tool={tool} onChange={chooseTool} />
    <Button
    variant="outline"
    className="fixed right-4 top-4 z-10 bg-white shadow-lg"
    onClick={() => {
    if (window.confirm("Clear the whole canvas?")) clearRef.current()
  }}
>
  <Trash2 className="size-4" />
  Clear
</Button>
      <canvas ref={canvasRef} className="block bg-white cursor-crosshair" />
    </>
  )
}