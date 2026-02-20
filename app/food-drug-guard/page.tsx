"use client"

import { useState } from "react"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { SUPPORTED_DRUGS, FOOD_INTERACTIONS } from "@/lib/mock-data"
import type { FoodInteraction } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UtensilsCrossed,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Loader2,
  Apple,
} from "lucide-react"

const INTERACTION_DATABASE: Record<string, Record<string, { severity: "high" | "moderate" | "low"; warning: string }>> = {
  WARFARIN: {
    greens: { severity: "high", warning: "Green leafy vegetables contain Vitamin K which directly antagonizes warfarin's anticoagulant effect. Sudden changes in Vitamin K intake can cause INR instability." },
    alcohol: { severity: "high", warning: "Alcohol affects warfarin metabolism through CYP2E1 induction (chronic use) or CYP2E1 inhibition (acute use). Both can lead to dangerous INR fluctuations." },
    grapefruit: { severity: "moderate", warning: "Grapefruit inhibits CYP3A4 and may modestly increase warfarin levels. Monitor INR more closely." },
    herbal: { severity: "high", warning: "Many herbal supplements (St. John's Wort, ginkgo, garlic) interact with warfarin. St. John's Wort induces CYP enzymes and reduces warfarin efficacy." },
  },
  SIMVASTATIN: {
    grapefruit: { severity: "high", warning: "Grapefruit juice inhibits intestinal CYP3A4, dramatically increasing simvastatin bioavailability (up to 16x). This significantly increases risk of rhabdomyolysis and myopathy." },
    alcohol: { severity: "moderate", warning: "Alcohol increases hepatotoxicity risk when combined with statins. Moderate to heavy alcohol use may worsen liver function." },
    highfat: { severity: "low", warning: "High-fat meals may increase simvastatin absorption. Take simvastatin in the evening regardless of meal timing." },
  },
  CODEINE: {
    alcohol: { severity: "high", warning: "Alcohol combined with codeine potentiates CNS depression, increasing risk of respiratory depression, sedation, and potentially fatal outcomes." },
    grapefruit: { severity: "moderate", warning: "Grapefruit inhibits CYP3A4 and may alter codeine metabolism, though the primary CYP2D6 pathway is more clinically significant." },
  },
  CLOPIDOGREL: {
    grapefruit: { severity: "moderate", warning: "Grapefruit inhibits CYP3A4 which is involved in clopidogrel's alternative activation pathway. May reduce antiplatelet effect." },
    herbal: { severity: "moderate", warning: "Herbal supplements with antiplatelet properties (ginkgo, garlic, ginger) may increase bleeding risk when combined with clopidogrel." },
  },
  FLUOROURACIL: {
    alcohol: { severity: "moderate", warning: "Alcohol may exacerbate fluorouracil-related mucositis and hepatotoxicity." },
    milk: { severity: "low", warning: "Dairy products with high calcium content may slightly affect fluorouracil absorption timing." },
  },
  AZATHIOPRINE: {
    alcohol: { severity: "moderate", warning: "Both azathioprine and alcohol are hepatotoxic. Combined use increases liver damage risk." },
    herbal: { severity: "moderate", warning: "Some herbal supplements (echinacea) may interact with azathioprine's immunosuppressive effects." },
  },
}

export default function FoodDrugGuardPage() {
  const { language } = usePharma()
  const [selectedDrug, setSelectedDrug] = useState("")
  const [foodItems, setFoodItems] = useState<FoodInteraction[]>(
    FOOD_INTERACTIONS.map((f) => ({ ...f, checked: false }))
  )
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  function toggleItem(id: string) {
    setFoodItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  async function handleCheck() {
    if (!selectedDrug) return
    setAnalyzing(true)
    setShowResults(false)
    await new Promise((r) => setTimeout(r, 1500))
    setShowResults(true)
    setAnalyzing(false)
  }

  const checkedFoods = foodItems.filter((f) => f.checked)
  const drugInteractions = INTERACTION_DATABASE[selectedDrug] || {}
  const activeWarnings = checkedFoods
    .filter((f) => drugInteractions[f.id])
    .map((f) => ({ food: f.name, ...drugInteractions[f.id] }))
  const safeItems = checkedFoods.filter((f) => !drugInteractions[f.id])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {t("foodGuard.title", language)}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Check for potential food-drug interactions before prescribing or dispensing.
        </p>
      </div>

      {/* Drug selection */}
      <Card className="mb-6 border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Select Medication</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedDrug} onValueChange={setSelectedDrug}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Choose a drug..." />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_DRUGS.map((drug) => (
                <SelectItem key={drug} value={drug}>
                  {drug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Food checklist */}
      <Card className="mb-6 border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Apple className="h-5 w-5 text-accent" />
            Recent Food &amp; Substance Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {foodItems.map((item) => (
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

      {/* Check button */}
      <div className="mb-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleCheck}
          disabled={!selectedDrug || checkedFoods.length === 0 || analyzing}
          className="gap-2 font-semibold"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Checking Interactions...
            </>
          ) : (
            <>
              <ShieldAlert className="h-5 w-5" />
              Check Interactions
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-xl font-bold text-foreground">
            Interaction Results for {selectedDrug}
          </h2>

          {/* Warnings */}
          {activeWarnings.length > 0 && (
            <div className="flex flex-col gap-3">
              {activeWarnings.map((w) => (
                <Card
                  key={w.food}
                  className={`border-l-4 ${
                    w.severity === "high"
                      ? "border-l-risk-toxic bg-risk-toxic/5"
                      : w.severity === "moderate"
                        ? "border-l-risk-adjust bg-risk-adjust/5"
                        : "border-l-risk-safe bg-risk-safe/5"
                  } border-border/30 backdrop-blur-sm`}
                >
                  <CardContent className="flex items-start gap-3 py-4">
                    <AlertTriangle
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        w.severity === "high"
                          ? "text-risk-toxic"
                          : w.severity === "moderate"
                            ? "text-risk-adjust"
                            : "text-risk-safe"
                      }`}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{w.food}</span>
                        <Badge
                          variant="outline"
                          className={
                            w.severity === "high"
                              ? "border-risk-toxic/30 text-risk-toxic"
                              : w.severity === "moderate"
                                ? "border-risk-adjust/30 text-risk-adjust"
                                : "border-risk-safe/30 text-risk-safe"
                          }
                        >
                          {w.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {w.warning}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Safe items */}
          {safeItems.length > 0 && (
            <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 py-4">
                <CheckCircle className="h-5 w-5 text-risk-safe" />
                <div>
                  <span className="font-medium text-foreground">No known interactions: </span>
                  <span className="text-sm text-muted-foreground">
                    {safeItems.map((s) => s.name).join(", ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {activeWarnings.length === 0 && safeItems.length > 0 && (
            <Card className="border-risk-safe/30 bg-risk-safe/5 backdrop-blur-sm">
              <CardContent className="flex items-center gap-3 py-6 text-center">
                <CheckCircle className="h-6 w-6 text-risk-safe" />
                <span className="font-medium text-foreground">
                  No food-drug interactions detected for the selected items with {selectedDrug}.
                </span>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
