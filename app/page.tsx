"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles, Eye, Stars, Moon, Zap, Clock, Brain, Heart } from "lucide-react"
import Link from "next/link"

interface MousePosition {
  x: number
  y: number
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return mousePosition
}

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const hexInt = parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255
  return [red, green, blue]
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 60,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#FFD700",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<Circle[]>([])
  const mousePosition = MousePosition()
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }
    initCanvas()
    animate()
    window.addEventListener("resize", initCanvas)

    return () => {
      window.removeEventListener("resize", initCanvas)
    }
  }, [color])

  useEffect(() => {
    onMouseMove()
  }, [mousePosition.x, mousePosition.y])

  useEffect(() => {
    initCanvas()
  }, [refresh])

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = mousePosition.x - rect.left - w / 2
      const y = mousePosition.y - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
  }

  type Circle = {
    x: number
    y: number
    translateX: number
    translateY: number
    size: number
    alpha: number
    targetAlpha: number
    dx: number
    dy: number
    magnetism: number
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
    }
  }

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const translateX = 0
    const translateY = 0
    const pSize = Math.floor(Math.random() * 2) + size
    const alpha = 0
    const targetAlpha = parseFloat((Math.random() * 0.3 + 0.1).toFixed(1))
    const dx = (Math.random() - 0.5) * 0.03
    const dy = (Math.random() - 0.5) * 0.03
    const magnetism = 0.1 + Math.random() * 1.5
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    }
  }

  const rgb = hexToRgb(color)

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle
      context.current.translate(translateX, translateY)
      context.current.beginPath()
      context.current.arc(x, y, size, 0, 2 * Math.PI)
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
      context.current.fill()
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!update) {
        circles.current.push(circle)
      }
    }
  }

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      )
    }
  }

  const drawParticles = () => {
    clearContext()
    const particleCount = quantity
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams()
      drawCircle(circle)
    }
  }

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return remapped > 0 ? remapped : 0
  }

  const animate = () => {
    clearContext()
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      )
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge
      }
      circle.x += circle.dx + vx
      circle.y += circle.dy + vy
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease

      drawCircle(circle, true)

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1)
        const newCircle = circleParams()
        drawCircle(newCircle)
      }
    })
    window.requestAnimationFrame(animate)
  }

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}

function TarotSnapHomepage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: "easeOut" }
      })
    }, 200)

    return () => clearTimeout(timer)
  }, [controls])

  // Floating and rotating card animations
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      rotateY: 180,
      scale: 0.7
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }),
    floating: (i: number) => ({
      y: [0, -20, 0],
      rotateY: [-8, 8, -8],
      rotateZ: [-2, 2, -2],
      transition: {
        delay: i * 0.5,
        duration: 4 + i * 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  }

  const mysticalCards = [
    { 
      icon: Stars, 
      name: "The Star", 
      meaning: "Hope & Guidance",
      gradient: "from-amber-600 via-yellow-500 to-orange-500"
    },
    { 
      icon: Moon, 
      name: "The Moon", 
      meaning: "Intuition & Mystery",
      gradient: "from-slate-600 via-blue-500 to-indigo-600"
    },
    { 
      icon: Eye, 
      name: "The High Priestess", 
      meaning: "Inner Wisdom",
      gradient: "from-purple-600 via-indigo-500 to-blue-600"
    }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden">
      {/* Subtle Background Particles */}
      <Particles
        className="absolute inset-0"
        quantity={80}
        ease={40}
        color="#FFD700"
        refresh
      />

      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 min-h-screen items-center">
            
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={controls}
              className="space-y-8"
            >
              {/* Competitive Advantage Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full px-6 py-3"
              >
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-semibold text-sm">
                  Unlike TarotOO - We Remember Your Journey
                </span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  TarotSnap
                </motion.h1>
                
                <motion.h2
                  className="text-2xl lg:text-3xl text-slate-300 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Your AI Mystic That <span className="text-amber-300 font-semibold">Evolves With You</span>
                </motion.h2>
              </div>

              {/* Key Differentiators */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <div className="flex items-center gap-3 text-slate-300">
                  <Brain className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Builds deep understanding of your spiritual path</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Instant readings, 24/7 - no waiting for human readers</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Heart className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Personal growth tracking across all your sessions</span>
                </div>
              </motion.div>

              {/* Value Proposition */}
              <motion.p 
                className="text-xl text-slate-400 leading-relaxed max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                Ancient wisdom meets AI memory. Every reading builds upon your last, 
                creating truly personalized spiritual guidance.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <Link href="/reading/single">
                  <motion.button
                    className="group relative px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 rounded-full text-slate-900 font-bold text-lg shadow-2xl shadow-amber-500/25"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 40px -12px rgba(245, 158, 11, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Start Your Journey</span>
                    </span>
                    
                    {/* Subtle shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Floating Tarot Cards */}
            <motion.div
              className="relative h-full min-h-[600px] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <div className="relative w-full max-w-md">
                {mysticalCards.map((card, i) => (
                  <motion.div
                    key={card.name}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate={["visible", "floating"]}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 25}%`,
                      zIndex: 3 - i
                    }}
                  >
                    {/* Card Container */}
                    <div className={cn(
                      "relative w-40 h-64 lg:w-48 lg:h-80",
                      "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
                      "rounded-2xl border-2 border-amber-400/40 shadow-2xl shadow-amber-500/20",
                      "backdrop-blur-sm cursor-pointer group",
                      "hover:border-amber-400/70 transition-all duration-300"
                    )}>
                      {/* Inner glow */}
                      <div className="absolute inset-2 rounded-xl border border-amber-400/20 group-hover:border-amber-400/40 transition-all duration-300" />
                      
                      {/* Card face gradient */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300",
                        `bg-gradient-to-br ${card.gradient}`
                      )} />
                      
                      {/* Card Icon */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                          <card.icon className="w-12 h-12 lg:w-14 lg:h-14 text-amber-300 drop-shadow-lg" />
                          {/* Icon glow */}
                          <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-lg scale-150 opacity-50" />
                        </div>
                      </div>
                      
                      {/* Card Name */}
                      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-amber-300 font-bold text-lg lg:text-xl tracking-wide mb-1">
                          {card.name}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {card.meaning}
                        </div>
                      </div>
                      
                      {/* Mystical corners */}
                      <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-amber-400/50" />
                      <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-amber-400/50" />
                      <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-amber-400/50" />
                      <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-amber-400/50" />
                    </div>

                    {/* Floating aura effect */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-500" />
                    </div>
                  </motion.div>
                ))}

                {/* Mystical energy lines between cards */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 2 }}
                >
                  <svg className="w-full h-full opacity-20">
                    <defs>
                      <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#FFA500" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M 60 80 Q 200 150 120 300 Q 180 400 260 360"
                      stroke="url(#energyGradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 2, duration: 3, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Mystical Quote */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-amber-400/60">
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-sm font-light tracking-wider"
          >
            ✨ "The cards reveal what the soul already knows" ✨
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TarotSnapHomepage
