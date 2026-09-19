"use client"
import { useParams } from "next/navigation"
import {Canvas} from "@/components/canvas"

export default function CanvasPage() {
  const { roomId } = useParams<{ roomId: string }>()

  return <Canvas roomId={roomId} />
}