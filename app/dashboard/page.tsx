"use client"

import { useState } from "react"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { FOOD_INTERACTIONS, MOCK_RESULTS } from "@/lib/mock-data"
import type { FoodInteraction } from "@/types"
import { VCFUpload } from "@/components/dashboard/vcf-upload"
import { DrugSelector } from "@/components/dashboard/drug-selector"
import { FoodIntakeCheck } from "@/components/dashboard/food-intake-check"
import { JSONPanel } from "@/components/dashboard/json-panel"
import { AdvancedFeatures } from "@/components/dashboard/advanced-features"
import { OriginalResultsPanel } from "@/components/dashboard/original-results-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Loader2, Activity } from "lucide-react"
import { analyzeVCF } from "@/services/api"

export default function DashboardPage() {
  const { language, results, setResults, isAnalyzing, setIsAnalyzing } = usePharma()
  const [vcfFile, setVCFFile] = useState<File | null>(null)
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([])
  const [foodItems, setFoodItems] = useState<FoodInteraction[]>(FOOD_INTERACTIONS)

  async function handleAnalyze() {
    if (!vcfFile || selectedDrugs.length === 0) return
    setIsAnalyzing(true)
    setResults([])
    try {
      console.log(`[Dashboard] Starting analysis for ${selectedDrugs.length} drug(s): ${selectedDrugs.join(", ")}`)
      const apiResults = await analyzeVCF(vcfFile, selectedDrugs)
      console.log(`[Dashboard] Analysis complete. Received ${apiResults.length} result(s)`)
      console.log("[Dashboard] Results:", apiResults)
      setResults(apiResults)
    } catch (err) {
      // Basic error handling — surface to user
      console.error("[Dashboard] Analysis error:", err)
      alert((err as Error).message || "Analysis failed. See console for details.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {t("dashboard.title", language)}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Upload genetic data, select medications, and receive AI-powered pharmacogenomic risk assessments.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <VCFUpload
            file={vcfFile}
            onFileSelect={setVCFFile}
            onClear={() => setVCFFile(null)}
          />
          <DrugSelector selected={selectedDrugs} onChange={setSelectedDrugs} />
        </div>
        <FoodIntakeCheck items={foodItems} onChange={setFoodItems} />
      </div>

      {/* Analyze Button */}
      <div className="my-8 flex items-center justify-center">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={!vcfFile || selectedDrugs.length === 0 || isAnalyzing}
          className="gap-2 font-semibold"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing Variants...
            </>
          ) : (
            <>
              <FlaskConical className="h-5 w-5" />
              {t("dashboard.analyze", language)}
            </>
          )}
        </Button>
      </div>

      {/* Original Backend Results - All Fields Displayed */}
      {results.length > 0 && (
        <div className="flex flex-col gap-6">
          {results.map((r: any, idx: number) => (
            <OriginalResultsPanel key={`${r.drug}-${idx}`} result={r} />
          ))}
        </div>
      )}

      {/* Advanced Features and JSON Panel */}
      {results.length > 0 && (
        <div className="flex flex-col gap-8">
          <AdvancedFeatures />
          <JSONPanel results={results} />
        </div>
      )}
    </div>
  )
}
