"use client"
import { useParams } from "next/navigation"

export default function CanvasPage() {
  const { roomId } = useParams()

  return (
    <div className="flex min-h-svh items-center justify-center">
      <h1 className="text-2xl font-bold">Room: {roomId}</h1>
    </div>
  )
}