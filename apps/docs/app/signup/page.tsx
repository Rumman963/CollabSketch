"use client"
import { SignupForm } from "@/components/signup-form"
import {Logo} from "@/components/ui/logo"
import { FlickeringGrid } from "@/components/ui/flickering-grid"


export default function SignupPage() {
  

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-muted p-6 md:p-10">
      <FlickeringGrid 
      className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.3}
        flickerChance={0.1}
      />
      <div className="justify-center items-center">
        <Logo/>
      </div>
      <div className="w-full max-w-sm md:max-w-4xl relative z-10">
        <SignupForm />
         
      </div>



    </div>
  )
}
