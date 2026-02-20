"use client"

import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import type { AnalysisResult } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Code, Copy, Download, Check } from "lucide-react"
import { useState } from "react"

interface JSONPanelProps {
  results: AnalysisResult[]
}

export function JSONPanel({ results }: JSONPanelProps) {
  const { language, devMode, setDevMode } = usePharma()
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(results, null, 2)

  function handleCopy() {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pharmaguard-results.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="dev-mode" checked={devMode} onCheckedChange={setDevMode} />
        <Label htmlFor="dev-mode" className="text-sm text-muted-foreground">
          {t("devMode", language)}
        </Label>
      </div>

      {devMode && results.length > 0 && (
        <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Code className="h-5 w-5 text-accent" />
                Raw JSON Output
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-lg bg-secondary/50 p-4 text-xs text-foreground">
              <code>{jsonString}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
