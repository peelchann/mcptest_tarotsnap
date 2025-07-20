'use client';

import { useState, useEffect } from 'react';
import type { TarotCard } from '../data/cards';
import { useStarEffect, useMouseMoveEffect, useSpotlightEffect, CardImage, cardBackStyle } from './CardUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface TarotCardProps {
  card: TarotCard;
  isReversed?: boolean;
  onClick?: () => void;
  isFlipped?: boolean;
  className?: string;
  hideOverlayText?: boolean;
}

export default function TarotCard({ 
  card, 
  isReversed = false, 
  onClick, 
  isFlipped = false,
  className = '',
  hideOverlayText = false
}: TarotCardProps) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use shared hooks
  const stars = useStarEffect();
  const { cardRef, handleMouseMove, handleMouseLeave } = useMouseMoveEffect();
  const { spotlightRef, handleMouseMove: handleSpotlightMove, spotlightStyle } = useSpotlightEffect();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set the rotation for reversed cards
  const rotation = isReversed ? 'rotate-180' : '';
  
  if (!mounted) {
    return null;
  }
  
  return (
    <motion.div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        handleMouseLeave();
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        z: 50
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {/* Enhanced magical aura effect */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            className="absolute -inset-8 z-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Outer mystical glow */}
            <motion.div 
              className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-purple-600/20 to-transparent rounded-3xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner energy ring */}
            <motion.div 
              className="absolute inset-4 border-2 border-gold-400/50 rounded-2xl"
              animate={{
                rotate: [0, 360],
                borderColor: [
                  "rgba(251, 191, 36, 0.5)",
                  "rgba(147, 51, 234, 0.5)",
                  "rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                borderColor: { duration: 3, repeat: Infinity }
              }}
            />
            
            {/* Floating mystical particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${20 + (i % 3) * 20}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + (i * 0.2),
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        ref={cardRef}
        className="relative w-full aspect-[2/3] rounded-lg overflow-hidden z-10"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1200px"
        }}
        animate={{
          rotateY: isFlipped ? 0 : 180
        }}
        transition={{
          duration: 1,
          ease: "easeInOut"
        }}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleSpotlightMove(e);
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enhanced spotlight effect */}
        <motion.div 
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none z-20"
          style={spotlightStyle}
          animate={{
            opacity: hovered ? 0.3 : 0
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Mystical runes constellation */}
        <AnimatePresence>
          {hovered && (
            <motion.div 
              className="absolute -inset-4 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {stars}
              {[
                { rune: '᛭', position: 'top-0 left-1/2 -translate-x-1/2', delay: 0.1 },
                { rune: '⍥', position: 'bottom-0 left-1/2 -translate-x-1/2', delay: 0.2 },
                { rune: 'ᛯ', position: 'left-0 top-1/2 -translate-y-1/2', delay: 0.3 },
                { rune: 'ᛏ', position: 'right-0 top-1/2 -translate-y-1/2', delay: 0.4 }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`absolute ${item.position} font-witchcraft text-xl text-agatha-rune`}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ 
                    opacity: 0.7, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -5, 0]
                  }}
                  transition={{
                    opacity: { delay: item.delay, duration: 0.3 },
                    scale: { delay: item.delay, duration: 0.3 },
                    rotate: { delay: item.delay, duration: 0.5 },
                    y: { duration: 2, repeat: Infinity, delay: item.delay }
                  }}
                >
                  {item.rune}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Card Front - Enhanced with 3D effects */}
        <motion.div 
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <motion.div 
            className={`w-full h-full rounded-lg shadow-2xl ${rotation}`}
            whileHover={{
              boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)"
            }}
          >
            <div className="w-full h-full rounded-lg border-2 border-agatha-rune/50 overflow-hidden relative">
              {/* Enhanced card image with parallax */}
              <motion.div 
                className="w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <CardImage
                  card={card}
                  imageError={imageError}
                  setImageError={setImageError}
                />
              </motion.div>
              
              {/* Animated magical border */}
              <motion.div 
                className="absolute inset-0 rounded-lg border-2 border-transparent"
                animate={{
                  borderColor: hovered 
                    ? ["rgba(147, 51, 234, 0)", "rgba(147, 51, 234, 0.6)", "rgba(147, 51, 234, 0)"]
                    : "rgba(147, 51, 234, 0)"
                }}
                transition={{
                  duration: 2,
                  repeat: hovered ? Infinity : 0
                }}
              />
              
              {/* Enhanced card title overlay */}
              {card.imagePath && !imageError && !hideOverlayText && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-agatha-dark/95 to-transparent p-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <motion.h3 
                      className="font-witchcraft text-agatha-vibrant text-lg"
                      animate={{
                        textShadow: hovered 
                          ? ["0 0 5px rgba(251, 191, 36, 0.5)", "0 0 15px rgba(251, 191, 36, 0.8)", "0 0 5px rgba(251, 191, 36, 0.5)"]
                          : "0 0 5px rgba(251, 191, 36, 0.5)"
                      }}
                      transition={{
                        duration: 2,
                        repeat: hovered ? Infinity : 0
                      }}
                    >
                      {card.name}
                    </motion.h3>
                    <motion.p 
                      className="text-xs text-agatha-mist/90 font-mystical mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hovered ? 1 : 0.7 }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.keywords.slice(0, 3).join(' • ')}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Card Back - Enhanced with mystical animations */}
        <motion.div 
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <motion.div 
            className="w-full h-full rounded-lg bg-agatha-deeper border-2 border-agatha-rune/50 shadow-2xl p-1"
            whileHover={{
              boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)"
            }}
          >
            <div 
              className="w-full h-full rounded-md flex items-center justify-center relative overflow-hidden"
              style={cardBackStyle}
            >
              {/* Enhanced mystical symbol with multiple layers */}
              <div className="relative">
                {/* Outer ring */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-32 h-32 rounded-full border border-agatha-accent/20" />
                </motion.div>
                
                {/* Middle ring */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-24 h-24 rounded-full border-2 border-agatha-rune/30" />
                </motion.div>
                
                {/* Inner ring */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                >
                  <div className="w-16 h-16 rounded-full border border-agatha-rune/50" />
                </motion.div>
                
                {/* Central mystical symbol */}
                <motion.div 
                  className="text-3xl text-agatha-vibrant font-witchcraft relative z-10"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(147, 51, 234, 0.5)",
                      "0 0 20px rgba(147, 51, 234, 0.8)",
                      "0 0 10px rgba(147, 51, 234, 0.5)"
                    ],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  ✧ ⛧ ✧
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Enhanced card meaning display */}
      <AnimatePresence>
        {isFlipped && !hideOverlayText && (
          <motion.div 
            className="mt-4 text-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.p 
              className="text-agatha-mist font-mystical"
              animate={{
                textShadow: [
                  "0 0 5px rgba(168, 85, 247, 0.3)",
                  "0 0 10px rgba(168, 85, 247, 0.6)",
                  "0 0 5px rgba(168, 85, 247, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              {isReversed ? card.meaning.reversed : card.meaning.upright}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 