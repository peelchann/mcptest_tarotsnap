'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ReadingPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const spreadOptions = [
    {
      id: 'single',
      name: 'Single Card',
      description: 'A quick insight for your day or a specific question',
      path: '/reading/single',
      animation: ''
    },
    {
      id: 'three',
      name: 'Three Card Spread',
      description: 'Past, present, and future guidance',
      path: '/reading/three',
      animation: 'delay-200'
    },
    {
      id: 'celtic',
      name: 'Celtic Cross',
      description: 'A comprehensive insight into your situation',
      path: '/reading/celtic',
      animation: 'delay-400'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <header className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="mystical-title mb-2">Choose Your Reading</h1>
        <p className="mystical-subtitle">Select a spread to begin your mystical journey</p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {spreadOptions.map((spread) => (
            <div 
              key={spread.id}
              className={`mystical-card transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${spread.animation}`}
            >
              <h2 className="text-mystical-gold font-mystical text-xl mb-3">{spread.name}</h2>
              <p className="text-sm mb-6">{spread.description}</p>
              <Link href={spread.path} className="mystical-button block w-full text-center">
                Begin Reading
              </Link>
            </div>
          ))}
        </div>
        
        <div className={`mystical-card p-6 max-w-2xl mx-auto transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="mystical-subtitle mb-4">Prepare Your Energy</h2>
          <p className="mb-4">
            Before your reading, take a moment to center yourself. 
            Focus on your question or situation, and clear your mind of distractions.
          </p>
          <p className="text-sm text-mystical-light/70">
            The cards respond to your energy and intention. 
            The clearer your question, the more precise your reading will be.
          </p>
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