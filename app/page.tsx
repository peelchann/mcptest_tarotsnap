'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MysticalCardDisplay from './components/MysticalCardDisplay';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-16 h-16 border border-mystical-gold/30 rounded-full animate-spin-slow opacity-20"></div>
      <div className="absolute top-40 right-20 w-12 h-12 border border-mystical-gold/30 rounded-full animate-spin-slow-reverse opacity-20"></div>
      <div className="absolute bottom-20 left-40 w-20 h-20 border border-mystical-gold/30 rounded-full animate-spin-slow opacity-20"></div>
      <div className="absolute bottom-40 right-40 w-14 h-14 border border-mystical-gold/30 rounded-full animate-spin-slow-reverse opacity-20"></div>
      
      {/* Header section with improved spacing */}
      <header className="text-center py-16">
        <h1 className="mystical-title text-3xl md:text-5xl lg:text-6xl mb-6 text-mystical-gold animate-float">
          TarotSnap
        </h1>
        <p className="mystical-subtitle text-lg md:text-xl max-w-3xl mx-auto mb-8 text-mystical-light/80">
          Discover insights, guidance, and mystical wisdom through interactive tarot readings
        </p>
        <div className="h-0.5 w-40 mx-auto bg-gradient-to-r from-transparent via-mystical-gold/50 to-transparent"></div>
      </header>
      
      {/* Featured card section - now using MysticalCardDisplay component */}
      <section className="mb-24">
        <MysticalCardDisplay />
      </section>
      
      {/* Reading types section with improved spacing */}
      <section className="mb-24 bg-mystical-dark/30 border border-mystical-light/5 rounded-xl p-8 md:p-12">
        <h2 className="mystical-subtitle text-center text-2xl md:text-3xl mb-12 text-mystical-gold">
          Explore Your Reading Options
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Single Card Reading */}
          <div className="mystical-card group hover:shadow-glow-purple">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mystical-primary/30 border border-mystical-light/10 flex items-center justify-center group-hover:border-mystical-gold/30 transition-all duration-300">
                <span className="font-mystical text-mystical-gold text-xl">☉</span>
              </div>
              <h3 className="font-mystical text-xl mb-3 text-mystical-gold">Single Card</h3>
              <p className="text-sm text-mystical-light/70 mb-6">
                Quick guidance for a specific question or for your day ahead
              </p>
              <Link href="/reading/single" className="mystical-button">
                Start Reading
              </Link>
            </div>
          </div>
          
          {/* Three Card Reading */}
          <div className="mystical-card group hover:shadow-glow-purple">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mystical-primary/30 border border-mystical-light/10 flex items-center justify-center group-hover:border-mystical-gold/30 transition-all duration-300">
                <span className="font-mystical text-mystical-gold text-xl">☽</span>
              </div>
              <h3 className="font-mystical text-xl mb-3 text-mystical-gold">Past-Present-Future</h3>
              <p className="text-sm text-mystical-light/70 mb-6">
                Understand how your past influences your present and future
              </p>
              <Link href="/reading/three" className="mystical-button">
                Start Reading
              </Link>
            </div>
          </div>
          
          {/* Celtic Cross Reading */}
          <div className="mystical-card group hover:shadow-glow-purple">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mystical-primary/30 border border-mystical-light/10 flex items-center justify-center group-hover:border-mystical-gold/30 transition-all duration-300">
                <span className="font-mystical text-mystical-gold text-xl">★</span>
              </div>
              <h3 className="font-mystical text-xl mb-3 text-mystical-gold">Celtic Cross</h3>
              <p className="text-sm text-mystical-light/70 mb-6">
                Comprehensive insight into complex situations and influences
              </p>
              <Link href="/reading/celtic" className="mystical-button">
                Start Reading
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section with improved spacing */}
      <section className="mb-24">
        <h2 className="mystical-subtitle text-center text-2xl md:text-3xl mb-12 text-mystical-gold">
          Mystical Features
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Interpretation */}
          <div className="mystical-card p-6">
            <h3 className="font-mystical text-xl mb-3 text-mystical-gold flex items-center">
              <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-mystical-primary/30 border border-mystical-light/10 mr-3">
                <span className="font-mystical text-mystical-gold text-sm">✦</span>
              </span>
              AI-Enhanced Interpretations
            </h3>
            <p className="text-mystical-light/70">
              Our mystical AI analyzes your tarot spread, providing personalized insights based on ancient wisdom and modern understanding.
            </p>
          </div>
          
          {/* Card Meanings */}
          <div className="mystical-card p-6">
            <h3 className="font-mystical text-xl mb-3 text-mystical-gold flex items-center">
              <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-mystical-primary/30 border border-mystical-light/10 mr-3">
                <span className="font-mystical text-mystical-gold text-sm">⚹</span>
              </span>
              Detailed Card Meanings
            </h3>
            <p className="text-mystical-light/70">
              Explore the rich symbolism and interpretations of each tarot card, in both upright and reversed positions.
            </p>
          </div>
          
          {/* Save Readings */}
          <div className="mystical-card p-6">
            <h3 className="font-mystical text-xl mb-3 text-mystical-gold flex items-center">
              <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-mystical-primary/30 border border-mystical-light/10 mr-3">
                <span className="font-mystical text-mystical-gold text-sm">☿</span>
              </span>
              Save Your Readings
            </h3>
            <p className="text-mystical-light/70">
              Store your readings to revisit them later, tracking how the cards' guidance manifests in your life over time.
            </p>
          </div>
          
          {/* Journal */}
          <div className="mystical-card p-6">
            <h3 className="font-mystical text-xl mb-3 text-mystical-gold flex items-center">
              <span className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-mystical-primary/30 border border-mystical-light/10 mr-3">
                <span className="font-mystical text-mystical-gold text-sm">♇</span>
              </span>
              Mystical Journal
            </h3>
            <p className="text-mystical-light/70">
              Keep a personal record of your spiritual journey, documenting insights and reflections alongside your readings.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to action section with improved spacing */}
      <section className="text-center mb-24 bg-gradient-to-b from-mystical-primary/20 to-transparent py-16 px-4 rounded-xl border border-mystical-light/5">
        <h2 className="mystical-subtitle text-2xl md:text-3xl mb-6 text-mystical-gold">
          Begin Your Mystical Journey
        </h2>
        <p className="text-mystical-light/80 max-w-2xl mx-auto mb-8">
          Unlock the ancient wisdom of tarot and discover insights that will illuminate your path forward. The cards are waiting to share their secrets with you.
        </p>
        <Link href="/reading" className="mystical-button text-lg px-8 py-3 animate-pulse-subtle">
          Start Your Reading
        </Link>
      </section>
      
      {/* Footer with improved spacing */}
      <footer className="text-center py-10 mt-16 border-t border-mystical-light/10">
        <p className="text-mystical-light/50 text-sm">
          TarotSnap © {new Date().getFullYear()} | The mystical journey awaits
        </p>
      </footer>
    </div>
  );
}
