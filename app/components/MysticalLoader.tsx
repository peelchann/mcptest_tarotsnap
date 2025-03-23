'use client';

import { useState, useEffect } from 'react';

interface MysticalLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function MysticalLoader({ 
  message = "Reading the cosmic energies...", 
  fullScreen = false 
}: MysticalLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState('');
  
  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
    
    // Animate the dots
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div 
      className={`
        flex flex-col items-center justify-center
        ${fullScreen ? 'fixed inset-0 z-50 bg-mystical-dark/70 backdrop-blur-md' : 'w-full py-8'}
        transition-opacity duration-700
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Crystal ball loader */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-mystical-primary to-mystical-accent/50 opacity-20 animate-pulse"></div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-mystical-primary to-mystical-accent/80 backdrop-blur-sm border border-mystical-light/10 shadow-glow-purple"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-mystical-light/10 animate-pulse-subtle"></div>
        </div>
        
        {/* Orbiting star */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1">
          <div 
            className="absolute w-2 h-2 bg-mystical-gold rounded-full shadow-glow-gold animate-spin-slow"
            style={{ 
              transformOrigin: '-8px -8px',
              left: '50%',
              top: '50%',
              boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.5)' 
            }}
          ></div>
        </div>
      </div>
      
      {/* Loading message */}
      <div className="text-mystical-light text-center">
        <p className="mystical-subtitle text-sm">{message}{dots}</p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-mystical-light/30 to-transparent mx-auto mt-4"></div>
      </div>
    </div>
  );
} 