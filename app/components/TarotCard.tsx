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
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<JSX.Element[]>([]);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Generate stars client-side only
    const generateStars = () => {
      const starElements = [];
      const numStars = Math.floor(Math.random() * 8) + 5;
      
      for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 3 + 2;
        const opacity = Math.random() * 0.7 + 0.3;
        
        starElements.push(
          <div
            key={i}
            className="absolute rounded-full bg-purple-300"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              opacity: 0,
              boxShadow: `0 0 ${size * 2}px ${size}px rgba(168, 85, 247, 0.7)`,
              animation: `twinkle ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        );
      }
      
      setStars(starElements);
    };
    
    generateStars();
  }, []);
  
  // Set the rotation for reversed cards
  const rotation = isReversed ? 'rotate-180' : '';
  
  // Card gradient styles with Agatha's purple color scheme (fallback if image fails)
  const cardGradientStyle = {
    backgroundImage: `linear-gradient(135deg, var(--agatha-dark) 0%, var(--agatha-purple) 50%, var(--agatha-deeper) 100%)`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 10s ease infinite',
  };
  
  // Card back design with witchcraft symbols
  const cardBackStyle = {
    backgroundImage: `radial-gradient(circle at center, var(--agatha-purple) 0%, var(--agatha-deeper) 100%)`,
    backgroundSize: '200% 200%',
    animation: 'pulseBackground 8s ease infinite',
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-500 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Magical effect when hovered */}
      {hovered && (
        <div className="absolute -inset-4 bg-agatha-glow/20 rounded-2xl blur-md z-0 animate-magic-pulse"></div>
      )}
      
      <div className={`
        relative w-full aspect-[2/3] rounded-lg overflow-hidden 
        transition-transform duration-1000 transform-gpu 
        ${isFlipped ? 'rotate-y-0' : 'rotate-y-180'} 
        ${hovered ? 'scale-105 shadow-agatha-glow' : ''}
        z-10
      `}>
        {/* Decorative runes that appear when hovered */}
        {hovered && (
          <div className="absolute -inset-2 z-0 opacity-70">
            {stars}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear">᛭</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear">⍥</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear">ᛯ</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 font-witchcraft text-xl text-agatha-rune animate-rune-appear">ᛏ</div>
          </div>
        )}
        
        {/* Card Front */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`w-full h-full rounded-lg shadow-lg ${rotation}`}>
            {/* Card Image */}
            <div 
              className="w-full h-full rounded-lg border-2 border-agatha-rune/50 shadow-lg overflow-hidden" 
            >
              {/* Actual Tarot Card Image */}
              {card.imagePath && !imageError ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={card.imagePath}
                    alt={card.name}
                    fill
                    className="object-cover rounded-md"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  {/* Purple overlay for Agatha style */}
                  <div className="absolute inset-0 bg-agatha-purple/30 mix-blend-overlay"></div>
                  
                  {/* Card title overlay at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-agatha-dark/90 to-transparent p-3">
                    <div className="text-center">
                      <h3 className="font-witchcraft text-agatha-vibrant text-lg">{card.name}</h3>
                      <p className="text-xs text-agatha-mist/90 font-mystical mt-1">
                        {card.keywords.slice(0, 3).join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full" style={cardGradientStyle}>
                  <div className="w-full h-full flex flex-col justify-between p-4 bg-agatha-black/40 rounded-md backdrop-blur-sm">
                    <div className="text-center">
                      <h3 className="font-witchcraft text-agatha-vibrant text-lg">{card.name}</h3>
                      <p className="text-xs text-agatha-mist/90 font-mystical">{card.arcana.charAt(0).toUpperCase() + card.arcana.slice(1)} Arcana</p>
                    </div>
                    
                    <div className="flex justify-center my-2">
                      <div className="w-12 h-12 rounded-full bg-agatha-purple/30 flex items-center justify-center border border-agatha-accent/50 shadow-agatha-glow">
                        <span className="font-witchcraft text-agatha-vibrant animate-magic-text">{card.number}</span>
                      </div>
                    </div>
                    
                    {/* Card symbols */}
                    <div className="flex justify-center space-x-2 my-1">
                      {Array(3).fill(0).map((_, i) => (
                        <span key={i} className="text-agatha-accent text-xs">
                          {['✦', '✧', '✴', '✵', '❂', '⚝'][Math.floor(Math.random() * 6)]}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-agatha-mist/90 text-center font-mystical">
                      {card.keywords.slice(0, 3).join(' • ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Card Back */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-full h-full rounded-lg bg-agatha-deeper border-2 border-agatha-rune/50 shadow-lg p-1">
            <div 
              className="w-full h-full rounded-md flex items-center justify-center"
              style={cardBackStyle}
            >
              {/* Witchcraft symbol on back of card */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-24 h-24 rounded-full border-2 border-agatha-rune/50 animate-magic-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-16 h-16 rounded-full border border-agatha-rune/70 animate-spell-cast"></div>
                </div>
                <div className="text-3xl text-agatha-vibrant font-witchcraft animate-magic-text">
                  ✧ ⛧ ✧
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Meaning (displayed when flipped) */}
      {isFlipped && (
        <div className="mt-4 text-sm text-center">
          <p className="text-agatha-mist font-mystical">
            {isReversed ? card.meaning.reversed : card.meaning.upright}
          </p>
        </div>
      )}
    </div>
  );
} 