"use client"

import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Dna, Brain, Layout, ShieldCheck, FileText, Database, Layers } from "lucide-react"

const sections = [
  {
    key: "about.pharmacogenomics",
    icon: Dna,
    content: [
      "Pharmacogenomics (PGx) is the study of how genes affect a person's response to drugs. It combines pharmacology (the science of drugs) and genomics (the study of genes and their functions) to develop effective, safe medications and doses tailored to genetic makeup.",
      "Key principles include:",
      "- Genetic variants in drug-metabolizing enzymes (CYP450 family) can dramatically alter drug efficacy and safety",
      "- The Clinical Pharmacogenetics Implementation Consortium (CPIC) provides peer-reviewed, evidence-based guidelines for drug-gene pairs",
      "- Metabolizer phenotypes (PM, IM, NM, RM, URM) predict drug response and guide dosing decisions",
      "- Pharmacogenomic testing can prevent adverse drug reactions and improve therapeutic outcomes",
    ],
  },
  {
    key: "about.cpic",
    icon: FileText,
    content: [
      "PharmaGuard aligns with CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines, the gold standard for pharmacogenomic clinical decision support.",
      "Our alignment includes:",
      "- Level A evidence: Gene-drug pairs with sufficient evidence for prescribing changes",
      "- Standardized phenotype assignment using the CPIC activity score system",
      "- Dosing recommendations based on published CPIC guidelines",
      "- Regular updates synchronized with CPIC guideline publications",
      "- Support for all major CPIC-covered gene-drug pairs including CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, and DPYD",
    ],
  },
  {
    key: "about.xai",
    icon: Brain,
    content: [
      "Our Explainable AI (XAI) architecture ensures that every prediction is transparent and interpretable for healthcare professionals.",
      "Architecture components:",
      "- Feature Attribution: SHAP values identify which genetic variants drive risk predictions",
      "- Dual Explanation Layer: Clinical explanations for professionals, simplified explanations for patients",
      "- Confidence Scoring: Multi-factor confidence metrics based on data completeness, evidence level, and model certainty",
      "- Quality Metrics Dashboard: Real-time visibility into prediction reliability",
      "- Audit Trail: Complete logging of decision pathways for regulatory compliance",
    ],
  },
  {
    key: "about.system",
    icon: Layout,
    content: [
      "PharmaGuard is designed as a modular, scalable clinical decision support system.",
      "System architecture:",
      "- Frontend: Next.js 16 with TypeScript, Tailwind CSS, and shadcn/ui for a responsive, accessible interface",
      "- Backend (planned): FastAPI for high-performance API endpoints with async processing",
      "- AI Engine: Ensemble model combining rule-based CPIC logic with machine learning for edge cases",
      "- Data Pipeline: VCF parsing, variant calling, and haplotype inference pipeline",
      "- Report Engine: Dual-format PDF generation (clinical and patient-facing)",
      "- Integration Layer: RESTful API design ready for EHR integration (HL7 FHIR compatible)",
    ],
  },
]

export default function AboutPage() {
  const { language } = usePharma()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-4 py-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Documentation</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          {t("about.title", language)}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Understanding the science, standards, and technology behind PharmaGuard.
        </p>
      </div>

      {/* Overview cards */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Database, label: "6 Key Pharmacogenes", desc: "CPIC Level A evidence" },
          { icon: Layers, label: "Dual AI Explanation", desc: "Clinical + Patient-friendly" },
          { icon: ShieldCheck, label: "Production Ready", desc: "Modular architecture" },
        ].map((item) => (
          <Card key={item.label} className="border-border/30 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed sections */}
      <Accordion type="multiple" defaultValue={[sections[0].key]} className="flex flex-col gap-4">
        {sections.map((section) => (
          <AccordionItem
            key={section.key}
            value={section.key}
            className="rounded-lg border border-border/30 bg-card/60 px-0 backdrop-blur-sm"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-display text-lg font-semibold text-foreground">
                  {t(section.key, language)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="flex flex-col gap-3 pl-12">
                {section.content.map((line, i) => (
                  <p
                    key={i}
                    className={`text-sm leading-relaxed ${
                      line.startsWith("-")
                        ? "pl-4 text-muted-foreground"
                        : "text-foreground/90"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Tech Stack */}
      <Card className="mt-12 border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              "Next.js 16",
              "TypeScript",
              "Tailwind CSS",
              "shadcn/ui",
              "Lucide Icons",
              "Framer Motion",
              "FastAPI (Backend)",
              "Python",
              "CPIC Database",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/50 bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
