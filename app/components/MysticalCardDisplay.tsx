'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TarotCard from './TarotCard';
import { cards } from '../data/cards';

interface MysticalCardDisplayProps {
  onSelectCard?: (cardId: string) => void;
  className?: string;
}

export default function MysticalCardDisplay({
  onSelectCard,
  className = '',
}: MysticalCardDisplayProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<JSX.Element[]>([]);
  
  // Get a random selection of cards
  const displayCards = useState(() => {
    // Get 5 random cards
    return [...cards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(card => ({
        ...card,
        isReversed: Math.random() > 0.7,
      }));
  })[0];
  
  useEffect(() => {
    setMounted(true);
    
    // Generate stars client-side only
    const generateStars = () => {
      const starsArray = [];
      const numStars = 20;
      
      for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 3;
        
        starsArray.push(
          <div
            key={i}
            className="absolute rounded-full bg-agatha-accent"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              opacity: 0,
              boxShadow: `0 0 ${size * 2}px ${size}px rgba(176, 38, 255, 0.6)`,
              animation: `twinkle ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      }
      
      setStars(starsArray);
    };
    
    generateStars();
  }, []);
  
  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId === selectedCardId ? null : cardId);
    if (onSelectCard) {
      onSelectCard(cardId);
    }
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className={`relative w-full h-[500px] overflow-hidden ${className}`}>
      {/* Dark mist background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-agatha-deeper via-agatha-dark to-agatha-black opacity-70"></div>
      
      {/* Magic circle on the floor */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[400px] h-[400px] rounded-full border-2 border-agatha-rune/30 animate-magic-pulse"></div>
        <div className="absolute w-[320px] h-[320px] rounded-full border border-agatha-rune/50 animate-spell-cast"></div>
        <div className="absolute w-[250px] h-[250px] rounded-full border border-agatha-rune/70 animate-witchcraft"></div>
        <div className="absolute w-4 h-4 bg-agatha-vibrant rounded-full shadow-agatha-glow blur-sm"></div>
      </div>
      
      {/* Magical stars */}
      <div className="absolute inset-0">{stars}</div>
      
      {/* Magic runes */}
      <div className="absolute top-10 left-1/4 font-witchcraft text-3xl text-agatha-rune/30 animate-magic-text">ᛦ</div>
      <div className="absolute bottom-10 right-1/4 font-witchcraft text-3xl text-agatha-rune/30 animate-magic-text">ᛏ</div>
      <div className="absolute top-1/3 right-10 font-witchcraft text-3xl text-agatha-rune/30 animate-magic-text">ᛉ</div>
      <div className="absolute bottom-1/3 left-10 font-witchcraft text-3xl text-agatha-rune/30 animate-magic-text">ᚦ</div>
      
      {/* Floating cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {displayCards.map((card, index) => {
          // Calculate position based on index
          const isSelected = card.id === selectedCardId;
          const angleDegree = (360 / displayCards.length) * index;
          const angleRad = (angleDegree * Math.PI) / 180;
          const radius = isSelected ? 0 : 140; // Cards move to center when selected
          const xPos = Math.cos(angleRad) * radius;
          const yPos = Math.sin(angleRad) * radius;
          
          // Random floating animation values
          const floatY = Math.random() * 10 - 5;
          const floatDuration = Math.random() * 3 + 4;
          const rotateAmount = Math.random() * 5 - 2.5;
          
          return (
            <motion.div
              key={card.id}
              className={`absolute ${isSelected ? 'z-10' : 'z-0'}`}
              style={{
                cursor: 'pointer',
              }}
              animate={{
                x: xPos,
                y: yPos,
                scale: isSelected ? 1.2 : 0.8,
                rotate: isSelected ? 0 : rotateAmount,
              }}
              transition={{
                type: 'spring',
                stiffness: 70,
                damping: 15,
              }}
              whileHover={{
                scale: isSelected ? 1.25 : 0.9,
                filter: 'brightness(1.1)',
                transition: { duration: 0.3 },
              }}
            >
              {/* Pulsing magical aura around selected card */}
              {isSelected && (
                <div className="absolute -inset-4 rounded-xl bg-agatha-glow/30 blur-md animate-magic-pulse"></div>
              )}
              
              {/* Purple energy connection lines between cards */}
              {!isSelected && index > 0 && (
                <div
                  className="absolute top-1/2 left-1/2 h-0.5 bg-gradient-to-r from-agatha-purple/70 to-transparent"
                  style={{
                    width: '140px',
                    transformOrigin: 'left center',
                    transform: `rotate(${(index - 1) * (360 / displayCards.length)}deg)`,
                    opacity: 0.3,
                  }}
                ></div>
              )}
              
              {/* Floating card animation */}
              <div
                className="transform-gpu will-change-transform"
                style={{
                  animation: `float ${floatDuration}s ease-in-out infinite alternate`,
                  transform: `translateY(${floatY}px)`,
                }}
              >
                <TarotCard
                  card={card}
                  isReversed={card.isReversed}
                  isFlipped={isSelected}
                  onClick={() => handleCardClick(card.id)}
                  className="w-32"
                />
              </div>
            </motion.div>
          );
        })}
        
        {/* Center magical glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-agatha-deeper border border-agatha-purple/50 flex items-center justify-center shadow-inner">
            <div className="w-16 h-16 rounded-full bg-gradient-radial from-agatha-purple to-agatha-deeper animate-magic-pulse opacity-60"></div>
            <div className="absolute w-20 h-20 rounded-full border border-agatha-vibrant/30 animate-spell-cast"></div>
            <div className="absolute w-4 h-4 bg-agatha-vibrant rounded-full shadow-agatha-glow animate-witchcraft blur-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Instructional text */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-agatha-mist/80 font-mystical text-sm">
        Click a card to reveal its meaning
      </div>
    </div>
  );
} 