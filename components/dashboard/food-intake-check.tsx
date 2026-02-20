"use client"

import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import type { FoodInteraction } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { UtensilsCrossed } from "lucide-react"

interface FoodIntakeCheckProps {
  items: FoodInteraction[]
  onChange: (items: FoodInteraction[]) => void
}

export function FoodIntakeCheck({ items, onChange }: FoodIntakeCheckProps) {
  const { language } = usePharma()

  function toggleItem(id: string) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <UtensilsCrossed className="h-5 w-5 text-accent" />
          {t("dashboard.recentIntake", language)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <label
              key={item.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                item.checked
                  ? "border-accent/30 bg-accent/5 text-foreground"
                  : "border-border/30 text-muted-foreground hover:border-border hover:bg-secondary/30"
              }`}
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
