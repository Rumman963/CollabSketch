import { SignupForm } from "@/components/signup-form"
import {Logo} from "@/components/ui/logo"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="justify-center items-center">
        <Logo/>
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
         
      </div>

    
    

    </div>
  )
}
