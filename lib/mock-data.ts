import type { AnalysisResult, FoodInteraction } from "@/types"

export const SUPPORTED_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL",
] as const

export const SUPPORTED_GENES = [
  {
    name: "CYP2D6",
    description: "Metabolizes ~25% of prescribed drugs including codeine, antidepressants, and antipsychotics.",
    drugs: ["Codeine", "Tramadol", "Tamoxifen"],
  },
  {
    name: "CYP2C19",
    description: "Critical for clopidogrel activation and proton pump inhibitor metabolism.",
    drugs: ["Clopidogrel", "Omeprazole", "Voriconazole"],
  },
  {
    name: "CYP2C9",
    description: "Primary enzyme for warfarin metabolism. Variants significantly affect bleeding risk.",
    drugs: ["Warfarin", "Phenytoin", "Celecoxib"],
  },
  {
    name: "SLCO1B1",
    description: "Hepatic transporter for statins. Variants increase myopathy risk with simvastatin.",
    drugs: ["Simvastatin", "Atorvastatin", "Rosuvastatin"],
  },
  {
    name: "TPMT",
    description: "Metabolizes thiopurine drugs. Deficiency causes severe myelosuppression.",
    drugs: ["Azathioprine", "Mercaptopurine", "Thioguanine"],
  },
  {
    name: "DPYD",
    description: "Essential for fluoropyrimidine metabolism. Deficiency can be life-threatening.",
    drugs: ["Fluorouracil", "Capecitabine", "Tegafur"],
  },
]

export const FOOD_INTERACTIONS: FoodInteraction[] = [
  { id: "grapefruit", name: "Grapefruit", checked: false },
  { id: "alcohol", name: "Alcohol", checked: false },
  { id: "highfat", name: "High-fat meal", checked: false },
  { id: "milk", name: "Milk / Calcium", checked: false },
  { id: "herbal", name: "Herbal supplements", checked: false },
  { id: "fasting", name: "Fasting", checked: false },
  { id: "greens", name: "Green leafy vegetables", checked: false },
  { id: "energy", name: "Energy drinks", checked: false },
]

