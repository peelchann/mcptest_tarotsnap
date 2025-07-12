'use client';

import { useState, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { TarotCard } from "../data/cards";

// Shared gradient styles for cards
export const cardGradientStyle = {
  backgroundImage: `linear-gradient(135deg, var(--agatha-dark) 0%, var(--agatha-purple) 50%, var(--agatha-deeper) 100%)`,
  backgroundSize: '200% 200%',
  animation: 'gradientShift 10s ease infinite',
};

export const cardBackStyle = {
  backgroundImage: `radial-gradient(circle at center, var(--agatha-purple) 0%, var(--agatha-deeper) 100%)`,
  backgroundSize: '200% 200%',
  animation: 'pulseBackground 8s ease infinite',
};

// Reusable hook for generating stars
export function useStarEffect() {
  const [stars, setStars] = useState<JSX.Element[]>([]);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    const starElements = [];
    const numStars = prefersReducedMotion ? 0 : Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numStars; i++) {
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 3 + 2;
      
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
  }, []);
  
  return stars;
}

// Enhanced hook for spotlight effect on hover
export function useSpotlightEffect() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (event: React.MouseEvent) => {
    const el = spotlightRef.current;
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  };
  
  return {
    spotlightRef,
    handleMouseMove,
    spotlightStyle: {
      background: "radial-gradient(circle at var(--x) var(--y), rgba(147, 51, 234, 0.4) 0%, transparent 50%)",
    }
  };
}

// Skeleton loader for card images
export function CardSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-agatha-dark/80 animate-pulse rounded-md overflow-hidden">
      <div className="relative w-3/4 h-3/4">
        {/* Background pulse animation */}
        <div className="absolute inset-0 bg-agatha-purple/20 animate-pulse rounded-md"></div>
        
        {/* Magic symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-witchcraft text-4xl text-agatha-purple/40 animate-magic-pulse">
            ✧
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-agatha-purple/30 rounded-full animate-magic-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-agatha-accent/30 rounded-full animate-magic-pulse"></div>
      </div>
    </div>
  );
}

// Reusable component for card image display
export function CardImage({ 
  card, 
  imageError, 
  setImageError 
}: { 
  card: TarotCard, 
  imageError: boolean, 
  setImageError: (error: boolean) => void 
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Normalize image path to ensure consistency
  const normalizedImagePath = card.imagePath?.toLowerCase().replace(/\s+/g, '-');
  
  if (normalizedImagePath && !imageError) {
    return (
      <div className="relative w-full h-full">
        {isLoading && <CardSkeleton />}
        <Image 
          src={normalizedImagePath}
          alt={card.name}
          fill
          className={`object-cover object-center rounded-md transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {/* Enhanced purple overlay with blend mode for Agatha style */}
        <div className="absolute inset-0 bg-agatha-purple/30 mix-blend-overlay"></div>
      </div>
    );
  }
  
  // Fallback card display when image is unavailable
  return (
    <div className="w-full h-full flex items-center justify-center" style={cardGradientStyle}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Decorative magical circle */}
        <div className="absolute w-32 h-32 rounded-full border border-agatha-purple/30 animate-magic-pulse"></div>
        <div className="absolute w-24 h-24 rounded-full border border-agatha-rune/40 animate-witchcraft" style={{animationDuration: '12s'}}></div>
        
        {/* Card number and name */}
        <div className="font-witchcraft text-4xl text-agatha-vibrant animate-magic-text mb-2">
          {card.number}
        </div>
        <div className="font-mystical text-sm text-agatha-mist text-center px-4">
          {card.name}
        </div>
      </div>
    </div>
  );
}

// Enhanced hook for mouse movement effect with improved 3D parallax
export function useMouseMoveEffect() {
  const cardRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!cardRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      // Enhanced 3D effect with more dramatic transform
      cardRef.current.style.setProperty("--x", `${x}px`);
      cardRef.current.style.setProperty("--y", `${y}px`);
      
      // Calculate rotation based on mouse position for more dramatic effect
      const rotateX = y / 20; // More pronounced vertical rotation
      const rotateY = -x / 15; // More pronounced horizontal rotation
      
      cardRef.current.style.setProperty("--rotate-x", `${rotateX}deg`);
      cardRef.current.style.setProperty("--rotate-y", `${rotateY}deg`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    // Calculate distance from center for more accurate perspective
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };
  
  return {
    cardRef,
    handleMouseMove,
    handleMouseLeave
  };
} 