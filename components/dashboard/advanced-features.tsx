"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, AlertOctagon, Shield } from "lucide-react"

const mockSafetyRanking = [
  { drug: "Acetaminophen", score: 92, risk: "Low" },
  { drug: "Ibuprofen", score: 85, risk: "Low" },
  { drug: "Clopidogrel", score: 34, risk: "High" },
  { drug: "Codeine", score: 18, risk: "Critical" },
  { drug: "Warfarin", score: 55, risk: "Moderate" },
]

export function AdvancedFeatures() {
  return (
    <div className="flex flex-col gap-6">
      {/* Drug Safety Ranking */}
      <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Trophy className="h-5 w-5 text-accent" />
            Drug Safety Ranking
            <Badge variant="secondary" className="text-[10px]">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSafetyRanking.map((item) => (
                <TableRow key={item.drug}>
                  <TableCell className="font-medium">{item.drug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.score} className="h-2 w-20" />
                      <span className="text-xs">{item.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.risk === "Low"
                          ? "border-risk-safe/30 text-risk-safe"
                          : item.risk === "Moderate"
                            ? "border-risk-adjust/30 text-risk-adjust"
                            : item.risk === "High"
                              ? "border-risk-ineffective/30 text-risk-ineffective"
                              : "border-risk-toxic/30 text-risk-toxic"
                      }
                    >
                      {item.risk}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Treatment Success Probability */}
      <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <TrendingUp className="h-5 w-5 text-accent" />
            Treatment Success Probability
            <Badge variant="secondary" className="text-[10px]">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {[
              { label: "Alternative Analgesic (Morphine)", value: 87 },
              { label: "Warfarin (Adjusted Dose)", value: 78 },
              { label: "Prasugrel (Alt. Antiplatelet)", value: 91 },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="font-semibold text-accent">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Combined Risk Escalation */}
      <Card className="border-border/30 border-risk-toxic/20 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <AlertOctagon className="h-5 w-5 text-risk-toxic" />
            Combined Risk Escalation Alert
            <Badge variant="secondary" className="text-[10px]">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-risk-toxic/20 bg-risk-toxic/5 p-4">
            <p className="text-sm text-foreground">
              Multiple high-risk drug-gene interactions detected. Combined polypharmacy
              risk score: <span className="font-bold text-risk-toxic">8.4/10</span>.
              Clinical review strongly recommended before prescribing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Mode Toggle */}
      <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Shield className="h-5 w-5 text-accent" />
            Hospital Mode
            <Badge variant="secondary" className="text-[10px]">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">Red Alert Mode</span>
              <span className="text-xs text-muted-foreground">
                Enable enhanced visual alerts for critical risk patients in clinical settings.
              </span>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
