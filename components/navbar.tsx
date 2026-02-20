"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePharma } from "@/hooks/use-pharma-context"
import { t, languageNames } from "@/lib/i18n"
import type { Language } from "@/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Globe,
  Moon,
  Sun,
  User,
  Menu,
  LogOut,
  Shield,
} from "lucide-react"

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/food-drug-guard", key: "nav.foodDrugGuard" },
  { href: "/reports", key: "nav.reports" },
  { href: "/chat", key: "nav.chat" },
  { href: "/about", key: "nav.about" },
]

export function Navbar() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { language, setLanguage, user, setUser } = usePharma()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            PharmaGuard
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {t(link.key, language)}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? "bg-accent" : ""}
                >
                  {languageNames[lang]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode - uses CSS-only approach to avoid hydration mismatch */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() =>
              setTheme(
                document.documentElement.classList.contains("dark")
                  ? "light"
                  : "dark"
              )
            }
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu - only render dynamic content after mount */}
          {mounted ? (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="font-medium">{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <span className="text-xs capitalize text-muted-foreground">
                      {user.role}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUser(null)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="hidden sm:flex">
                  {t("nav.login", language)}
                </Button>
              </Link>
            )
          ) : (
            <div className="hidden h-9 w-16 sm:block" />
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card">
              <div className="mt-6 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {t(link.key, language)}
                  </Link>
                ))}
                {mounted && !user && (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-4 rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
                  >
                    {t("nav.login", language)}
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
