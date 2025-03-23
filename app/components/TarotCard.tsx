'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { TarotCard } from '../data/cards';

interface TarotCardProps {
  card: TarotCard;
  isReversed?: boolean;
  onClick?: () => void;
  isFlipped?: boolean;
  className?: string;
}

export default function TarotCard({ 
  card, 
  isReversed = false, 
  onClick, 
  isFlipped = false,
  className = '' 
}: TarotCardProps) {
  const [hovered, setHovered] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [stars, setStars] = useState<React.ReactNode[]>([]);
  
  // Set animation state after mount and generate stars client-side only
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
      
      // Generate stars client-side only
      const generatedStars = [];
      for (let i = 0; i < 20; i++) {
        const size = Math.random() * 2 + 1;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.2;
        const animationDelay = Math.random() * 2;
        
        generatedStars.push(
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-pulse-subtle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              opacity,
              animationDelay: `${animationDelay}s`
            }}
          />
        );
      }
      setStars(generatedStars);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set the rotation for reversed cards
  const rotation = isReversed ? 'rotate-180' : '';
  
  // Enhanced placeholder for when we don't have actual images
  const frontGradient = isReversed 
    ? 'linear-gradient(to bottom right, #37204a, #9C27B0, #37204a)'
    : 'linear-gradient(to bottom right, #1F1F3D, #9C27B0, #1F1F3D)';
  
  const placeholderStyle = {
    backgroundImage: frontGradient,
    backgroundSize: 'cover',
  };
  
  // Generate a symbolic representation for the card based on arcana and number/suit
  const getSymbol = () => {
    if (card.arcana === 'major') {
      // Map some major arcana to specific symbols
      const majorSymbols: Record<string, string> = {
        '0': '☼', // The Fool
        '1': '✦', // The Magician
        '2': '☽', // The High Priestess
        '3': '♀', // The Empress
        '4': '♂', // The Emperor
        '5': '⚜', // The Hierophant
        '6': '❤', // The Lovers
        '7': '⛥', // The Chariot
        '8': '∞', // Strength
        '9': '☄', // The Hermit
        '10': '⊕', // Wheel of Fortune
        '11': '⚖', // Justice
        '12': '✝', // The Hanged Man
        '13': '☠', // Death
        '14': '⚱', // Temperance
        '15': '⛧', // The Devil
        '16': '⚡', // The Tower
        '17': '★', // The Star
        '18': '☾', // The Moon
        '19': '☀', // The Sun
        '20': '⚰', // Judgement
        '21': '⊛', // The World
      };
      return majorSymbols[card.number.toString()] || '✧';
    } else {
      // For minor arcana, use suit symbols
      const suitSymbols: Record<string, string> = {
        'wands': '⚒',
        'cups': '⚱',
        'swords': '⚔',
        'pentacles': '⛤',
      };
      return suitSymbols[card.suit || ''] || '✧';
    }
  };
  
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-500 ${className} ${animated ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden 
          transition-all duration-1000 transform-gpu 
          ${isFlipped ? 'rotate-y-0' : 'rotate-y-180'} 
          ${hovered ? 'scale-105 shadow-glow-purple' : ''}
        `}
      >
        {/* Card Front */}
        <div 
          className={`
            absolute inset-0 transition-opacity duration-1000 
            ${isFlipped ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className={`w-full h-full rounded-lg shadow-lg ${rotation}`}>
            {/* Card Image - Using real image with enhanced fallback */}
            <div 
              className="w-full h-full rounded-lg border-2 border-mystical-gold/30 shadow-lg overflow-hidden relative" 
            >
              {!imageError && card.image && (
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              )}
              
              {/* Fallback for when image fails to load or isn't available */}
              {(imageError || !card.image) && (
                <div 
                  className="w-full h-full"
                  style={placeholderStyle}
                >
                  {/* Stars background */}
                  {stars}
                  
                  {/* Card content with improved styling */}
                  <div className="w-full h-full flex flex-col justify-between p-4 bg-mystical-primary/50 rounded-md backdrop-blur-sm relative z-10">
                    {/* Card header */}
                    <div className="text-center relative">
                      {/* Decorative element */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-mystical-gold/50 to-transparent"></div>
                      
                      <h3 className="font-mystical text-mystical-gold text-lg mt-2 tracking-wider">
                        {card.name}
                      </h3>
                      <p className="text-xs text-mystical-light/70 mt-1">
                        {card.arcana.charAt(0).toUpperCase() + card.arcana.slice(1)} Arcana
                        {card.suit && ` of ${card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}`}
                      </p>
                    </div>
                    
                    {/* Card central symbol */}
                    <div className="flex justify-center my-4 relative">
                      <div className="w-20 h-20 rounded-full bg-mystical-accent/30 flex items-center justify-center border border-mystical-light/20 backdrop-blur-sm shadow-glow-sm">
                        <span className="font-mystical text-mystical-gold text-3xl">{getSymbol()}</span>
                      </div>
                    </div>
                    
                    {/* Card keywords with enhanced styling */}
                    <div className="mt-2 relative">
                      {/* Decorative element */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-mystical-gold/50 to-transparent"></div>
                      
                      <div className="text-xs text-mystical-light/80 text-center">
                        {card.keywords.slice(0, 3).map((keyword, index) => (
                          <span key={keyword} className="inline-block">
                            {index > 0 && (
                              <span className="mx-1 text-mystical-gold/50">•</span>
                            )}
                            <span className="tracking-wide">{keyword}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Overlay for card */}
              <div className="absolute inset-0 bg-gradient-to-b from-mystical-dark/10 via-transparent to-mystical-dark/30 pointer-events-none"></div>
              
              {/* Card title overlay - always visible even with image */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-mystical-dark/70 backdrop-blur-sm border-t border-mystical-gold/20">
                <h3 className="font-mystical text-mystical-gold text-center">
                  {card.name}
                </h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Back with enhanced design */}
        <div 
          className={`
            absolute inset-0 transition-opacity duration-1000 
            ${isFlipped ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <div className="w-full h-full rounded-lg bg-mystical-primary border-2 border-mystical-gold/30 shadow-lg p-1 overflow-hidden">
            <div className="w-full h-full rounded-md bg-gradient-to-br from-mystical-primary to-mystical-accent/30 flex items-center justify-center relative">
              {/* Animated back pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-full h-full border-2 border-mystical-gold/30 rounded-full animate-pulse-subtle"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: `${(i + 1) * 20}%`,
                      height: `${(i + 1) * 20}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Central emblem */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-3xl text-mystical-gold font-mystical animate-pulse-subtle">✧ ✦ ✧</div>
                <div className="mt-2 text-xs text-mystical-gold/70 font-mystical tracking-widest">TAROTSNAP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Meaning with enhanced animation */}
      {isFlipped && (
        <div 
          className={`
            mt-4 text-sm text-center opacity-0 transition-all duration-700 delay-500
            ${isFlipped ? 'opacity-80' : 'opacity-0'} animate-fade-in
          `}
        >
          <p className="text-mystical-light backdrop-blur-sm bg-mystical-dark/30 p-3 rounded-md border border-mystical-light/10">
            {isReversed ? card.meaning.reversed : card.meaning.upright}
          </p>
        </div>
      )}
    </div>
  );
} 