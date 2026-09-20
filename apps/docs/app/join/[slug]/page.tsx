"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { HTTP_BACKEND } from "@/lib/config"
import { Button } from "@/components/ui/button"

export default function JoinPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")

    // not logged in: go to login and remember where to come back to
    if (!token) {
      localStorage.setItem("redirectAfterLogin", `/join/${slug}`)
      router.replace("/login")
      return
    }

    axios
      .get(`${HTTP_BACKEND}/room/${slug}`, {
        headers: { Authorization: token },
      })
      .then((res) => router.replace(`/canvas/${res.data.roomId}`))
      .catch((err) => {
        const status = err.response?.status

        // token missing, wrong, or expired: treat as logged out
        if (status === 401 || status === 403) {
          localStorage.removeItem("token")
          localStorage.setItem("redirectAfterLogin", `/join/${slug}`)
          router.replace("/login")
          return
        }

        setError(err.response?.data?.message || "Something went wrong")
      })
  }, [slug])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      {error ? (
        <>
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Go to dashboard
          </Button>
        </>
      ) : (
        <p className="text-muted-foreground">Joining room...</p>
      )}
    </div>
  )
}