export const MOCK_RESULTS: AnalysisResult[] = [
  {
    patient_id: "PGX-2026-00142",
    drug: "CODEINE",
    timestamp: new Date().toISOString(),
    risk_assessment: {
      drug: "CODEINE",
      gene: "CYP2D6",
      riskLevel: "toxic",
      confidence: 0.94,
      severity: 85,
      metabolizerStatus: "URM",
      description: "Ultra-rapid metabolizer detected. Rapid conversion to morphine may cause respiratory depression.",
    },
    pharmacogenomic_profile: {
      gene: "CYP2D6",
      diplotype: "*1/*1xN",
      phenotype: "Ultra-rapid Metabolizer",
      activityScore: 3.0,
      metabolizerStatus: "URM",
    },
    clinical_recommendation: {
      drug: "CODEINE",
      recommendation: "AVOID codeine. Select alternative analgesic not metabolized by CYP2D6.",
      dosageAdjustment: "Do not prescribe. Use morphine with careful dose titration or non-opioid alternatives.",
      alternativeDrugs: ["Morphine (with dose titration)", "Acetaminophen", "NSAIDs"],
      monitoring: "Monitor respiratory rate if any opioid is used. Consider naloxone availability.",
      cpicLevel: "Strong recommendation",
    },
    llm_generated_explanation: {
      clinical: "Patient carries CYP2D6 *1/*1xN (ultra-rapid metabolizer phenotype, activity score 3.0). Codeine is a prodrug that requires CYP2D6-mediated O-demethylation to morphine for analgesic effect. In ultra-rapid metabolizers, this conversion occurs at significantly elevated rates, producing supratherapeutic morphine concentrations. This increases the risk of respiratory depression, CNS depression, and potentially fatal toxicity. CPIC guidelines strongly recommend avoiding codeine in URM patients.",
      layman: "Your genetic test shows your body processes codeine much faster than normal. This means codeine could build up to dangerous levels in your system and cause serious breathing problems. Your doctor should use a different pain medication that is safer for your genetic profile.",
    },
    quality_metrics: {
      dataCompleteness: 98,
      confidenceScore: 0.94,
      evidenceLevel: "1A",
      cpicGuideline: "CPIC Guideline for CYP2D6 and Codeine Therapy (2019 Update)",
      lastUpdated: "2026-01-15",
    },
  },
  {
    patient_id: "PGX-2026-00142",
    drug: "WARFARIN",
    timestamp: new Date().toISOString(),
    risk_assessment: {
      drug: "WARFARIN",
      gene: "CYP2C9",
      riskLevel: "adjust",
      confidence: 0.89,
      severity: 62,
      metabolizerStatus: "IM",
      description: "Intermediate metabolizer detected. Reduced clearance increases bleeding risk at standard doses.",
    },
    pharmacogenomic_profile: {
      gene: "CYP2C9",
      diplotype: "*1/*3",
      phenotype: "Intermediate Metabolizer",
      activityScore: 1.5,
      metabolizerStatus: "IM",
    },
    clinical_recommendation: {
      drug: "WARFARIN",
      recommendation: "Reduce initial warfarin dose based on pharmacogenomic dosing algorithm.",
      dosageAdjustment: "Start at 3-4 mg/day instead of standard 5 mg/day. Monitor INR closely.",
      alternativeDrugs: ["DOACs (Apixaban, Rivaroxaban)"],
      monitoring: "Frequent INR monitoring during initiation. Target INR 2.0-3.0.",
      cpicLevel: "Strong recommendation",
    },
    llm_generated_explanation: {
      clinical: "Patient carries CYP2C9 *1/*3 (intermediate metabolizer phenotype, activity score 1.5). S-warfarin is primarily metabolized by CYP2C9. The *3 allele reduces enzymatic activity by approximately 80%. Patients with this genotype require lower maintenance doses (mean reduction of 20-33%) to achieve therapeutic INR and have increased risk of over-anticoagulation and bleeding events.",
      layman: "Your genetic test shows your body breaks down warfarin (a blood thinner) more slowly than most people. This means you need a lower dose than usual to keep your blood at the right thickness. Your doctor will start you on a smaller dose and check your blood levels more often to make sure it is safe.",
    },
    quality_metrics: {
      dataCompleteness: 95,
      confidenceScore: 0.89,
      evidenceLevel: "1A",
      cpicGuideline: "CPIC Guideline for Pharmacogenetics-Guided Warfarin Dosing (2017)",
      lastUpdated: "2026-01-15",
    },
  },
  {
    patient_id: "PGX-2026-00142",
    drug: "CLOPIDOGREL",
    timestamp: new Date().toISOString(),
    risk_assessment: {
      drug: "CLOPIDOGREL",
      gene: "CYP2C19",
      riskLevel: "ineffective",
      confidence: 0.91,
      severity: 70,
      metabolizerStatus: "PM",
      description: "Poor metabolizer detected. Clopidogrel cannot be activated, leaving patient unprotected from thrombotic events.",
    },
    pharmacogenomic_profile: {
      gene: "CYP2C19",
      diplotype: "*2/*2",
      phenotype: "Poor Metabolizer",
      activityScore: 0,
      metabolizerStatus: "PM",
    },
    clinical_recommendation: {
      drug: "CLOPIDOGREL",
      recommendation: "AVOID clopidogrel. Switch to alternative antiplatelet agent.",
      dosageAdjustment: "Do not prescribe. Use prasugrel or ticagrelor as alternatives.",
      alternativeDrugs: ["Prasugrel", "Ticagrelor"],
      monitoring: "Monitor for cardiovascular events. Consider platelet function testing.",
      cpicLevel: "Strong recommendation",
    },
    llm_generated_explanation: {
      clinical: "Patient carries CYP2C19 *2/*2 (poor metabolizer phenotype, activity score 0). Clopidogrel is a prodrug requiring CYP2C19-mediated bioactivation. Poor metabolizers show significantly reduced active metabolite formation, resulting in diminished platelet inhibition and elevated risk of major adverse cardiovascular events (MACE) including stent thrombosis.",
      layman: "Your genetic test shows your body cannot activate clopidogrel (a blood clot prevention medicine). This means the drug will not work for you and you could still be at risk for blood clots. Your doctor should prescribe an alternative medication like prasugrel or ticagrelor that works differently.",
    },
    quality_metrics: {
      dataCompleteness: 92,
      confidenceScore: 0.91,
      evidenceLevel: "1A",
      cpicGuideline: "CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2022)",
      lastUpdated: "2026-01-15",
    },
  },
]

export const MOCK_CHAT_RESPONSES: Record<string, string> = {
  default: "I can help you understand pharmacogenomic results, drug-gene interactions, and medication risks. Please ask me a specific question about your analysis results or a particular drug-gene pair.",
  codeine: "Codeine is metabolized by CYP2D6 into morphine. Ultra-rapid metabolizers (URM) convert codeine to morphine very quickly, which can lead to dangerously high morphine levels. Poor metabolizers (PM) get little to no pain relief because they cannot convert codeine effectively. CPIC recommends avoiding codeine in both URM and PM patients.",
  warfarin: "Warfarin dosing is heavily influenced by CYP2C9 and VKORC1 genotypes. CYP2C9 poor metabolizers need significantly lower doses (sometimes 50-75% reduction) to avoid over-anticoagulation and bleeding. Pharmacogenomic-guided dosing has been shown to improve time-in-therapeutic-range.",
  clopidogrel: "Clopidogrel is a prodrug that requires CYP2C19 activation. Poor metabolizers (CYP2C19 *2/*2) cannot activate clopidogrel, leaving them at high risk for cardiovascular events. CPIC recommends switching to prasugrel or ticagrelor for these patients.",
  grapefruit: "Grapefruit inhibits CYP3A4 enzymes in the gut and liver, which can increase blood levels of many medications including statins, calcium channel blockers, and immunosuppressants. Patients on simvastatin should avoid grapefruit as it significantly increases risk of myopathy.",
  interaction: "Food-drug interactions can significantly alter drug metabolism. For example: grapefruit inhibits CYP3A4, green leafy vegetables affect warfarin efficacy via Vitamin K, and high-fat meals can increase absorption of lipophilic drugs. Always report dietary habits to your healthcare provider.",
  risk: "Risk levels in pharmacogenomics are determined by the combination of genetic variants and drug properties. We use CPIC guidelines to classify risk: Safe (normal metabolism), Adjust Dosage (intermediate metabolizers), Toxic (rapid metabolism of prodrugs or slow metabolism of active drugs), and Ineffective (poor activation of prodrugs).",
}
