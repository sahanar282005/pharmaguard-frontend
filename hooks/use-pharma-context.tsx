"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Language, User, AnalysisResult } from "@/types"

interface PharmaContextType {
  language: Language
  setLanguage: (lang: Language) => void
  user: User | null
  setUser: (user: User | null) => void
  results: AnalysisResult[]
  setResults: (results: AnalysisResult[]) => void
  isAnalyzing: boolean
  setIsAnalyzing: (v: boolean) => void
  devMode: boolean
  setDevMode: (v: boolean) => void
}

const PharmaContext = createContext<PharmaContextType | undefined>(undefined)

export function PharmaProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [user, setUser] = useState<User | null>(null)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [devMode, setDevMode] = useState(false)

  return (
    <PharmaContext.Provider
      value={{
        language,
        setLanguage,
        user,
        setUser,
        results,
        setResults,
        isAnalyzing,
        setIsAnalyzing,
        devMode,
        setDevMode,
      }}
    >
      {children}
    </PharmaContext.Provider>
  )
}

export function usePharma() {
  const ctx = useContext(PharmaContext)
  if (!ctx) throw new Error("usePharma must be used within PharmaProvider")
  return ctx
}
