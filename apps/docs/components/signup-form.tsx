"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/lib/config";
import { cn } from "cn"
import {Preview} from "@/components/preview"
import { UserSchema } from "@repo/common"

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
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const router = useRouter();
  const [name , setName] = useState("");
  const [email, setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
    e.preventDefault()
    setError("")

    if (password.length < 8) {
    setError("Password must be at least 8 characters")
    return
}

    const result  = UserSchema.safeParse({name, email , password})
    if(!result.success){
    setError("Please check your name and email")
    return
}   

setLoading(true)

  try{
      await axios.post(`${HTTP_BACKEND}/signup` , {name,email,password})
      router.push("/login")
    }catch(err:any){
      setError(err.response?.data?.message || "something went wrong")

    } finally {
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
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your name & email below to create your account
                </p>
              </div>

              <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
              id="name"
              type="text"
              placeholder="Rumman Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
                />
                </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rumman454@email.com"
                  required
                />
              </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e)=> setPassword(e.target.value)}
                    required />
                  </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
                {error && <p className="text-center text-sm text-destructive">{error}</p>}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                  </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
           <Preview/>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
