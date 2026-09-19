"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react"


export default function Home() {
  const [count , setcount] = useState(0);

  return(
    <div>

    <div className="p-rounded text-blue-600">
      <Button size="lg" variant="destructive" onClick={()=>{ 
        setcount(c=>c+1)
        
      }}>Click ME</Button>
       <p>Count: {count}</p>  


    </div>
    </div>



  )
  
}
