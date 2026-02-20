"use client"

import { useState } from "react"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { MOCK_RESULTS } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Loader2,
  Stethoscope,
  User,
  CheckCircle,
  Shield,
  AlertTriangle,
  Dna,
} from "lucide-react"

export default function ReportsPage() {
  const { language, results } = usePharma()
  const [downloadingDoctor, setDownloadingDoctor] = useState(false)
  const [downloadingPatient, setDownloadingPatient] = useState(false)
  const [copied, setCopied] = useState(false)

  const displayResults = results.length > 0 ? results : MOCK_RESULTS

  async function handleDownload(type: "doctor" | "patient") {
    const setter = type === "doctor" ? setDownloadingDoctor : setDownloadingPatient
    setter(true)
    try {
      // Use frontend report generator (mock or backend) to obtain a Blob (PDF)
      const { generateReport } = await import("@/services/api")
      const blob = await generateReport(displayResults as any, type)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      // Choose extension based on blob MIME type
      const isHtml = blob.type === "text/html"
      a.download = `pharmaguard-${type}-report${isHtml ? ".html" : ".pdf"}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      // If HTML was returned, open in a new tab to allow printing
      if (isHtml) {
        const newTab = window.open(url, "_blank")
        if (newTab) newTab.focus()
      }
    } catch (e) {
      console.error("Report generation failed", e)
      // Fallback: export an HTML file
      const html = generateReportHTML(displayResults, type)
      const blob = new Blob([html], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pharmaguard-${type}-report.html`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setter(false)
    }
  }

  function handleCopyJSON() {
    const json = JSON.stringify(displayResults, null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-accent" />
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {t("reports.title", language)}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Generate comprehensive pharmacogenomic reports for clinical or patient use.
        </p>
      </div>

      {/* Download buttons */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Stethoscope className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Doctor Report
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              Technical language with mechanisms, gene variants, diplotypes, activity scores, and CPIC-level dosing recommendations.
            </p>
            <Button
              onClick={() => handleDownload("doctor")}
              disabled={downloadingDoctor}
              className="w-full gap-2 font-semibold"
            >
              {downloadingDoctor ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t("reports.doctor", language)}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <User className="h-7 w-7 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Patient Report
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              Simple explanations with clear risk summaries, lifestyle notes, and easy-to-understand recommendations.
            </p>
            <Button
              variant="outline"
              onClick={() => handleDownload("patient")}
              disabled={downloadingPatient}
              className="w-full gap-2 font-semibold"
            >
              {downloadingPatient ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t("reports.patient", language)}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview */}
      <h2 className="mb-6 font-display text-xl font-bold text-foreground">
        Report Preview
      </h2>

      <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display">
              <Shield className="h-5 w-5 text-primary" />
              PharmaGuard Clinical Report
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Patient: PGX-2026-00142</Badge>
              <Button variant="ghost" size="sm" onClick={handleCopyJSON} className="gap-2">
                {copied ? "Copied JSON" : "Copy JSON"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6">
            {displayResults.map((result) => (
              <div key={result.drug} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dna className="h-4 w-4 text-accent" />
                    <span className="font-display font-semibold text-foreground">
                      {result.drug} / {result.pharmacogenomic_profile?.primary_gene ?? "-"}
                    </span>
                  </div>
                  {
                    (() => {
                      const rl = (result.risk_assessment?.risk_label || "Unknown").toLowerCase()
                      const cls = rl === "none" || rl === "safe" ? "bg-risk-safe/10 text-risk-safe border-0" : rl === "moderate" || rl === "adjust" ? "bg-risk-adjust/10 text-risk-adjust border-0" : rl === "high" || rl === "toxic" ? "bg-risk-toxic/10 text-risk-toxic border-0" : "bg-risk-ineffective/10 text-risk-ineffective border-0"
                      return (
                        <Badge className={cls}>
                          {rl === "high" && <AlertTriangle className="mr-1 h-3 w-3" />}
                          {rl === "none" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {(result.risk_assessment?.risk_label || "Unknown").toUpperCase()}
                        </Badge>
                      )
                    })()
                  }
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/30 p-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Diplotype</span>
                    <p className="font-medium text-foreground">{result.pharmacogenomic_profile?.diplotype ?? "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Phenotype</span>
                    <p className="font-medium text-foreground">{result.pharmacogenomic_profile?.phenotype ?? "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Activity Score</span>
                    <p className="font-medium text-foreground">{result.pharmacogenomic_profile?.activityScore ?? "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <p className="font-medium text-foreground">{((result.risk_assessment?.confidence_score ?? result.risk_assessment?.confidence ?? 0.4) * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Recommendation</span>
                  <p className="mt-1 leading-relaxed text-foreground">{result.clinical_recommendation?.note ?? result.clinical_recommendation?.recommendation ?? "No specific recommendation available."}</p>
                </div>

                <Separator />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function generateReportHTML(
  results: typeof MOCK_RESULTS,
  type: "doctor" | "patient"
): string {
  const title =
    type === "doctor"
      ? "PharmaGuard Clinical Report"
      : "PharmaGuard Patient Report"

  const body = results
    .map((r) => {
      const gene = r.pharmacogenomic_profile?.primary_gene ?? "-"
      const riskLabel = r.risk_assessment?.risk_label ?? "Unknown"
      const confidence = (r.risk_assessment?.confidence_score ?? r.risk_assessment?.confidence ?? 0.4) * 100
      const diplotype = r.pharmacogenomic_profile?.diplotype ?? "-"
      const phenotype = r.pharmacogenomic_profile?.phenotype ?? "-"
      const activity = r.pharmacogenomic_profile?.activityScore ?? "-"
      const recommendation = r.clinical_recommendation?.note ?? r.clinical_recommendation?.recommendation ?? "No specific recommendation available."
      const clinical = r.llm_generated_explanation?.clinical_summary ?? r.llm_generated_explanation?.clinical ?? ""
      const layman = r.llm_generated_explanation?.layman_summary ?? r.llm_generated_explanation?.layman ?? ""

      if (type === "doctor") {
        return `
          <div style="margin-bottom:24px;padding:16px;border:1px solid #e0e0e0;border-radius:8px">
            <h3 style="margin:0 0 8px">${r.drug} / ${gene}</h3>
            <p><strong>Risk:</strong> ${riskLabel.toUpperCase()} (Confidence: ${confidence.toFixed(0)}%)</p>
            <p><strong>Diplotype:</strong> ${diplotype} | <strong>Phenotype:</strong> ${phenotype}</p>
            <p><strong>Activity Score:</strong> ${activity}</p>
            <p><strong>Recommendation:</strong> ${recommendation}</p>
            <p><strong>Clinical Explanation:</strong> ${clinical}</p>
          </div>`
      }

      return `
        <div style="margin-bottom:24px;padding:16px;border:1px solid #e0e0e0;border-radius:8px">
          <h3 style="margin:0 0 8px">${r.drug}</h3>
          <p style="color:${riskLabel.toLowerCase() === "none" || riskLabel.toLowerCase() === "safe" ? "green" : riskLabel.toLowerCase() === "high" || riskLabel.toLowerCase() === "toxic" ? "red" : "orange"}">
            <strong>Risk Level:</strong> ${riskLabel.toUpperCase()}</p>
          <p>${layman}</p>
        </div>`
    })
    .join("")

  return `<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a2e}h1{color:#0c2340}h2{color:#009688}</style>
    </head><body>
    <h1>${title}</h1>
    <p>Patient ID: PGX-2026-00142 | Generated: ${new Date().toLocaleDateString()}</p>
    <hr/>
    <h2>Analysis Results</h2>
    ${body}
    <hr/><p style="color:#888;font-size:12px">Generated by PharmaGuard - Precision Pharmacogenomic Risk Prediction System</p>
    </body></html>`
}
