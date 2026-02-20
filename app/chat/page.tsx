"use client"

import { useState, useRef, useEffect } from "react"
import { usePharma } from "@/hooks/use-pharma-context"
import { t } from "@/lib/i18n"
import { MOCK_CHAT_RESPONSES } from "@/lib/mock-data"
import type { ChatMessage } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Send,
  Mic,
  MicOff,
  User,
  Bot,
  Loader2,
  Volume2,
  Shield,
} from "lucide-react"

function findResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes("codeine") || lower.includes("cyp2d6"))
    return MOCK_CHAT_RESPONSES.codeine
  if (lower.includes("warfarin") || lower.includes("cyp2c9"))
    return MOCK_CHAT_RESPONSES.warfarin
  if (lower.includes("clopidogrel") || lower.includes("cyp2c19"))
    return MOCK_CHAT_RESPONSES.clopidogrel
  if (lower.includes("grapefruit"))
    return MOCK_CHAT_RESPONSES.grapefruit
  if (lower.includes("food") || lower.includes("interaction") || lower.includes("diet"))
    return MOCK_CHAT_RESPONSES.interaction
  if (lower.includes("risk") || lower.includes("level") || lower.includes("score"))
    return MOCK_CHAT_RESPONSES.risk
  return MOCK_CHAT_RESPONSES.default
}

export default function ChatPage() {
  const { language } = usePharma()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to the PharmaGuard AI Assistant. I can help you understand pharmacogenomic results, drug-gene interactions, food-drug interactions, and medication risks. Ask me anything about your analysis or a specific drug-gene pair.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  async function handleSend() {
    if (!input.trim()) return
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate response delay
    await new Promise((r) => setTimeout(r, 1200))

    const response = findResponse(userMessage.content)
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }

  function handleVoice() {
    if (isListening) {
      setIsListening(false)
      setVoiceStatus("")
      return
    }
    setIsListening(true)
    setVoiceStatus("Listening...")

    // Simulate voice processing
    setTimeout(() => {
      setVoiceStatus("Analyzing voice query...")
    }, 1500)
    setTimeout(() => {
      setIsListening(false)
      setVoiceStatus("")
      const voiceQuery = "What is the risk of codeine for CYP2D6 ultra-rapid metabolizers?"
      setInput(voiceQuery)
    }, 3000)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            {t("chat.title", language)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask about drug-gene mechanisms, risks, and food interactions
          </p>
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex flex-1 flex-col border-border/30 bg-card/60 backdrop-blur-sm">
        <CardContent className="flex flex-1 flex-col p-0">
          <ScrollArea className="flex-1 p-4" style={{ height: "calc(100vh - 22rem)" }}>
            <div ref={scrollRef} className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10"
                        : "bg-accent/10"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <div className="rounded-xl bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Voice status */}
          {voiceStatus && (
            <div className="flex items-center justify-center gap-2 border-t border-border/30 bg-accent/5 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-risk-toxic" />
              <span className="text-sm text-accent">{voiceStatus}</span>
            </div>
          )}

          {/* Input area */}
          <div className="flex items-center gap-2 border-t border-border/30 p-4">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={handleVoice}
              className="h-10 w-10 shrink-0"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              <span className="sr-only">{t("chat.voice", language)}</span>
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("chat.placeholder", language)}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">{t("chat.send", language)}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggested queries */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "What is the risk of codeine?",
          "Explain CYP2D6 metabolism",
          "Grapefruit interactions",
          "How are risk levels determined?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
