'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <header className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="mystical-title mb-2">About TarotSnap</h1>
        <p className="mystical-subtitle">Discover the mystical journey</p>
      </header>

      <main className="w-full max-w-4xl">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mystical-card">
            <h2 className="text-mystical-gold font-mystical text-xl mb-3">Our Vision</h2>
            <p className="mb-4">
              TarotSnap was created to provide a modern, accessible approach to the ancient wisdom of tarot. 
              We combine traditional tarot symbolism with cutting-edge AI interpretation to offer insights tailored to your unique situation.
            </p>
            <p>
              Whether you're a tarot enthusiast or a curious newcomer, our platform offers a space for reflection, insight, and personal growth.
            </p>
          </div>
          
          <div className="mystical-card">
            <h2 className="text-mystical-gold font-mystical text-xl mb-3">The Tarot Journey</h2>
            <p className="mb-4">
              Tarot cards have been used for centuries as tools for divination, self-discovery, and spiritual guidance. 
              Each card contains rich symbolism that speaks to different aspects of the human experience.
            </p>
            <p>
              Our readings aim to help you connect with your intuition and gain perspective on your life's journey.
            </p>
          </div>
        </div>
        
        <div className={`mystical-card p-6 max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="mystical-subtitle mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-3 mb-4">
            <li>
              <span className="font-semibold text-mystical-light">Choose a spread</span>: Select the reading layout that best fits your needs
            </li>
            <li>
              <span className="font-semibold text-mystical-light">Focus your energy</span>: Consider your question or situation
            </li>
            <li>
              <span className="font-semibold text-mystical-light">Draw your cards</span>: Our virtual deck will shuffle and present your cards
            </li>
            <li>
              <span className="font-semibold text-mystical-light">Receive insights</span>: Read the interpretation of your unique spread
            </li>
            <li>
              <span className="font-semibold text-mystical-light">Reflect</span>: Consider how the reading applies to your life
            </li>
          </ol>
          <p className="text-sm text-mystical-light/70">
            Remember, tarot readings offer guidance and perspective, but you always have the power to shape your own path.
          </p>
        </div>
        
        <div className={`text-center transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/reading" className="mystical-button inline-block">
            Begin Your Reading
          </Link>
        </div>
      </main>
      
      <footer className="mt-12">
        <Link href="/" className="text-mystical-light/60 hover:text-mystical-light transition-colors">
          Return Home
        </Link>
      </footer>
    </div>
  );
} 