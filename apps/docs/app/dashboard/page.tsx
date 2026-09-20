"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ArrowLeft,Loader2, LogOut, PenTool, Users } from "lucide-react"
import { HTTP_BACKEND } from "@/lib/config"
import Logo from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { CreateRoomSchema } from "@repo/common/configs"

// dotted paper background that follows the theme text color
const dots = {
  backgroundImage:
    "radial-gradient(color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
}

export default function Dashboard() {
  const router = useRouter()
  const [view, setView] = useState<"choose" | "collab">("choose")
  const [roomName, setRoomName] = useState("")
  const [joinName, setJoinName] = useState("")
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)

  // no token: send the user back to login
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
    }
  }, [])

  function logout() {
    localStorage.removeItem("token")
    router.push("/login")
  }

  function handleError(err: any) {
    const status = err.response?.status
    if (status === 401 || status === 403) {
      logout() // token is missing, wrong, or expired
      return
    }
    setError(err.response?.data?.message || "Something went wrong")
  }

  function authHeaders() {
    return { Authorization: localStorage.getItem("token") ?? "" }
  }

  async function createRoom() {
    setError("")

    const result = CreateRoomSchema.safeParse({ name: roomName })
  if (!result.success) {
    setError(result.error.issues[0]?.message ?? "Invalid room name")
    return
  }
   setCreating(true)
    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: result.data.name },
        { headers: authHeaders() }
      )
      router.push(`/canvas/${res.data.roomId}`)
    } catch (err) {
      handleError(err)
      setCreating(false)
    }
  }

  async function joinRoom() {
    setError("")
    const name = joinName.trim()
    if (!name) {
    setError("Enter the name of the room you want to join")
    return
  }

    try {
      const res = await axios.get(
        `${HTTP_BACKEND}/room/${encodeURIComponent(name)}`,
        { headers: authHeaders() }
      )
      router.push(`/canvas/${res.data.roomId}`)
    } catch (err) {
      handleError(err)
      setJoining(false)
    }
  }

  return (

  <div className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
  <FlickeringGrid
    className="absolute inset-0 z-0 size-full"
    squareSize={4}
    gridGap={6}
    color="#6B7280"
    maxOpacity={0.3}
    flickerChance={0.1}
  />
    
    
    
      {/* top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        <Button variant="ghost" onClick={logout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        {view === "choose" ? (
          <div className="w-full max-w-2xl space-y-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                How do you want to draw?
              </h1>
              <p className="mt-2 text-muted-foreground">
                Pick a mode to get started
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card
                className="cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                onClick={() => router.push("/canvas/solo")}
              >
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <PenTool className="size-8" />
                  </div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Single Mode
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Draw shapes and add text on your own. Saved in your browser.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                onClick={() => setView("collab")}
              >
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <div className="rounded-full bg-primary/10 p-4 text-primary">
                    <Users className="size-8" />
                  </div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Collab Mode
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Create or join a room and draw together live.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-4">
            <Button
              variant="ghost"
              onClick={() => {
                setView("choose")
                setError("")
              }}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>

            <Card>
              <CardContent className="space-y-6 p-6">
                <h1 className="text-2xl font-bold text-card-foreground">
                  Collab Mode
                </h1>

                <div className="space-y-2">
                  <h2 className="font-semibold text-card-foreground">
                    Create a room
                  </h2>
                  <Input
                    placeholder="Room name (6-20 characters)"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />

                <Button className="w-full" onClick={createRoom} disabled={creating || joining}>
                 {creating && <Loader2 className="size-4 animate-spin" />}
                 {creating ? "Creating room..." : "Create room"}
                 </Button> 
                 
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  or
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-semibold text-card-foreground">
                    Join a room
                  </h2>
                  <Input
                    placeholder="Room name"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                  />


                <Button variant="outline" className="w-full" onClick={joinRoom} disabled={creating || joining}>
                {joining && <Loader2 className="size-4 animate-spin" />}
                {joining ? "Joining room..." : "Join room"}
                 </Button>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}