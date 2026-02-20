"use client"

import { useEffect, useRef } from "react"

export function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)

    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const strands = 3
      const amplitude = 40
      const frequency = 0.008
      const speed = 0.015

      for (let s = 0; s < strands; s++) {
        const offsetX = (w / (strands + 1)) * (s + 1)
        const opacity = 0.06 + s * 0.02

        for (let y = -20; y < h + 20; y += 4) {
          const x1 = offsetX + Math.sin(y * frequency + time + s) * amplitude
          const x2 = offsetX - Math.sin(y * frequency + time + s) * amplitude

          ctx.beginPath()
          ctx.arc(x1, y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 150, 136, ${opacity})`
          ctx.fill()

          ctx.beginPath()
          ctx.arc(x2, y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(12, 35, 64, ${opacity})`
          ctx.fill()

          if (y % 24 === 0) {
            ctx.beginPath()
            ctx.moveTo(x1, y)
            ctx.lineTo(x2, y)
            ctx.strokeStyle = `rgba(0, 150, 136, ${opacity * 0.5})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      time += speed
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
