'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TarotCard from '../../components/TarotCard';
import { getRandomCard } from '../../data/cards';
import type { TarotCard as TarotCardType } from '../../data/cards';
import { AnimatedContainer, MysticalButton, cardFlip } from '../../components/ui/animations';
import { MysticalParticles, FloatingRunes } from '../../components/ui/MysticalParticles';
import { motion, AnimatePresence } from 'framer-motion';

export default function SingleCardReading() {
  const [card, setCard] = useState<TarotCardType | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [question, setQuestion] = useState('');
  const [isReadingStarted, setIsReadingStarted] = useState(false);
  const [isCardDrawn, setIsCardDrawn] = useState(false);
  const [isReadingComplete, setIsReadingComplete] = useState(false);

  // Reset reading state when component loads
  useEffect(() => {
    // Reset everything on mount
    setCard(null);
    setIsFlipped(false);
    setIsReadingStarted(false);
    setIsCardDrawn(false);
    setIsReadingComplete(false);
    
    // 50% chance of card being reversed
    setIsReversed(Math.random() > 0.5);
  }, []);

  // Start the reading process
  const startReading = () => {
    setIsReadingStarted(true);
  };

  // Draw a card
  const drawCard = () => {
    // Get a random card
    const randomCard = getRandomCard();
    setCard(randomCard);
    setIsCardDrawn(true);
    
    // Flip the card after a delay
    setTimeout(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setIsReadingComplete(true);
      }, 1000);
    }, 2000);
  };

  // Start a new reading
  const newReading = () => {
    setCard(null);
    setIsFlipped(false);
    setIsReversed(Math.random() > 0.5);
    setQuestion('');
    setIsReadingStarted(false);
    setIsCardDrawn(false);
    setIsReadingComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced mystical background */}
      <MysticalParticles count={25} />
      <FloatingRunes />
      
      {/* Dynamic background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-violet-900/20 pointer-events-none"
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated title */}
      <AnimatedContainer className="relative z-10 mb-8">
        <motion.h1 
          className="mystical-title mb-6"
          animate={{
            textShadow: [
              "0 0 10px rgba(147, 51, 234, 0.5)",
              "0 0 20px rgba(147, 51, 234, 0.8)",
              "0 0 10px rgba(147, 51, 234, 0.5)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        >
          Single Card Reading
        </motion.h1>
      </AnimatedContainer>
      
      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {!isReadingStarted ? (
            <motion.div 
              key="question-phase"
              className="mystical-card max-w-md w-full mx-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.3)",
                    "0 0 40px rgba(147, 51, 234, 0.6)",
                    "0 0 20px rgba(147, 51, 234, 0.3)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                className="p-6 rounded-lg"
              >
                <AnimatedContainer delay={0.2}>
                  <h2 className="mystical-subtitle mb-4">What question seeks answer?</h2>
                </AnimatedContainer>
                
                <AnimatedContainer delay={0.4}>
                  <p className="mb-6 text-sm">
                    Focus your energy and intention as you prepare to draw a card.
                    You may ask a specific question or simply reflect on your current situation.
                  </p>
                </AnimatedContainer>
                
                <AnimatedContainer delay={0.6}>
                  <motion.textarea
                    className="mystical-input w-full mb-4 min-h-20"
                    placeholder="Enter your question here... (optional)"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    whileFocus={{
                      boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)",
                      borderColor: "rgba(147, 51, 234, 0.8)"
                    }}
                  />
                </AnimatedContainer>
                
                <AnimatedContainer delay={0.8}>
                  <MysticalButton 
                    className="mystical-button w-full"
                    onClick={startReading}
                  >
                    Begin Reading
                  </MysticalButton>
                </AnimatedContainer>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="reading-phase"
              className="w-full flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {question && (
                <motion.div 
                  className="mb-6 italic text-mystical-light/70 text-center max-w-md"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(251, 191, 36, 0.5)",
                        "0 0 10px rgba(251, 191, 36, 0.8)",
                        "0 0 5px rgba(251, 191, 36, 0.5)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    "{question}"
                  </motion.span>
                </motion.div>
              )}
              
              <div className="w-full flex flex-col items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                  {!isCardDrawn ? (
                    <motion.div 
                      key="draw-phase"
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <motion.p 
                        className="mystical-subtitle mb-6"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Focus your energy and draw your card
                      </motion.p>
                      
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 0 20px rgba(251, 191, 36, 0.5)",
                            "0 0 40px rgba(251, 191, 36, 0.8)",
                            "0 0 20px rgba(251, 191, 36, 0.5)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      >
                        <MysticalButton 
                          className="mystical-button"
                          onClick={drawCard}
                        >
                          Draw Card
                        </MysticalButton>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="card-phase"
                      className="max-w-xs w-full"
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        damping: 15,
                        delay: 0.5 
                      }}
                    >
                      {card && (
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <TarotCard 
                            card={card}
                            isReversed={isReversed}
                            isFlipped={isFlipped}
                            className="mx-auto"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {isReadingComplete && (
                  <motion.div 
                    className="mystical-card p-6 max-w-md w-full text-center mt-6"
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20,
                      delay: 0.3 
                    }}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(147, 51, 234, 0.3)",
                          "0 0 30px rgba(147, 51, 234, 0.5)",
                          "0 0 20px rgba(147, 51, 234, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                      className="p-6 rounded-lg"
                    >
                      <motion.h2 
                        className="mystical-subtitle mb-4"
                        animate={{
                          textShadow: [
                            "0 0 5px rgba(251, 191, 36, 0.5)",
                            "0 0 15px rgba(251, 191, 36, 0.8)",
                            "0 0 5px rgba(251, 191, 36, 0.5)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      >
                        {isReversed ? 'Reversed' : 'Upright'} {card?.name}
                      </motion.h2>
                      
                      <AnimatedContainer delay={0.2}>
                        <div className="mb-6">
                          <p className="mb-4">
                            The {card?.name} represents {isReversed ? card?.meaning.reversed.toLowerCase() : card?.meaning.upright.toLowerCase()}.
                          </p>
                          <p className="text-sm text-mystical-light/70">
                            Reflect on how this card's energy relates to your question or current situation.
                          </p>
                        </div>
                      </AnimatedContainer>
                      
                      <AnimatedContainer delay={0.4}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <MysticalButton 
                            className="mystical-button bg-opacity-50 hover:bg-opacity-70"
                            onClick={newReading}
                          >
                            New Reading
                          </MysticalButton>
                          
                          <MysticalButton className="mystical-button">
                            <Link href="/">Return Home</Link>
                          </MysticalButton>
                        </div>
                      </AnimatedContainer>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 