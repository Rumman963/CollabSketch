import { LoginForm } from "@/components/login-form"
import Logo from "@/components/ui/logo"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="justify-center items-center">
     <Logo/>
      </div>
      <br/>
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>

    </div>
  )
}
