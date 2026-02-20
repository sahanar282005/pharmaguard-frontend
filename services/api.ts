import type { AnalysisResult } from "@/types"
import { MOCK_RESULTS } from "@/lib/mock-data"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

export async function analyzeVCF(
  file: File,
  drugs: string[]
): Promise<any[]> {
  const results: any[] = []
  const errors: string[] = []

  for (const drug of drugs) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("drug", drug)

    try {
      console.log(`[API] Analyzing ${drug}...`)
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
        mode: "cors",
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => "<no-body>")
        throw new Error(`${res.status} ${txt}`)
      }

      const data = await res.json()
      console.log(`[API] ${drug} success:`, data)
      results.push(data)
    } catch (err) {
      // Log the error but continue with next drug
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error(`[API] ${drug} failed: ${errorMsg}`)
      errors.push(`${drug}: ${errorMsg}`)
    }
  }

  console.log(`[API] Analysis complete. Success: ${results.length}/${drugs.length}, Failures: ${errors.length}`)
  
  // If all drugs failed, throw an error
  if (results.length === 0 && errors.length > 0) {
    throw new Error(`All drug analyses failed:\n${errors.join("\n")}`)
  }

  // If some failed but at least one succeeded, log warnings but return the successful ones
  if (errors.length > 0) {
    console.warn(`[API] Some drugs failed:\n${errors.join("\n")}`)
  }

  return results
}

export async function getFoodInteraction(
  drug: string,
  foods: string[]
): Promise<{ warnings: string[] }> {
  // Mock: simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const warnings: string[] = []
  if (foods.includes("grapefruit") && drug === "SIMVASTATIN") {
    warnings.push("Grapefruit significantly increases simvastatin levels. Risk of myopathy.")
  }
  if (foods.includes("greens") && drug === "WARFARIN") {
    warnings.push("Green leafy vegetables contain Vitamin K which can reduce warfarin efficacy.")
  }
  if (foods.includes("alcohol")) {
    warnings.push("Alcohol may increase CNS depression and alter drug metabolism.")
  }
  return { warnings }
}

export async function generateReport(
  results: AnalysisResult[],
  type: "doctor" | "patient"
): Promise<Blob> {
  // Try backend PDF generation first (if implemented)
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results, type }),
    })
    if (res.ok) return await res.blob()
  } catch (e) {
    // ignore and fall back to client-side HTML report
  }

  // Fallback: generate a printable HTML report blob on the client
  const title = type === "doctor" ? "PharmaGuard Clinical Report" : "PharmaGuard Patient Report"

  const body = (results || [])
    .map((r) => {
      const gene = r.pharmacogenomic_profile?.primary_gene ?? r.pharmacogenomic_profile?.gene ?? "-"
      const riskLabel = r.risk_assessment?.risk_label ?? (r.risk_assessment as any)?.riskLevel ?? "Unknown"
      const confidence = ((r.risk_assessment?.confidence_score ?? (r.risk_assessment as any)?.confidence ?? 0.4) * 100).toFixed(0)
      const diplotype = r.pharmacogenomic_profile?.diplotype ?? "-"
      const phenotype = r.pharmacogenomic_profile?.phenotype ?? "-"
      const activity = r.pharmacogenomic_profile?.activityScore ?? r.pharmacogenomic_profile?.activity_score ?? "-"
      const recommendation = r.clinical_recommendation?.note ?? r.clinical_recommendation?.recommendation ?? "No specific recommendation available."
      const clinical = r.llm_generated_explanation?.clinical_summary ?? r.llm_generated_explanation?.clinical ?? ""
      const layman = r.llm_generated_explanation?.layman_summary ?? r.llm_generated_explanation?.layman ?? ""

      if (type === "doctor") {
        return `
          <div style="margin-bottom:24px;padding:16px;border:1px solid #e0e0e0;border-radius:8px">
            <h3 style="margin:0 0 8px">${r.drug} / ${gene}</h3>
            <p><strong>Risk:</strong> ${riskLabel.toUpperCase()} (Confidence: ${confidence}%)</p>
            <p><strong>Diplotype:</strong> ${diplotype} | <strong>Phenotype:</strong> ${phenotype}</p>
            <p><strong>Activity Score:</strong> ${activity}</p>
            <p><strong>Recommendation:</strong> ${recommendation}</p>
            <p><strong>Clinical Explanation:</strong> ${clinical}</p>
          </div>`
      }

      return `
        <div style="margin-bottom:24px;padding:16px;border:1px solid #e0e0e0;border-radius:8px">
          <h3 style="margin:0 0 8px">${r.drug}</h3>
          <p style="color:${(riskLabel || "").toLowerCase() === "none" || (riskLabel || "").toLowerCase() === "safe" ? "green" : (riskLabel || "").toLowerCase() === "high" || (riskLabel || "").toLowerCase() === "toxic" ? "red" : "orange"}">
            <strong>Risk Level:</strong> ${riskLabel.toUpperCase()}</p>
          <p>${layman}</p>
        </div>`
    })
    .join("")

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:800px;margin:24px auto;padding:0 18px;color:#111}h1{color:#0c2340}h2{color:#009688} .header{display:flex;justify-content:space-between;align-items:center}</style>
    </head><body>
    <div class="header"><h1>${title}</h1><div>Patient: PGX-2026-00142</div></div>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <hr/>
    ${body}
    <hr/><p style="color:#666;font-size:12px">Generated by PharmaGuard - Precision Pharmacogenomic Risk Prediction System</p>
    </body></html>`

  return new Blob([html], { type: "text/html" })
}

export async function chatQuery(message: string): Promise<string> {
  // Mock: simulate LLM response
  await new Promise((resolve) => setTimeout(resolve, 1200))
  // When backend is ready, replace with:
  // const res = await fetch(`${API_BASE}/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message }),
  // })
  // const data = await res.json()
  // return data.response
  return ""
}
