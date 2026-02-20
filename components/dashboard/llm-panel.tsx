"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult } from "@/types"

interface LLMPanelProps {
  results: AnalysisResult[]
}

export function LLMPanel({ results }: LLMPanelProps) {
  if (!results || results.length === 0) return null

  return (
    <div className="my-6">
      <h3 className="mb-3 text-lg font-display font-semibold">AI Generated Summaries</h3>
      <div className="grid grid-cols-1 gap-4">
        {results.map((r) => (
          <Card key={r.drug} className="border-border/30 bg-card/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{r.drug}</CardTitle>
                <Badge variant="secondary" className="text-xs">{new Date(r.timestamp).toLocaleString()}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground">Clinical Explanation</h4>
                  <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{r.llm_generated_explanation?.clinical || "Not available."}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground">Layman Explanation</h4>
                  <p className="mt-1 text-sm text-foreground/90 leading-relaxed">{r.llm_generated_explanation?.layman || "Not available."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default LLMPanel
