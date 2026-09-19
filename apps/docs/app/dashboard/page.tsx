"use client"
import {useRouter} from "next/navigation"
import axios from "axios"
import { HTTP_BACKEND } from "@/lib/config"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function Dashboard() {

    const [roomName , setRoomName] = useState("");
    const [error, setError] = useState("")
    const router  = useRouter();

    async function createRoom(){
        setError("")

        try{
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${HTTP_BACKEND}/room` , 
                {name:roomName},
                {headers:{Authorization: token ?? ""}}
            )

            console.log("room created:" , res.data);
            router.push(`/canvas/${res.data.roomId}`)

        } catch(err:any){
            setError(err.response?.data?.message || "Something went wrong")

        }
    }

    

  return (
    <div className="flex min-h-svh items-center justify-center">

      <h1 className="text-2xl font-bold">Your rooms</h1>
      <Input 
      className="max-w-sm"
      placeholder="Room name (6-20 characters)"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}/>

      <Button onClick={createRoom}>
        Create room
      </Button>
    {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}