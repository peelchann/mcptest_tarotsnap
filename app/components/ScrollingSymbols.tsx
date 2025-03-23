'use client';

import { useEffect, useState } from 'react';

interface ScrollingSymbolsProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
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
  
  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Define mystical symbols
  const symbols = ['✧', '☽', '★', '☉', '⚹', '♆', '♇', '☿', '♀', '♁', '♃', '♄', '♅', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  
  // Get speed class based on prop
  const getSpeedClass = () => {
    switch (speed) {
      case 'slow': return reverse ? 'animate-scroll-reverse-slow' : 'animate-scroll-slow';
      case 'fast': return reverse ? 'animate-scroll-reverse-fast' : 'animate-scroll-fast';
      default: return reverse ? 'animate-scroll-reverse' : 'animate-scroll';
    }
  };
  
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'top-0 left-0 right-0 h-8 flex-row';
      case 'bottom': return 'bottom-0 left-0 right-0 h-8 flex-row';
      case 'left': return 'top-0 bottom-0 left-0 w-8 flex-col';
      case 'right': return 'top-0 bottom-0 right-0 w-8 flex-col';
      default: return 'bottom-0 left-0 right-0 h-8 flex-row';
    }
  };
  
  // Generate multiple copies for seamless scrolling
  const repeatedSymbols = [...symbols, ...symbols, ...symbols];
  
  return (
    <div 
      className={`
        fixed z-10 flex overflow-hidden pointer-events-none
        transition-opacity duration-1000
        ${getPositionClasses()}
        ${mounted ? 'opacity-30' : 'opacity-0'}
        ${className}
      `}
    >
      <div 
        className={`
          flex ${position === 'left' || position === 'right' ? 'flex-col' : 'flex-row'}
          ${getSpeedClass()}
        `}
      >
        {repeatedSymbols.map((symbol, index) => (
          <div 
            key={index}
            className={`
              flex items-center justify-center text-mystical-gold font-mystical
              ${position === 'left' || position === 'right' ? 'h-8 w-full' : 'w-8 h-full'}
              ${index % 3 === 0 ? 'opacity-100' : 'opacity-60'}
            `}
          >
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
} 