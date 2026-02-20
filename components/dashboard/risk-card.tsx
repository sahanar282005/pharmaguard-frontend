"use client"

import { useState } from "react"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import type { AnalysisResult, RiskLevel } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ShieldCheck,
  AlertTriangle,
  Skull,
  Ban,
  HelpCircle,
  Dna,
  Stethoscope,
  Brain,
  BarChart3,
} from "lucide-react"
import { EnzymeTwin } from "./enzyme-twin"

const riskConfig: Record<
  RiskLevel,
  { label: string; color: string; bgColor: string; icon: typeof ShieldCheck }
> = {
  safe: { label: "Safe", color: "text-risk-safe", bgColor: "bg-risk-safe/10", icon: ShieldCheck },
  adjust: { label: "Adjust Dosage", color: "text-risk-adjust", bgColor: "bg-risk-adjust/10", icon: AlertTriangle },
  toxic: { label: "Toxic", color: "text-risk-toxic", bgColor: "bg-risk-toxic/10", icon: Skull },
  ineffective: { label: "Ineffective", color: "text-risk-ineffective", bgColor: "bg-risk-ineffective/10", icon: Ban },
  unknown: { label: "Unknown", color: "text-risk-unknown", bgColor: "bg-risk-unknown/10", icon: HelpCircle },
}

interface RiskCardProps {
  result: AnalysisResult
}

export function RiskCard({ result }: RiskCardProps) {
  const { language } = usePharma()
  const risk = result.risk_assessment

  const riskLabelRaw = (risk.risk_label ?? (risk as any).riskLevel ?? "unknown").toString().toLowerCase()
  const allowed: RiskLevel[] = ["safe", "adjust", "toxic", "ineffective", "unknown"]
  const riskLabelKey = (allowed.includes(riskLabelRaw as RiskLevel) ? (riskLabelRaw as RiskLevel) : "unknown")
  const config = riskConfig[riskLabelKey]
  const Icon = config.icon
  const isToxic = riskLabelKey === "toxic"

  const confidence = (risk.confidence_score ?? (risk as any).confidence ?? 0.4) as number
  const severityRaw = (risk.severity ?? (risk as any).severity_level) as any
  const severity = typeof severityRaw === "number" ? severityRaw : severityRaw === "high" ? 85 : severityRaw === "moderate" ? 50 : 0

  const pgx = result.pharmacogenomic_profile
  const geneDisplay = pgx?.primary_gene ?? pgx?.gene ?? "-"

  return (
    <Card
      className={`border-border/30 bg-card/60 backdrop-blur-sm transition-all ${
        isToxic ? "animate-pulse-glow border-risk-toxic/30" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            {risk.drug}
            <span className="text-sm font-normal text-muted-foreground">/ {geneDisplay}</span>
          </CardTitle>
          <Badge className={`${config.bgColor} ${config.color} border-0`}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Risk summary */}
        <p className="text-sm leading-relaxed text-muted-foreground">{(risk.description ?? (risk as any).description_text) ?? ""}</p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">{t("results.confidence", language)}</span>
            <div className="flex items-center gap-2">
              <Progress value={confidence * 100} className="h-2" />
              <span className="text-sm font-semibold text-foreground">{(confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">{t("results.severity", language)}</span>
            <div className="flex items-center gap-2">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                    severity >= 75
                      ? "bg-risk-toxic"
                      : severity >= 50
                        ? "bg-risk-adjust"
                        : "bg-risk-safe"
                  }`}
                  style={{ width: `${severity}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground">{severity}%</span>
            </div>
          </div>
        </div>

        {/* Enzyme Digital Twin */}
        <EnzymeTwin metabolizerStatus={pgx?.metabolizerStatus ?? pgx?.metabolizer_status} activityScore={pgx?.activityScore ?? pgx?.activity_score} />

        {/* Expandable sections */}
        <Accordion type="multiple" className="flex flex-col gap-2">
          <AccordionItem value="pgx" className="rounded-lg border border-border/30 px-0">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-foreground">
                <Dna className="h-4 w-4 text-accent" />
                Pharmacogenomic Profile
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Gene</span>
                  <p className="font-medium text-foreground">{pgx?.primary_gene ?? pgx?.gene ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Diplotype</span>
                  <p className="font-medium text-foreground">{pgx?.diplotype ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Phenotype</span>
                  <p className="font-medium text-foreground">{pgx?.phenotype ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Activity Score</span>
                  <p className="font-medium text-foreground">{pgx?.activityScore ?? pgx?.activity_score ?? "-"}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="clinical" className="rounded-lg border border-border/30 px-0">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-foreground">
                <Stethoscope className="h-4 w-4 text-accent" />
                Clinical Recommendation
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Recommendation</span>
                  <p className="font-medium text-foreground">{result.clinical_recommendation?.note ?? result.clinical_recommendation?.recommendation ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Dosage Adjustment</span>
                  <p className="text-foreground">{result.clinical_recommendation?.dosageAdjustment ?? result.clinical_recommendation?.dosage_adjustment ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Alternatives</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(result.clinical_recommendation?.alternativeDrugs ?? result.clinical_recommendation?.alternative_drugs ?? []).map((d: string) => (
                      <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Monitoring</span>
                  <p className="text-foreground">{result.clinical_recommendation?.monitoring ?? "-"}</p>
                </div>
                <Badge variant="outline" className="w-fit text-xs">CPIC: {result.clinical_recommendation?.cpicLevel ?? result.clinical_recommendation?.cpic_level ?? "-"}</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="llm-clinical" className="rounded-lg border border-border/30 px-0">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-foreground">
                <Brain className="h-4 w-4 text-accent" />
                LLM Explanation (Clinical)
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm leading-relaxed text-foreground/90">{result.llm_generated_explanation?.clinical_summary ?? result.llm_generated_explanation?.clinical ?? ""}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="llm-layman" className="rounded-lg border border-border/30 px-0">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-foreground">
                <Brain className="h-4 w-4 text-primary" />
                LLM Explanation (Layman)
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm leading-relaxed text-foreground/90">{result.llm_generated_explanation?.layman_summary ?? result.llm_generated_explanation?.layman ?? ""}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="quality" className="rounded-lg border border-border/30 px-0">
            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
              <span className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-4 w-4 text-accent" />
                Quality Metrics
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Data Completeness</span>
                  <p className="font-medium text-foreground">{result.quality_metrics.dataCompleteness}%</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Evidence Level</span>
                  <p className="font-medium text-foreground">{result.quality_metrics.evidenceLevel}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground">CPIC Guideline</span>
                  <p className="text-foreground">{result.quality_metrics.cpicGuideline}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
