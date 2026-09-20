"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ArrowLeft, PenTool, Users } from "lucide-react"
import { HTTP_BACKEND } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FlickeringGrid } from "@/components/ui/flickering-grid"

export default function Dashboard() {
  const router = useRouter()
  const [view, setView] = useState<"choose" | "collab">("choose")
  const [roomName, setRoomName] = useState("")
  const [error, setError] = useState("")
  const [joinName, setJoinName] = useState("")
   

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
    }
  }, [])

  async function createRoom() {
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomName },
        { headers: { Authorization: token ?? "" } }
      )
      router.push(`/canvas/${res.data.roomId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  }


  async function joinRoom(){
    setError("")
    try{
      const token = localStorage.getItem("token")
      const res = await axios.get(
        `${HTTP_BACKEND}/room/${encodeURIComponent(joinName)}`,
        {headers:
          
          {
            Authorization:token ?? ""
          }

        }
      )
        router.push(`/canvas/${res.data.roomId}`)
      
    }catch(err:any){
      setError(err.response?.data?.message || "Something went wrong")
    }
  }

  // screen 2: room options for Collab Mode
  
  if (view === "collab") {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm space-y-4">
        <Button variant="ghost" onClick={() => setView("choose")}>
          <ArrowLeft /> Back
        </Button>
        <h1 className="text-2xl font-bold">Collab Mode</h1>

        <div className="space-y-2">
          <h2 className="font-semibold">Create a room</h2>
          <Input
            placeholder="Room name (6-20 characters)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button className="w-full" onClick={createRoom}>
            Create room
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          <h2 className="font-semibold">Join a room</h2>
          <Input
            placeholder="Room name"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
          />
          <Button variant="outline" className="w-full" onClick={joinRoom}>
            Join room
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}

  // screen 1: choose a mode
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 bg-muted p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">How do you want to draw?</h1>
        <p className="mt-2 text-muted-foreground">Pick a mode to get started</p>
      </div>

      <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
        <Card
          className="cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
          onClick={() => router.push("/canvas/solo")}
        >
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-violet-100 p-4">
              <PenTool className="size-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Single Mode</h2>
            <p className="text-sm text-muted-foreground">
              Draw shapes, add text and icons on your own.
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
          onClick={() => setView("collab")}
        >
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-emerald-100 p-4">
              <Users className="size-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold">Collab Mode</h2>
            <p className="text-sm text-muted-foreground">
              Create or join a room and draw together live.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}