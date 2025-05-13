'use client';

import { useState, useRef, useEffect } from "react";
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
  
  useEffect(() => {
    const starElements = [];
    const numStars = Math.floor(Math.random() * 8) + 5;
    
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
  if (card.imagePath && !imageError) {
    return (
      <div className="relative w-full h-full">
        <Image 
          src={card.imagePath}
          alt={card.name}
          fill
          className="object-cover object-center rounded-md"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {/* Enhanced purple overlay with blend mode for Agatha style */}
        <div className="absolute inset-0 bg-agatha-purple/30 mix-blend-overlay"></div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex items-center justify-center" style={cardGradientStyle}>
      <div className="font-witchcraft text-4xl text-agatha-vibrant animate-magic-text">
        {card.number}
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