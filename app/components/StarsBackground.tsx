'use client';

import { useEffect, useState, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
  color: string;
}

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isCanvasSupported, setIsCanvasSupported] = useState(true);

  useEffect(() => {
    setMounted(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      setIsCanvasSupported(false);
      return;
    }

    // Check if canvas is supported
    const testCanvas = document.createElement('canvas');
    setIsCanvasSupported(!!testCanvas.getContext('2d'));
    
    if (!canvasRef.current) return;
    
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext('2d');
    
    if (!ctx) {
      setIsCanvasSupported(false);
      return;
    }
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvasElement) return;
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create stars
    const stars: Star[] = [];
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
    
    const colors = [
      'rgba(255, 255, 255, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(147, 51, 234, 0.65)',
      'rgba(192, 132, 252, 0.7)'
    ];
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * canvasElement.width;
      const y = Math.random() * canvasElement.height;
      const size = Math.random() * 2;
      const speed = Math.random() * 0.2 + 0.1;
      const brightness = Math.random() * 0.5 + 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      stars.push({ x, y, size, speed, brightness, color });
    }
    
    // Animation function
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.brightness;
        ctx.fill();
        
        // Update star position for next frame
        star.y = (star.y + star.speed) % canvasElement.height;
        
        // Randomly adjust brightness for twinkling effect
        star.brightness += Math.random() * 0.1 - 0.05;
        star.brightness = Math.max(0.1, Math.min(1, star.brightness));
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  // Fallback static background with CSS stars when canvas isn't available
  if (!mounted || !isCanvasSupported) {
    return <StarsFallback />;
  }
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}

// CSS-only fallback for when Canvas isn't available or during initial load
export function StarsFallback() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-agatha-dark">
      <div className="stars-container">
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 3 + 2;
          const delay = Math.random() * 2;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: Math.random() * 0.7 + 0.3,
                boxShadow: `0 0 ${size * 2}px ${size}px rgba(168, 85, 247, 0.4)`,
                animation: `twinkle ${duration}s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
} 