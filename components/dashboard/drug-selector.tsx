"use client"

import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { SUPPORTED_DRUGS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pill, X } from "lucide-react"

interface DrugSelectorProps {
  selected: string[]
  onChange: (drugs: string[]) => void
}

export function DrugSelector({ selected, onChange }: DrugSelectorProps) {
  const { language } = usePharma()

  function toggle(drug: string) {
    if (selected.includes(drug)) {
      onChange(selected.filter((d) => d !== drug))
    } else {
      onChange([...selected, drug])
    }
  }

  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Pill className="h-5 w-5 text-accent" />
          {t("dashboard.drugSelect", language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_DRUGS.map((drug) => {
            const isSelected = selected.includes(drug)
            return (
              <button
                key={drug}
                onClick={() => toggle(drug)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                }`}
              >
                {drug}
                {isSelected && <X className="h-3 w-3" />}
              </button>
            )
          })}
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Selected:</span>
            <div className="flex flex-wrap gap-1">
              {selected.map((drug) => (
                <Badge key={drug} variant="secondary" className="text-xs">
                  {drug}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
