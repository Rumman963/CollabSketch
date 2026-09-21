"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Download,
  Link2,
  PenTool,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react"
import Logo from "@/components/ui/logo"
import { Preview } from "@/components/preview"
import { Button } from "@/components/ui/button"
import { FlickeringGrid } from "@/components/ui/flickering-grid"


const features = [
  {
    icon: Users,
    title: "Draw together, live",
    text: "Everyone in a room sees new shapes the moment they are drawn.",
  },
  {
    icon: PenTool,
    title: "Solo mode",
    text: "No account needed to start. Your drawing is saved in your browser automatically.",
  },
  {
    icon: Link2,
    title: "Invite with a link",
    text: "The room admin copies one link, and friends join in a single click.",
  },
  {
    icon: ShieldCheck,
    title: "Admin controls",
    text: "Only the person who created the room can clear the board for everyone.",
  },
  {
    icon: Download,
    title: "Save as an image",
    text: "Download your canvas as a PNG whenever a sketch is worth keeping.",
  },
  {
    icon: Zap,
    title: "Simple tools",
    text: "Rectangles, circles, diamonds, arrows, lines, pencil, text and an eraser.",
  },
]

const steps = [
  { n: "1", title: "Create a room", text: "Pick a name and you become the room admin." },
  { n: "2", title: "Invite your team", text: "Copy the invite link and send it to anyone." },
  { n: "3", title: "Sketch together", text: "Ideas appear on everyone's canvas as they draw." },
]

export default function Home() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"))
  }, [])

  return (
    <div className="relative min-h-svh bg-[#f6f5f3] text-neutral-900">

      
  
<FlickeringGrid
  className="pointer-events-none fixed inset-0 z-0 size-full"
  squareSize={10}
  gridGap={6}
  color="#6B7280"
  maxOpacity={0.25}
  flickerChance={0.1}
  />
  <div className="relative z-10"></div>
    
      {/* navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          {loggedIn ? (
            <Button onClick={() => router.push("/dashboard")}>
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Log in
              </Button>
              <Button onClick={() => router.push("/signup")}>Get started</Button>
            </>
          )}
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-violet-700">
            <span className="size-1.5 rounded-full bg-violet-500" />
            Real-time collaborative whiteboard
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Sketch ideas{" "}
            <span className="relative inline-block">
              together
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-violet-500"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8 C 45 2, 90 12, 130 6 S 185 4, 198 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            , live.
          </h1>

          <p className="mt-6 max-w-md text-lg text-neutral-600">
            CollabSketch is a shared canvas for brainstorming. Draw shapes, add
            text, and watch your team&apos;s ideas appear as they happen.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => router.push(loggedIn ? "/dashboard" : "/signup")}
            >
              {loggedIn ? "Open dashboard" : "Create an account"}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white"
              onClick={() => router.push("/canvas/solo")}
            >
              Try solo mode
            </Button>
          </div>
          <p className="mt-3 text-sm text-neutral-500">
            No account needed for solo mode.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-2 shadow-xl shadow-violet-200/50">
          <Preview />
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to think out loud
          </h2>
          <p className="mt-3 text-neutral-600">
            A small, focused set of tools with no clutter.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          How it works
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border-2 border-dashed border-violet-400 bg-white text-lg font-bold text-violet-700">
                {s.n}
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* final call to action */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-neutral-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to sketch something?</h2>
          <p className="mx-auto mt-3 max-w-md text-neutral-300">
            Start on your own, or open a room and invite your team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-violet-500 text-white hover:bg-violet-400"
              onClick={() => router.push(loggedIn ? "/dashboard" : "/signup")}
            >
              {loggedIn ? "Open dashboard" : "Get started"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => router.push("/canvas/solo")}
            >
              Try solo mode
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/60 py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} CollabSketch. Built with Next.js,
        WebSockets and Prisma.
      </footer>
    </div>
  )
}