"use client"

import { useEffect, useState } from "react"
import type { MetabolizerStatus } from "@/types"

const STATUSES: MetabolizerStatus[] = ["PM", "IM", "NM", "RM", "URM"]
const STATUS_LABELS: Record<MetabolizerStatus, string> = {
  PM: "Poor",
  IM: "Intermediate",
  NM: "Normal",
  RM: "Rapid",
  URM: "Ultra-Rapid",
}

interface EnzymeTwinProps {
  metabolizerStatus: MetabolizerStatus
  activityScore: number
}

export function EnzymeTwin({ metabolizerStatus, activityScore }: EnzymeTwinProps) {
  const [animated, setAnimated] = useState(false)
  const activeIndex = STATUSES.indexOf(metabolizerStatus)
  const isPM = metabolizerStatus === "PM"
  const isURM = metabolizerStatus === "URM"

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Drug buildup / rapid animation speed
  const barSpeed = isPM ? "8s" : isURM ? "0.6s" : "2s"
  const buildupWidth = isPM ? 90 : isURM ? 15 : 50

  return (
    <div className="rounded-lg border border-border/30 bg-secondary/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Enzyme Digital Twin
        </span>
        <span className="text-xs text-muted-foreground">
          Activity Score: {activityScore}
        </span>
      </div>

      {/* Metabolism slider */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between">
          {STATUSES.map((status, i) => {
            const isActive = i === activeIndex
            return (
              <div key={status} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-700 ${
                    isActive
                      ? i <= 1
                        ? "bg-risk-toxic text-[oklch(0.99_0_0)] scale-110"
                        : i === 2
                          ? "bg-risk-safe text-[oklch(0.99_0_0)] scale-110"
                          : "bg-risk-adjust text-[oklch(0.15_0_0)] scale-110"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {status}
                </div>
                <span
                  className={`text-[10px] ${
                    isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>
            )
          })}
        </div>
        {/* Connector line */}
        <div className="absolute left-[16px] right-[16px] top-[16px] -z-10 h-0.5 bg-border/50" />
        <div
          className={`absolute left-[16px] top-[16px] -z-10 h-0.5 transition-all duration-1000 ${
            activeIndex <= 1
              ? "bg-risk-toxic"
              : activeIndex === 2
                ? "bg-risk-safe"
                : "bg-risk-adjust"
          }`}
          style={{
            width: animated ? `${(activeIndex / (STATUSES.length - 1)) * 100}%` : "0%",
          }}
        />
      </div>

      {/* Drug level visualization */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {isPM ? "Drug Buildup in Body" : isURM ? "Rapid Drug Clearance" : "Drug Level"}
          </span>
          <span className="text-muted-foreground">
            {isPM ? "Dangerously High" : isURM ? "Subtherapeutic" : "Therapeutic"}
          </span>
        </div>
        <div className="relative h-6 overflow-hidden rounded-full bg-secondary">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-[2000ms] ${
              isPM
                ? "bg-risk-toxic"
                : isURM
                  ? "bg-risk-ineffective"
                  : "bg-risk-safe"
            }`}
            style={{ width: animated ? `${buildupWidth}%` : "0%" }}
          />
          {/* Animated pulse for PM */}
          {isPM && animated && (
            <div className="absolute inset-0 animate-pulse rounded-full bg-risk-toxic/20" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {isPM &&
            "Slow metabolism causes drug accumulation, increasing toxicity risk."}
          {isURM &&
            "Ultra-rapid metabolism clears drug too quickly, reducing therapeutic effect."}
          {!isPM &&
            !isURM &&
            "Normal to slightly altered metabolism. Follow standard or adjusted dosing."}
        </p>
      </div>
    </div>
  )
}
