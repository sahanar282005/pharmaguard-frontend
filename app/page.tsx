"use client"

import Link from "next/link"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { SUPPORTED_GENES } from "@/lib/mock-data"
import { DNABackground } from "@/components/dna-background"
import { AnimatedCounter } from "@/components/animated-counter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  Brain,
  UserCheck,
  ArrowRight,
  Dna,
  ShieldCheck,
  FlaskConical,
  Play,
} from "lucide-react"

export default function HomePage() {
  const { language } = usePharma()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <DNABackground />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Precision Pharmacogenomics</span>
          </div>

          <h1 className="max-w-4xl text-balance font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            {t("hero.title", language)}
          </h1>

          <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            {t("hero.subtitle", language)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 font-semibold">
                <FlaskConical className="h-5 w-5" />
                {t("hero.cta.analyze", language)}
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="gap-2 font-semibold">
                <Play className="h-4 w-4" />
                {t("hero.cta.demo", language)}
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-risk-safe" />
              <span>CPIC Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Explainable AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>HIPAA Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Animated Counters */}
      <section className="border-y border-border/50 bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            {t("problem.title", language)}
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-muted-foreground">
            Adverse drug reactions remain one of the leading causes of hospitalization and death. Pharmacogenomics can change that.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
              <CardContent className="py-10">
                <AnimatedCounter end={2000000} suffix="+" label={t("problem.stat1", language)} />
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
              <CardContent className="py-10">
                <AnimatedCounter end={95} suffix="%" label={t("problem.stat2", language)} />
              </CardContent>
            </Card>
            <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
              <CardContent className="py-10">
                <AnimatedCounter end={528} prefix="$" suffix="B" label={t("problem.stat3", language)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            {t("howItWorks.title", language)}
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-muted-foreground">
            From genetic data to personalized treatment in three simple steps.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Upload,
                step: "01",
                title: t("howItWorks.step1", language),
                desc: "Upload a standard VCF file containing patient genetic variant data.",
              },
              {
                icon: Brain,
                step: "02",
                title: t("howItWorks.step2", language),
                desc: "Our AI engine analyzes genetic variants against CPIC-aligned pharmacogenomic databases.",
              },
              {
                icon: UserCheck,
                step: "03",
                title: t("howItWorks.step3", language),
                desc: "Receive personalized risk scores, dosage recommendations, and explainable insights.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="group relative overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm transition-all hover:border-accent/30 hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                  <span className="font-display text-6xl font-bold text-muted/80">
                    {item.step}
                  </span>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connector arrows - desktop only */}
          <div className="mt-8 hidden items-center justify-center gap-4 md:flex">
            <ArrowRight className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">Seamless end-to-end pipeline</span>
            <ArrowRight className="h-5 w-5 text-accent" />
          </div>
        </div>
      </section>

      {/* Supported Genes */}
      <section className="border-t border-border/50 bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            {t("genes.title", language)}
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-muted-foreground">
            Our platform analyzes key pharmacogenes with CPIC Level A evidence for actionable drug-gene interactions.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTED_GENES.map((gene) => (
              <Card
                key={gene.name}
                className="group border-border/30 bg-card/60 backdrop-blur-sm transition-all hover:border-accent/30 hover:shadow-lg"
              >
                <CardContent className="flex flex-col gap-3 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Dna className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {gene.name}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {gene.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gene.drugs.map((drug) => (
                      <span
                        key={drug}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {drug}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Placeholder */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            See It In Action
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Watch how PharmaGuard transforms raw genetic data into actionable clinical insights.
          </p>
          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex aspect-video flex-col items-center justify-center gap-4 p-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Demo video coming soon</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-primary py-20 text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center lg:px-8">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Ready to Personalize Treatment?
          </h2>
          <p className="text-primary-foreground/80">
            Start analyzing pharmacogenomic data today and deliver safer, more effective prescriptions.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2 font-semibold">
              <FlaskConical className="h-5 w-5" />
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-foreground">PharmaGuard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              RIFT 2026 Hackathon - Pharmacogenomics / Explainable AI Track
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground">About</Link>
              <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
              <Link href="/chat" className="hover:text-foreground">Chat</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
