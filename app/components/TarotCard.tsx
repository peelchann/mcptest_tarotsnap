'use client';

import { useState, useEffect } from 'react';
import type { TarotCard } from '../data/cards';
import { useStarEffect, useMouseMoveEffect, useSpotlightEffect, CardImage, cardBackStyle } from './CardUtils';

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
    <div 
      className={`relative cursor-pointer transition-all duration-500 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        handleMouseLeave();
      }}
    >
      {/* Enhanced magical glow effect when hovered */}
      {hovered && (
        <div className="absolute -inset-4 bg-agatha-glow/20 rounded-2xl blur-md z-0 animate-magic-pulse">
          {/* Add animated particles */}
          <div className="absolute inset-0">
            <div className="absolute h-2 w-2 rounded-full bg-agatha-rune/70 top-1/4 left-1/3 animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <div className="absolute h-1 w-1 rounded-full bg-agatha-rune/70 top-3/4 left-2/3 animate-float" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
            <div className="absolute h-1.5 w-1.5 rounded-full bg-agatha-accent/70 top-1/2 left-1/4 animate-float" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
          </div>
        </div>
      )}
      
      <div ref={cardRef}
        className={`
          relative w-full aspect-[2/3] rounded-lg overflow-hidden 
          transition-all duration-1000 transform-gpu will-change-transform
          [perspective:1200px] [transform-style:preserve-3d]
          ${isFlipped ? 'rotate-y-0' : 'rotate-y-180'} 
          ${hovered ? 'scale-105 shadow-[0_0_25px_rgba(147,51,234,0.8)]' : 'shadow-agatha-glow'}
          z-10
        `}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleSpotlightMove(e);
        }}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `${isFlipped ? "rotateY(0deg)" : "rotateY(180deg)"} 
                     perspective(1200px) 
                     rotateX(var(--rotate-x, 0deg)) 
                     rotateY(var(--rotate-y, 0deg)) 
                     translate3d(calc(var(--x) / 25), calc(var(--y) / 25), 0)`,
          transition: hovered 
            ? "transform 0.1s ease-out" 
            : "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Spotlight effect overlay */}
        <div 
          ref={spotlightRef}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
          style={spotlightStyle}
        />
        
        {/* Decorative runes that appear when hovered with improved animations */}
        {hovered && (
          <div className="absolute -inset-2 z-0 opacity-70">
            {stars}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear delay-100">᛭</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear delay-200">⍥</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear delay-300">ᛯ</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear delay-400">ᛏ</div>
          </div>
        )}
        
        {/* Card Front - Enhanced with better transitions */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isFlipped ? 'opacity-100' : 'opacity-0'} backface-hidden`}>
          <div className={`w-full h-full rounded-lg shadow-lg ${rotation}`}>
            {/* Card Image with parallax effect */}
            <div className="w-full h-full rounded-lg border-2 border-agatha-rune/50 shadow-lg overflow-hidden">
              <div className={`w-full h-full transition-transform duration-500 ${hovered ? 'scale-105' : ''}`}>
                <CardImage
                  card={card}
                  imageError={imageError}
                  setImageError={setImageError}
                />
              </div>
              
              {/* Animated magical border */}
              <div className="absolute inset-0 rounded-lg border-2 border-agatha-purple/0 group-hover:border-agatha-purple/30 transition-colors duration-500"></div>
              
              {/* Card title overlay at the bottom for image cards */}
              {card.imagePath && !imageError && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-agatha-dark/90 to-transparent p-3 transform transition-transform duration-500 group-hover:translate-y-0">
                  <div className="text-center">
                    <h3 className="font-witchcraft text-agatha-vibrant text-lg group-hover:text-agatha-accent transition-colors duration-500">{card.name}</h3>
                    <p className="text-xs text-agatha-mist/90 font-mystical mt-1 transition-opacity duration-500 group-hover:opacity-100">
                      {card.keywords.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Card Back - Enhanced with better animations */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isFlipped ? 'opacity-0' : 'opacity-100'} backface-hidden rotate-y-180`}>
          <div className="w-full h-full rounded-lg bg-agatha-deeper border-2 border-agatha-rune/50 shadow-lg p-1">
            <div 
              className="w-full h-full rounded-md flex items-center justify-center"
              style={cardBackStyle}
            >
              {/* Enhanced witchcraft symbol on back of card */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-24 h-24 rounded-full border-2 border-agatha-rune/50 animate-magic-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-16 h-16 rounded-full border border-agatha-rune/70 animate-spell-cast"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-32 h-32 rounded-full border border-agatha-accent/30 animate-witchcraft"></div>
                </div>
                <div className="text-3xl text-agatha-vibrant font-witchcraft animate-magic-text relative z-10">
                  ✧ ⛧ ✧
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Meaning (displayed when flipped) with enhanced animations */}
      {isFlipped && (
        <div className="mt-4 text-sm text-center animate-fade-in">
          <p className="text-agatha-mist font-mystical">
            {isReversed ? card.meaning.reversed : card.meaning.upright}
          </p>
        </div>
      )}
    </div>
  );
} 