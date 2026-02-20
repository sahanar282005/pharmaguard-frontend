export type RiskLevel = "safe" | "adjust" | "toxic" | "ineffective" | "unknown"

export type MetabolizerStatus = "PM" | "IM" | "NM" | "RM" | "URM"

export type UserRole = "doctor" | "pharmacist" | "researcher"

export type Language = "en" | "es" | "fr" | "hi"

export interface RiskAssessment {
  drug: string
  gene: string
  riskLevel: RiskLevel
  confidence: number
  severity: number
  metabolizerStatus: MetabolizerStatus
  description: string
}

export interface PharmacogenomicProfile {
  gene: string
  diplotype: string
  phenotype: string
  activityScore: number
  metabolizerStatus: MetabolizerStatus
}

export interface ClinicalRecommendation {
  drug: string
  recommendation: string
  dosageAdjustment: string
  alternativeDrugs: string[]
  monitoring: string
  cpicLevel: string
}

export interface LLMExplanation {
  clinical: string
  layman: string
}

export interface QualityMetrics {
  dataCompleteness: number
  confidenceScore: number
  evidenceLevel: string
  cpicGuideline: string
  lastUpdated: string
}

export interface AnalysisResult {
  patient_id: string
  drug: string
  timestamp: string
  risk_assessment: RiskAssessment
  pharmacogenomic_profile: PharmacogenomicProfile
  clinical_recommendation: ClinicalRecommendation
  llm_generated_explanation: LLMExplanation
  quality_metrics: QualityMetrics
}

export interface FoodInteraction {
  id: string
  name: string
  checked: boolean
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface User {
  email: string
  name: string
  role: UserRole
  avatar?: string
}
