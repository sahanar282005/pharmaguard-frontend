"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  label: string
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <span className="font-display text-4xl font-bold text-primary lg:text-5xl">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
