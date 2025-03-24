'use client';

import { useEffect, useState } from 'react';

interface ScrollingSymbolsProps {
  position?: 'top' | 'right' | 'bottom' | 'left';
  reverse?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export default function ScrollingSymbols({
  position = 'bottom',
  reverse = false,
  speed = 'normal',
  className = '',
}: ScrollingSymbolsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Agatha witchcraft and magic symbols (runes, alchemical symbols, witch marks)
  const symbols = [
    '⛤', // Pentagram
    '☽', // Crescent Moon
    '♆', // Neptune/Trident
    '⍟', // Star in Circle
    '♱', // Orthodox Cross
    '⚕', // Caduceus
    '≼', // Angled Symbol
    '⧗', // Time Symbol
    '⧉', // Dimensional Portal
    '⌘', // Command/Infinity Knot
    '⎊', // Chaos Star
    '♅', // Uranus/Dark Magic
    '↯', // Lightning Symbol
    '⚶', // Connected Circles
    '⎇', // Alternate Symbol
    '⍥', // Circle with Dot
    '⏣', // Triple Circles
    'ᛝ', // Elder Futhark Rune (Ingwaz)
    'ᛉ', // Algiz Rune
    'ᛗ', // Mannaz Rune
    'ᚦ', // Thurisaz Rune
    'ᚹ', // Wunjo Rune
    'ᛦ', // Yr Rune
  ];
  
  const getSpeedClass = () => {
    if (speed === 'slow') return reverse ? 'scroll-reverse-slow' : 'scroll-slow';
    if (speed === 'fast') return reverse ? 'scroll-reverse-fast' : 'scroll-fast';
    return reverse ? 'scroll-reverse' : 'scroll';
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 right-0 h-12 flex-row';
      case 'right':
        return 'top-0 right-0 bottom-0 w-12 flex-col';
      case 'bottom':
        return 'bottom-0 left-0 right-0 h-12 flex-row';
      case 'left':
        return 'top-0 left-0 bottom-0 w-12 flex-col';
      default:
        return 'bottom-0 left-0 right-0 h-12 flex-row';
    }
  };

  const isVertical = position === 'left' || position === 'right';
  
  // Generate multiple copies of the symbols for seamless scrolling
  const generateSymbols = () => {
    // Create several copies to ensure continuous scrolling
    const copies = 10;
    const allSymbols = Array(copies).fill(symbols).flat();
    
    return allSymbols.map((symbol, index) => {
      // Generate a random shade of purple for each symbol
      const hue = 270 + Math.floor(Math.random() * 40) - 20; // Purple range
      const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
      const lightness = 50 + Math.floor(Math.random() * 30); // 50-80%
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      // Add random glow intensity
      const glowSize = Math.floor(Math.random() * 8) + 2; // 2-10px
      const glowColor = `hsl(${hue}, ${saturation}%, ${lightness + 10}%)`;
      
      return (
        <div 
          key={`${symbol}-${index}`} 
          className={`
            flex items-center justify-center
            ${isVertical ? 'w-full py-3' : 'h-full px-3'}
            transition-opacity duration-300
            text-2xl font-bold
            opacity-${Math.random() > 0.7 ? '100' : Math.random() > 0.5 ? '70' : '40'}
            transform ${Math.random() > 0.8 ? 'scale-125' : Math.random() > 0.5 ? 'scale-110' : 'scale-100'}
            ${Math.random() > 0.9 ? 'animate-magic-pulse' : ''}
          `}
          style={{
            color: color,
            textShadow: `0 0 ${glowSize}px ${glowColor}`,
            transform: `${Math.random() > 0.8 ? 'rotate(' + (Math.random() * 30 - 15) + 'deg)' : ''}`,
          }}
        >
          {symbol}
        </div>
      );
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`
        fixed z-10 flex overflow-hidden
        ${getPositionClasses()}
        ${className}
        bg-gradient-to-r from-agatha-black/80 via-agatha-purple/30 to-agatha-black/80
        backdrop-blur-sm
      `}
    >
      <div className={`
        flex ${isVertical ? 'flex-col' : 'flex-row'} 
        ${getSpeedClass()}
        animate-${Math.random() > 0.9 ? 'magic-text' : ''}
      `}>
        {generateSymbols()}
      </div>
    </div>
  );
} 