"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles, Star } from "lucide-react"
import Link from "next/link"
import { MysticalHeader } from "@/app/components/MysticalHeader"
import { getRandomCards, type TarotCard as TarotCardType } from "@/app/data/cards"
import TarotCard from "./TarotCard"

// Mystical particles background component
const MysticalBackground = () => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pre-calculate positions to avoid SSR issues
  const particles = React.useMemo(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    })), []
  )

  const orbs = React.useMemo(() => 
    [...Array(8)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 3,
    })), []
  )

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep purple mystical gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950" />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Larger mystical orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className="absolute w-2 h-2 bg-amber-300/20 rounded-full blur-sm"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Main hero section with central mystical element
const HeroSection = ({ heroCard }: { heroCard: TarotCardType | null }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 leading-tight tracking-tight">
            TarotSnap
          </h1>
          <h2 className="text-2xl md:text-4xl text-purple-200 font-light leading-relaxed">
            Psychic & Tarot Readings
          </h2>
        </motion.div>

        {/* Central spinning tarot card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-64 h-96 mx-auto relative">
            {heroCard ? (
              <motion.div
                className="w-full h-full relative"
                animate={{ rotateY: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                whileHover={{ scale: 1.05 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <TarotCard
                  card={heroCard}
                  isReversed={false}
                  isFlipped={true}
                  className="w-full h-full shadow-2xl"
                />
                
                {/* Mystical glow effect around the card */}
                <div className="absolute inset-0 bg-amber-400/20 rounded-xl blur-xl animate-pulse pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-amber-500/10 rounded-xl blur-2xl animate-pulse pointer-events-none" />
              </motion.div>
            ) : (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-800/50 to-indigo-900/50 rounded-xl backdrop-blur-sm border border-amber-400/30 shadow-2xl"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-20 h-20 text-amber-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-xl text-purple-300 font-light max-w-2xl mx-auto"
        >
          Ancient wisdom meets artificial intelligence. Instant insights, timeless guidance.
        </motion.p>
      </div>
    </section>
  )
}

// Reading types section
const ReadingTypesSection = ({ cards }: { cards: TarotCardType[] }) => {
  const readingTypes = [
    {
      title: "Easy Tarot",
      description: "Quick insights for daily guidance",
      icon: "🌙",
    },
    {
      title: "Quick Mix",
      description: "Mixed reading combining different approaches",
      icon: "✨",
    },
    {
      title: "Full Reading",
      description: "Comprehensive analysis of your situation",
      icon: "🔮",
    },
    {
      title: "Get Clarity",
      description: "Focus on specific questions or concerns",
      icon: "💫",
    },
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold text-amber-400 mb-4">Choose Your Path</h3>
          <p className="text-xl text-purple-300">Select the reading that speaks to your soul</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {readingTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-amber-400/30 rounded-xl p-6 h-full transition-all duration-300 group-hover:border-amber-400/50 group-hover:shadow-xl">
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h4 className="text-xl font-semibold text-amber-300">{type.title}</h4>
                  <p className="text-purple-300 text-sm leading-relaxed">{type.description}</p>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-amber-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Featured cards section
const FeaturedCardsSection = ({ cards }: { cards: TarotCardType[] }) => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold text-amber-400 mb-4">Mystical Guidance</h3>
          <p className="text-xl text-purple-300">Three cards await your discovery</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {cards.slice(0, 3).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative group cursor-pointer"
            >
              <div className="w-48 aspect-[3/5] relative">
                <TarotCard
                  card={card}
                  isReversed={card.isReversed}
                  isFlipped={true}
                  className="w-full h-full"
                />
                
                {/* Card info overlay */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full text-center">
                  <h4 className="text-amber-300 font-semibold text-lg">{card.name}</h4>
                  <p className="text-purple-300 text-sm mt-1">
                    {card.keywords.slice(0, 2).join(' • ')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <Link href="/reading/single">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,215,0,0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-purple-900 font-bold text-lg rounded-full shadow-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300"
            >
              ✨ Begin Your Reading
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function NewHomepage() {
  const [randomCards, setRandomCards] = useState<TarotCardType[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setRandomCards(getRandomCards(6))
    // Small delay to ensure smooth animation start
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mystical Background */}
      <MysticalBackground />

      {/* Header */}
      <MysticalHeader />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection heroCard={randomCards[0] || null} />

        {/* Reading Types */}
        <ReadingTypesSection cards={randomCards} />

        {/* Featured Cards */}
        <FeaturedCardsSection cards={randomCards} />

        {/* Bottom Quote */}
        <div className="relative py-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-amber-400/80 text-lg font-light tracking-wider"
          >
            ✨ &quot;The cards reveal what the soul already knows&quot; ✨
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NewHomepage 