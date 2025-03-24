'use client';

import { useEffect, useRef, useState } from 'react';

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      pulseSpeed: number;
      pulseDirection: number;
      canvasWidth: number;
      canvasHeight: number;
      color: string;
      twinkleSpeed: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.size = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
        // Occasionally make stars purple for Agatha effect
        this.color = Math.random() > 0.8 ? 
          `rgb(${150 + Math.random() * 50}, ${30 + Math.random() * 20}, ${220 + Math.random() * 35})` : 
          'rgb(255, 255, 255)';
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      }

      draw() {
        if (!ctx) return;
        
        // Star glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.fill();
        
        // Star core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        ctx.globalAlpha = 1;
      }

      update() {
        // Pulse the opacity
        this.opacity += this.pulseSpeed * this.pulseDirection;
        
        // Change direction if reaching opacity limits
        if (this.opacity > 0.8 || this.opacity < 0.2) {
          this.pulseDirection *= -1;
        }
        
        // Slow twinkling movement
        this.x += Math.random() * 0.2 - 0.1;
        this.y += Math.random() * 0.2 - 0.1;
        
        // Reset stars that move off canvas
        if (this.x < 0 || this.x > this.canvasWidth || this.y < 0 || this.y > this.canvasHeight) {
          this.x = Math.random() * this.canvasWidth;
          this.y = Math.random() * this.canvasHeight;
        }
      }
    }
    
    // Create Agatha's dark magic wisps
    class DarkWisp {
      points: {x: number, y: number}[];
      width: number;
      length: number;
      speed: number;
      opacity: number;
      color: string;
      angle: number;
      angleSpeed: number;
      colorShift: number;
      lifespan: number;
      age: number;
      canvasWidth: number;
      canvasHeight: number;
      
      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // Start position near edges
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        
        if (edge === 0) {
          // Top
          x = Math.random() * canvasWidth;
          y = -50;
        } else if (edge === 1) {
          // Right
          x = canvasWidth + 50;
          y = Math.random() * canvasHeight;
        } else if (edge === 2) {
          // Bottom
          x = Math.random() * canvasWidth;
          y = canvasHeight + 50;
        } else {
          // Left
          x = -50;
          y = Math.random() * canvasHeight;
        }
        
        this.points = [{x, y}];
        this.width = Math.random() * 3 + 1;
        this.length = Math.floor(Math.random() * 15) + 10;
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = `hsl(${270 + Math.random() * 30}, 80%, 40%)`;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() * 0.02 - 0.01) * (Math.random() > 0.5 ? 1 : -1);
        this.colorShift = Math.random() * 0.5 + 0.1;
        this.lifespan = Math.random() * 200 + 100;
        this.age = 0;
      }
      
      update() {
        // Move in a curved path
        this.angle += this.angleSpeed;
        
        // Aim loosely towards center of screen
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        const lastPoint = this.points[this.points.length - 1];
        const angleToCenter = Math.atan2(centerY - lastPoint.y, centerX - lastPoint.x);
        
        // Blend between random angle and angle to center
        const blendFactor = 0.03;
        this.angle = this.angle * (1 - blendFactor) + angleToCenter * blendFactor;
        
        // Add new point in the direction of travel
        const newX = lastPoint.x + Math.cos(this.angle) * this.speed;
        const newY = lastPoint.y + Math.sin(this.angle) * this.speed;
        this.points.push({x: newX, y: newY});
        
        // Remove old points to maintain length
        if (this.points.length > this.length) {
          this.points.shift();
        }
        
        // Increase age
        this.age++;
        
        // Fade out as it ages
        if (this.age > this.lifespan * 0.7) {
          this.opacity *= 0.98;
        }
        
        return this.age < this.lifespan && this.opacity > 0.01;
      }
      
      draw() {
        if (!ctx || this.points.length < 2) return;
        
        // Draw the wisp as a gradient path
        for (let i = 1; i < this.points.length; i++) {
          const p1 = this.points[i - 1];
          const p2 = this.points[i];
          
          // Calculate gradient color based on position in wisp
          const progress = i / this.points.length;
          const hue = 270 + Math.sin(progress * Math.PI + this.age * this.colorShift) * 30;
          const lightness = 30 + progress * 30; // Lighter at the tail
          
          // Draw line segment
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(${hue}, 80%, ${lightness}%, ${this.opacity * (1 - progress * 0.5)})`;
          ctx.lineWidth = this.width * (1 - progress * 0.6);
          ctx.stroke();
          
          // Occasional glow at points
          if (Math.random() > 0.95) {
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, this.width, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 90%, ${lightness + 10}%, ${this.opacity * 0.8})`;
            ctx.fill();
          }
        }
      }
    }
    
    // Create mystical runes for a witchy effect
    class MagicRune {
      x: number;
      y: number;
      size: number;
      opacity: number;
      maxOpacity: number;
      fadeSpeed: number;
      fadeDirection: number;
      runeType: number;
      rotation: number;
      rotationSpeed: number;
      pulseSize: number;
      pulseSizeDirection: number;
      canvasWidth: number;
      canvasHeight: number;
      
      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.size = Math.random() * 20 + 15;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.3 + 0.1;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
        this.fadeDirection = 1;
        this.runeType = Math.floor(Math.random() * 6);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.01 - 0.005) * (Math.random() > 0.5 ? 1 : -1);
        this.pulseSize = 1;
        this.pulseSizeDirection = Math.random() > 0.5 ? 1 : -1;
      }
      
      update() {
        // Fade in/out
        this.opacity += this.fadeSpeed * this.fadeDirection;
        
        if (this.opacity >= this.maxOpacity) {
          this.fadeDirection = -1;
        } else if (this.opacity <= 0 && this.fadeDirection < 0) {
          // Reset to a new position when fully faded out
          this.x = Math.random() * this.canvasWidth;
          this.y = Math.random() * this.canvasHeight;
          this.fadeDirection = 1;
          this.runeType = Math.floor(Math.random() * 6);
        }
        
        // Rotate
        this.rotation += this.rotationSpeed;
        
        // Pulse size
        this.pulseSize += 0.01 * this.pulseSizeDirection;
        if (this.pulseSize > 1.2 || this.pulseSize < 0.9) {
          this.pulseSizeDirection *= -1;
        }
      }
      
      draw() {
        if (!ctx || this.opacity <= 0) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.pulseSize, this.pulseSize);
        
        // Purple glow
        ctx.shadowColor = 'rgba(140, 30, 240, 0.7)';
        ctx.shadowBlur = 15;
        
        // Different rune shapes
        ctx.strokeStyle = `rgba(176, 38, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        
        switch (this.runeType) {
          case 0: // Triangle rune
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.stroke();
            
            // Center mark
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 6, 0, Math.PI * 2);
            ctx.stroke();
            break;
            
          case 1: // Circle with cross
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(0, this.size / 2);
            ctx.moveTo(-this.size / 2, 0);
            ctx.lineTo(this.size / 2, 0);
            ctx.stroke();
            break;
            
          case 2: // Pentagram
            const points = 5;
            const innerRadius = this.size / 4;
            const outerRadius = this.size / 2;
            
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / points;
              if (i === 0) {
                ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
              } else {
                ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
              }
            }
            ctx.closePath();
            ctx.stroke();
            break;
            
          case 3: // Square with diagonals
            ctx.beginPath();
            ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.moveTo(-this.size / 2, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.moveTo(this.size / 2, -this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.stroke();
            break;
            
          case 4: // Eye symbol
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size / 2, this.size / 4, 0, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 8, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          case 5: // Spiral
            ctx.beginPath();
            for (let i = 0; i < 4 * Math.PI; i += 0.1) {
              const radius = (this.size / 2) * (i / (4 * Math.PI));
              const x = radius * Math.cos(i);
              const y = radius * Math.sin(i);
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
            break;
        }
        
        ctx.restore();
      }
    }

    // Create a collection of stars
    const stars: Star[] = [];
    const numberOfStars = Math.floor((canvas.width * canvas.height) / 5000); // Adjust density
    
    for (let i = 0; i < numberOfStars; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }
    
    // Create dark wisps
    const darkWisps: DarkWisp[] = [];
    const maxWisps = 6; // Number of wisps to maintain
    
    // Create magic runes
    const magicRunes: MagicRune[] = [];
    const maxRunes = 4; // Number of runes to maintain
    
    // Add initial runes
    for (let i = 0; i < maxRunes; i++) {
      magicRunes.push(new MagicRune(canvas.width, canvas.height));
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw dark background
      ctx.fillStyle = '#190029';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      
      // Update and draw wisps
      for (let i = darkWisps.length - 1; i >= 0; i--) {
        const alive = darkWisps[i].update();
        if (!alive) {
          darkWisps.splice(i, 1);
        } else {
          darkWisps[i].draw();
        }
      }
      
      // Add new wisps occasionally
      if (darkWisps.length < maxWisps && Math.random() < 0.02) {
        darkWisps.push(new DarkWisp(canvas.width, canvas.height));
      }
      
      // Update and draw runes
      magicRunes.forEach(rune => {
        rune.update();
        rune.draw();
      });
      
      // Create a subtle purple glow in the center
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 2
      );
      
      gradient.addColorStop(0, 'rgba(110, 33, 172, 0.1)');
      gradient.addColorStop(0.5, 'rgba(110, 33, 172, 0.03)');
      gradient.addColorStop(1, 'rgba(110, 33, 172, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Occasional pulse effect from center
      if (Math.random() < 0.005) {
        const pulseRadius = Math.random() * 100 + 50;
        const pulseGradient = ctx.createRadialGradient(
          canvas.width / 2, 
          canvas.height / 2, 
          0, 
          canvas.width / 2, 
          canvas.height / 2, 
          pulseRadius
        );
        
        pulseGradient.addColorStop(0, 'rgba(176, 38, 255, 0.2)');
        pulseGradient.addColorStop(1, 'rgba(176, 38, 255, 0)');
        
        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      {mounted && (
        <div className="magic-mist" aria-hidden="true"></div>
      )}
    </>
  );
} 