'use client';

import { useEffect, useRef } from 'react';

// Star class with improved properties
class Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  pulseSpeed: number;
  pulseDirection: number;
  twinkle: boolean;
  twinkleSpeed: number;
  color: string;
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.speed = Math.random() * 0.05 + 0.01;
    this.pulseSpeed = Math.random() * 0.01 + 0.005;
    this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
    this.twinkle = Math.random() > 0.7;
    this.twinkleSpeed = Math.random() * 0.03 + 0.01;
    
    // Add some color variation to stars
    const colorChance = Math.random();
    if (colorChance > 0.97) {
      this.color = 'rgba(255, 215, 0, '; // Gold star (rare)
    } else if (colorChance > 0.94) {
      this.color = 'rgba(156, 39, 176, '; // Purple star (uncommon)
    } else if (colorChance > 0.9) {
      this.color = 'rgba(200, 200, 255, '; // Blue-white star (uncommon)
    } else {
      this.color = 'rgba(255, 255, 255, '; // White star (common)
    }
  }

  update() {
    // Move stars downward slowly (parallax effect)
    this.y += this.speed;
    
    // Reset star position when it moves off-screen
    if (this.y > this.canvasHeight) {
      this.y = 0;
      this.x = Math.random() * this.canvasWidth;
    }
    
    // Pulse star size for twinkling effect
    if (this.twinkle) {
      this.opacity += this.twinkleSpeed * this.pulseDirection;
      
      if (this.opacity > 1) {
        this.opacity = 1;
        this.pulseDirection = -1;
      } else if (this.opacity < 0.2) {
        this.opacity = 0.2;
        this.pulseDirection = 1;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    // Draw star with glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.fill();
    
    // Add glow effect to larger stars
    if (this.size > 1.5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
      ctx.fill();
    }
  }
}

// Shooting star class
class ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  lifetime: number;
  maxLifetime: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight / 2;
    this.length = Math.random() * 80 + 40;
    this.speed = Math.random() * 10 + 5;
    this.opacity = 1;
    this.width = Math.random() * 2 + 1;
    this.lifetime = 0;
    this.maxLifetime = Math.random() * 100 + 50;
  }

  update() {
    this.x += this.speed;
    this.y += this.speed * 0.6;
    this.lifetime++;
    
    if (this.lifetime > this.maxLifetime * 0.7) {
      this.opacity = 1 - ((this.lifetime - this.maxLifetime * 0.7) / (this.maxLifetime * 0.3));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;
    
    ctx.lineWidth = this.width;
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.length, this.y - this.length * 0.6);
    ctx.stroke();
  }

  isFinished() {
    return this.lifetime >= this.maxLifetime || this.x > this.canvasWidth || this.y > this.canvasHeight;
  }
}

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create stars
    const starCount = window.innerWidth < 768 ? 100 : 200;
    const stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = 0;
    
    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate stars on resize
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star(canvas.width, canvas.height));
      }
    };
    
    // Initialize canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create initial stars
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }
    
    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw radial gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      );
      gradient.addColorStop(0, 'rgba(31, 31, 61, 0.03)');
      gradient.addColorStop(0.5, 'rgba(156, 39, 176, 0.01)');
      gradient.addColorStop(1, 'rgba(15, 15, 26, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      
      // Occasionally create a shooting star
      const now = Date.now();
      if (now - lastShootingStarTime > 5000 && Math.random() > 0.995) {
        shootingStars.push(new ShootingStar(canvas.width, canvas.height));
        lastShootingStarTime = now;
      }
      
      // Update and draw shooting stars
      shootingStars.forEach(shootingStar => {
        shootingStar.update();
        shootingStar.draw(ctx);
      });
      
      // Remove finished shooting stars
      shootingStars = shootingStars.filter(star => !star.isFinished());
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ backgroundColor: 'transparent' }}
    />
  );
} 