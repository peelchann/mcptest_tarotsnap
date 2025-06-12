'use client';

import React, { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles, Eye, Stars, Moon, Zap } from "lucide-react"
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
  quantity = 80,
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
    const targetAlpha = parseFloat((Math.random() * 0.4 + 0.1).toFixed(1))
    const dx = (Math.random() - 0.5) * 0.05
    const dy = (Math.random() - 0.5) * 0.05
    const magnetism = 0.1 + Math.random() * 2
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

interface TextShimmerProps {
  children: string
  className?: string
  duration?: number
  spread?: number
}

function TextShimmer({
  children,
  className,
  duration = 3,
  spread = 2,
}: TextShimmerProps) {
  const dynamicSpread = children.length * spread

  return (
    <motion.div
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#8b7355] [--base-gradient-color:#FFD700]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#8b7355] dark:[--base-gradient-color:#FFD700] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </motion.div>
  )
}

function TarotRevealedHomepage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1.2, ease: "easeOut" }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [controls])

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      rotateY: 180, 
      scale: 0.8,
      y: 50 
    },
    visible: (i: number) => ({
      opacity: 1,
      rotateY: 0,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      rotateY: 5,
      y: -10,
      transition: { duration: 0.3 }
    }
  }

  const floatingCards = [
    { icon: Stars, name: "Insight", glow: "shadow-amber-500/50" },
    { icon: Eye, name: "Vision", glow: "shadow-yellow-400/50" },
    { icon: Moon, name: "Wisdom", glow: "shadow-orange-400/50" }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden">
      {/* Cosmic Background Particles */}
      <Particles
        className="absolute inset-0"
        quantity={120}
        ease={60}
        color="#FFD700"
        refresh
      />

      {/* Naval Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-indigo-950/40 animate-pulse" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="flex-1 flex items-center justify-center px-8 py-24">
          <div className="max-w-7xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              className="text-center space-y-12"
            >
              {/* Mystical Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 text-amber-400"
                  >
                    <Zap className="w-full h-full" />
                  </motion.div>
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
                </div>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1 
                  className="text-7xl lg:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 tracking-wide"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  TarotSnap
                </motion.h1>
                
                <TextShimmer 
                  className="text-3xl lg:text-5xl font-semibold text-slate-300"
                  duration={4}
                >
                  Your AI Mystic Awaits
                </TextShimmer>
              </div>

              {/* Three Mystical Cards */}
              <motion.div 
                className="flex justify-center items-center gap-8 lg:gap-12 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                {floatingCards.map((card, i) => (
                  <motion.div
                    key={card.name}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="group relative cursor-pointer"
                  >
                    {/* Card Container */}
                    <div className={cn(
                      "relative w-32 h-48 lg:w-40 lg:h-60",
                      "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
                      "rounded-xl border-2 border-amber-400/50 shadow-2xl",
                      card.glow,
                      "overflow-hidden"
                    )}>
                      {/* Inner Border */}
                      <div className="absolute inset-3 border border-amber-400/30 rounded-lg" />
                      
                      {/* Card Icon */}
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                        <card.icon className="w-8 h-8 lg:w-10 lg:h-10 text-amber-300" />
                      </div>
                      
                      {/* Card Name */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-amber-300 font-semibold text-sm lg:text-base tracking-wide">
                          {card.name}
                        </div>
                      </div>
                      
                      {/* Mystical Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-yellow-500/5 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 transition-all duration-300" />
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-shimmer" />
                      </div>
                    </div>

                    {/* Floating Aura */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className={cn(
                        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                        "w-48 h-48 lg:w-56 lg:w-56 bg-amber-500/10 rounded-full blur-2xl",
                        "group-hover:bg-amber-500/20 transition-all duration-500"
                      )} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Minimal Value Proposition */}
              <motion.div 
                className="space-y-6 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              >
                <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed font-light">
                  Ancient wisdom meets artificial intelligence. 
                  <span className="text-amber-300 font-medium"> Instant insights, timeless guidance.</span>
                </p>
              </motion.div>

              {/* Single Prominent CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                <Link href="/reading/single">
                  <motion.button
                    className="group relative px-12 py-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 rounded-full text-slate-900 font-bold text-xl shadow-2xl shadow-amber-500/25"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center space-x-3">
                      <Sparkles className="w-6 h-6" />
                      <span>Begin Your Reading</span>
                    </span>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full" />
                    </div>
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/30 transition-all duration-300" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Mystical Elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-amber-400/70">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-sm font-light tracking-wider"
          >
            ✨ The universe speaks through the cards ✨
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default TarotRevealedHomepage
