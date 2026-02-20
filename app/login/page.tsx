"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import type { UserRole } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, Stethoscope, FlaskConical, Microscope } from "lucide-react"

const roleIcons: Record<UserRole, typeof Stethoscope> = {
  doctor: Stethoscope,
  pharmacist: FlaskConical,
  researcher: Microscope,
}

export default function LoginPage() {
  const router = useRouter()
  const { language, setUser } = usePharma()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("doctor")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // Mock auth - simulate latency
    await new Promise((r) => setTimeout(r, 800))
    setUser({
      email,
      name: email.split("@")[0],
      role,
    })
    setIsLoading(false)
    router.push("/dashboard")
  }

  const RoleIcon = roleIcons[role]

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-border/30 bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">
            {t("login.title", language)}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? "Create a new account to access the platform"
              : "Sign in to access your pharmacogenomic dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t("login.email", language)}</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{t("login.password", language)}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t("login.role", language)}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Doctor
                    </span>
                  </SelectItem>
                  <SelectItem value="pharmacist">
                    <span className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" />
                      Pharmacist
                    </span>
                  </SelectItem>
                  <SelectItem value="researcher">
                    <span className="flex items-center gap-2">
                      <Microscope className="h-4 w-4" />
                      Researcher
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selected role visual */}
            <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
              <RoleIcon className="h-5 w-5 text-accent" />
              <div className="flex flex-col">
                <span className="text-sm font-medium capitalize text-foreground">
                  {role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {role === "doctor" && "Full clinical access with prescribing recommendations"}
                  {role === "pharmacist" && "Drug interaction analysis and dispensing alerts"}
                  {role === "researcher" && "Complete data access with export capabilities"}
                </span>
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading
                ? "Authenticating..."
                : isRegistering
                  ? t("login.register", language)
                  : t("login.submit", language)}
            </Button>

            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Need an account? Register"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
