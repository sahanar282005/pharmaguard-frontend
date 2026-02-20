"use client"

import React from "react"

interface OriginalResultsPanelProps {
  result: any
}

export function OriginalResultsPanel({ result }: OriginalResultsPanelProps) {
  const llm = result.llm_generated_explanation || {}
  const clinical = llm.clinical_summary || "Not available"
  const layman = llm.layman_summary || "Not available"
  const riskAssess = result.risk_assessment || {}
  const pgProfile = result.pharmacogenomic_profile || {}
  const clinRec = result.clinical_recommendation || {}
  const qualityMet = result.quality_metrics || {}

  return (
    <div className="my-6 rounded-lg border border-border/30 bg-card/60 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-display font-semibold">{result.drug} - Detailed Analysis Results</h3>

      {/* Risk Assessment */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground">Risk Label</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{riskAssess.risk_label || "N/A"}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground">Confidence Score</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{typeof riskAssess.confidence_score === 'number' ? (riskAssess.confidence_score * 100).toFixed(0) : riskAssess.confidence_score}%</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground">Severity</p>
          <p className="mt-1 text-lg font-semibold text-foreground capitalize">{riskAssess.severity || "N/A"}</p>
        </div>
      </div>

      {/* Pharmacogenomic Profile */}
      <div className="mb-6">
        <h4 className="mb-3 font-semibold text-foreground">Pharmacogenomic Profile</h4>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground">Gene</p>
            <p className="mt-1 font-medium text-foreground">{pgProfile.primary_gene || pgProfile.gene || "N/A"}</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground">Diplotype</p>
            <p className="mt-1 font-medium text-foreground">{pgProfile.diplotype || "N/A"}</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground">Phenotype</p>
            <p className="mt-1 font-medium text-foreground">{pgProfile.phenotype || "N/A"}</p>
          </div>
          <div className="rounded-lg bg-secondary/30 p-3">
            <p className="text-xs text-muted-foreground">Variants Detected</p>
            <p className="mt-1 font-medium text-foreground">{Array.isArray(pgProfile.detected_variants) ? pgProfile.detected_variants.length : 0}</p>
          </div>
        </div>
      </div>

      {/* Clinical Recommendation */}
      <div className="mb-6 rounded-lg bg-primary/5 p-4 border border-primary/20">
        <h4 className="mb-2 font-semibold text-foreground">Clinical Recommendation</h4>
        <p className="text-sm leading-relaxed text-foreground/90">{clinRec.note || "No recommendation available"}</p>
      </div>

      {/* LLM Explanations */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-accent/5 p-4 border border-accent/20">
          <h4 className="mb-2 font-semibold text-foreground">Clinical Explanation (AI)</h4>
          <p className="text-sm leading-relaxed text-foreground/90">{clinical}</p>
        </div>
        <div className="rounded-lg bg-accent/5 p-4 border border-accent/20">
          <h4 className="mb-2 font-semibold text-foreground">Layman Explanation (AI)</h4>
          <p className="text-sm leading-relaxed text-foreground/90">{layman}</p>
        </div>
      </div>

      {/* Quality Metrics */}
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Quality Metrics</h4>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 text-sm">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${qualityMet.vcf_parsing_success ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">VCF Parsed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${qualityMet.recognized_gene ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">Gene Recognized</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${qualityMet.star_allele_supported ? "bg-green-500" : "bg-yellow-500"}`} />
            <span className="text-muted-foreground">STAR Allele</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${qualityMet.cpic_rule_applied ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">CPIC Rule</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${qualityMet.rsid_fallback_used ? "bg-blue-500" : "bg-gray-500"}`} />
            <span className="text-muted-foreground">RSID Fallback</span>
          </div>
        </div>
      </div>
    </div>
  )
}
