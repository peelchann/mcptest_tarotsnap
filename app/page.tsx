'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TarotCarousel } from './components/TarotCarousel';
import { cards } from './data/cards';
import Image from 'next/image';
import SpreadCard from './components/SpreadCard';
import { AnimatedContainer, StaggeredContainer, MysticalButton } from './components/ui/animations';
import { MysticalParticles, FloatingRunes } from './components/ui/MysticalParticles';
import { motion } from 'framer-motion';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Find specific cards for display, default to first card if not found or no imagePath
  const singleCardImage = cards.find(card => card.id === 'the-fool')?.imagePath || cards[0]?.imagePath || '/images/tarot/default.png';
  const threeCardImage = cards.find(card => card.id === 'judgement')?.imagePath || cards[1]?.imagePath || '/images/tarot/default.png';
  const witchCrossImage = cards.find(card => card.id === 'the-world')?.imagePath || cards[2]?.imagePath || '/images/tarot/default.png';

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Mystical Background Effects */}
      <MysticalParticles count={15} />
      <FloatingRunes />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header with enhanced animations */}
      <AnimatedContainer 
        className="text-center pt-12 pb-6 max-w-2xl mx-auto relative z-10"
        delay={0.2}
      >
        <motion.h1 
          className="font-witchcraft text-5xl md:text-5xl mb-3 text-gold-400 leading-tight drop-shadow-light-text text-[3rem]"
          animate={{
            textShadow: [
              "0 0 10px rgba(251, 191, 36, 0.5)",
              "0 0 20px rgba(251, 191, 36, 0.8)",
              "0 0 10px rgba(251, 191, 36, 0.5)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          TarotSnap
        </motion.h1>
        
        <AnimatedContainer delay={0.4}>
          <p className="font-mystical text-base md:text-lg mb-4 max-w-md mx-auto text-agatha-light leading-normal text-[1.25rem]">
            Peer into the shadows of fate with dark magic divination
          </p>
        </AnimatedContainer>
        
        <AnimatedContainer delay={0.6}>
          <div className="flex justify-center space-x-4 my-3">
            <motion.div 
              className="h-0.5 w-20 md:w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="text-gold-400 text-xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✧
            </motion.div>
            <motion.div 
              className="h-0.5 w-20 md:w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </div>
        </AnimatedContainer>
      </AnimatedContainer>

      {/* Enhanced 3-Card Spread Panel */}
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50, rotateY: -15 },
              visible: { opacity: 1, y: 0, rotateY: 0 }
            }}
            whileHover={{ 
              y: -10,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <SpreadCard 
              title="Single Card Draw"
              description="Pull a single card for quick insight or daily guidance. Simple, direct, and illuminating."
              buttonText="Draw a Card"
              linkHref="/reading/single"
              imageSrc={singleCardImage}
              imageAlt="Single Tarot Card Spread"
            />
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
            whileHover={{ 
              y: -10,
              scale: 1.05,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <SpreadCard 
              title="Three Card Spread"
              description="Explore past, present, and future influences, or gain clarity on a specific situation with three interconnected cards."
              buttonText="Begin Reading"
              linkHref="/reading/three-card"
              imageSrc={threeCardImage}
              imageAlt="Three Card Tarot Spread"
            />
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50, rotateY: 15 },
              visible: { opacity: 1, y: 0, rotateY: 0 }
            }}
            whileHover={{ 
              y: -10,
              rotateY: -5,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <SpreadCard 
              title="Witch's Cross Spread"
              description="Delve deeper with the Witch's Cross, a comprehensive spread for uncovering complex dynamics and hidden truths."
              buttonText="Deep Dive"
              linkHref="/reading/witch-cross"
              imageSrc={witchCrossImage}
              imageAlt="Witch's Cross Tarot Spread"
            />
          </motion.div>
        </StaggeredContainer>
      </main>
      
      {/* Enhanced call to action */}
      <AnimatedContainer 
        className="container mx-auto px-4 mb-12 relative z-10"
        delay={1.0}
      >
        <motion.div 
          className="bg-agatha-deeper/70 backdrop-blur-md border border-agatha-rune/30 rounded-lg p-8 max-w-2xl mx-auto shadow-lg relative overflow-hidden"
          whileHover={{
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
            borderColor: "rgba(147, 51, 234, 0.5)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Enhanced decorative runes with animation */}
          {[
            { rune: 'ᛏ', position: 'top-3 left-3' },
            { rune: 'ᛦ', position: 'bottom-3 right-3' },
            { rune: 'ᚾ', position: 'top-3 right-3' },
            { rune: 'ᛉ', position: 'bottom-3 left-3' }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className={`absolute ${item.position} text-agatha-rune/20 font-witchcraft text-xl`}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                rotate: [0, 360]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: index * 1.5
              }}
            >
              {item.rune}
            </motion.div>
          ))}
          
          {/* Enhanced purple glow effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-radial from-agatha-purple/5 to-transparent"
            animate={{
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
          />
          
          <div className="relative z-10">
            <motion.h2 
              className="font-witchcraft text-3xl mb-2 text-agatha-light text-center leading-tight"
              animate={{
                textShadow: [
                  "0 0 5px rgba(168, 85, 247, 0.5)",
                  "0 0 15px rgba(168, 85, 247, 0.8)",
                  "0 0 5px rgba(168, 85, 247, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              Unveil Your Destiny
            </motion.h2>
            
            <motion.div 
              className="h-0.5 w-24 mx-auto bg-agatha-accent/60 mb-4"
              animate={{
                width: ["6rem", "8rem", "6rem"],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            
            <AnimatedContainer delay={0.2}>
              <p className="mb-6 text-agatha-light font-mystical text-center text-base leading-relaxed">
                Let Agatha's dark arts guide your path and reveal the threads of fate that bind your past, 
                present, and future. Tap into ancient witchcraft to illuminate what remains hidden.
              </p>
            </AnimatedContainer>
            
            <AnimatedContainer delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MysticalButton className="py-3 px-6 rounded-xl bg-agatha-mid text-gold-400 font-semibold border border-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-[#1E1E3F] focus:ring-2 focus:ring-gold-500 focus:outline-none font-mystical">
                  <Link href="/about">About the Craft</Link>
                </MysticalButton>
                
                <MysticalButton className="py-3 px-6 rounded-xl bg-gold-400 text-[#1E1E3F] font-semibold border border-gold-400 transition-all duration-300 hover:bg-gold-500 focus:ring-2 focus:ring-gold-500 focus:outline-none font-mystical">
                  <Link href="/reading">Begin Divination</Link>
                </MysticalButton>
              </div>
            </AnimatedContainer>
          </div>
        </motion.div>
      </AnimatedContainer>
      
      {/* Enhanced footer */}
      <AnimatedContainer 
        className="mt-auto py-6 text-sm text-agatha-light text-center border-t border-agatha-purple/20 relative z-10"
        delay={1.2}
      >
        <div className="flex items-center justify-center space-x-2">
          <motion.span 
            className="text-agatha-rune/60"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            ⚝
          </motion.span>
          <p>TarotSnap © {new Date().getFullYear()}</p>
          <motion.span 
            className="text-agatha-rune/60"
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            ⚝
          </motion.span>
        </div>
        <p className="font-witchcraft mt-1 text-xs text-agatha-rune/80">The power of divination in your hands</p>
      </AnimatedContainer>
    </div>
  );
}
