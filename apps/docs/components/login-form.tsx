"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/lib/config";
import { cn } from "cn"
import { SigninSchema } from "@repo/common"
import Link from "next/link";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Preview from "./preview"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
   
  const router = useRouter();
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error , setError] = useState("");
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault()
    setError("")
  
  const result  = SigninSchema.safeParse({email , password})
  if(!result.success){
    setError("please enter a valid email")
    return
  }

  setLoading(true)
  try{
   const res =  await axios.post(`${HTTP_BACKEND}/signin` , {
      email,
      password
    })

     localStorage.setItem("token", res.data.token)
     router.push("/dashboard")
  }
  catch(err:any){
    setError(err.response?.data?.message || "Something went wrong")
  }
  finally {
      setLoading(false)
    }
  } 

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-neutral-100">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your CollabSketch account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  placeholder="rumman675@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 required />
              </Field>
              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
              <Field>
                <Button type="submit" disabled={loading} >
                  {loading ? "logging in..." :"login"}
                  </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href ="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
             <Preview/>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
