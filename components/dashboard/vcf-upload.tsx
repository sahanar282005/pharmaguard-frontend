"use client"

import { useState, useRef, useCallback } from "react"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileCheck, X, AlertTriangle } from "lucide-react"

interface VCFUploadProps {
  onFileSelect: (file: File) => void
  file: File | null
  onClear: () => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function VCFUpload({ onFileSelect, file, onClear }: VCFUploadProps) {
  const { language } = usePharma()
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((f: File) => {
    if (f.size > MAX_SIZE) {
      setError("File exceeds 5MB limit.")
      return false
    }
    if (!f.name.endsWith(".vcf") && !f.name.endsWith(".vcf.gz")) {
      setError("Invalid file format. Please upload a .vcf or .vcf.gz file.")
      return false
    }
    setError(null)
    return true
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && validateFile(f)) onFileSelect(f)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f && validateFile(f)) onFileSelect(f)
  }

  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Upload className="h-5 w-5 text-accent" />
          {t("dashboard.upload", language)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-risk-safe/30 bg-risk-safe/5 p-4">
            <FileCheck className="h-6 w-6 text-risk-safe" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors ${
              isDragOver
                ? "border-accent bg-accent/5"
                : "border-border/50 hover:border-accent/50 hover:bg-secondary/30"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.uploadDesc", language)}
            </p>
            <p className="text-xs text-muted-foreground">
              Accepted: .vcf, .vcf.gz (max 5MB)
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".vcf,.vcf.gz"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
