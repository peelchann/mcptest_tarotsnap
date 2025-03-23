'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TarotCard from '../../components/TarotCard';
import { getRandomCard } from '../../data/cards';
import type { TarotCard as TarotCardType } from '../../data/cards';

export default function SingleCardReading() {
  const [card, setCard] = useState<TarotCardType | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [question, setQuestion] = useState('');
  const [isReadingStarted, setIsReadingStarted] = useState(false);
  const [isCardDrawn, setIsCardDrawn] = useState(false);
  const [isReadingComplete, setIsReadingComplete] = useState(false);

  // Reset reading state when component loads
  useEffect(() => {
    // Reset everything on mount
    setCard(null);
    setIsFlipped(false);
    setIsReadingStarted(false);
    setIsCardDrawn(false);
    setIsReadingComplete(false);
    
    // 50% chance of card being reversed
    setIsReversed(Math.random() > 0.5);
  }, []);

  // Start the reading process
  const startReading = () => {
    setIsReadingStarted(true);
  };

  // Draw a card
  const drawCard = () => {
    // Get a random card
    const randomCard = getRandomCard();
    setCard(randomCard);
    setIsCardDrawn(true);
    
    // Flip the card after a delay
    setTimeout(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setIsReadingComplete(true);
      }, 1000);
    }, 2000);
  };

  // Start a new reading
  const newReading = () => {
    setCard(null);
    setIsFlipped(false);
    setIsReversed(Math.random() > 0.5);
    setQuestion('');
    setIsReadingStarted(false);
    setIsCardDrawn(false);
    setIsReadingComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="mystical-title mb-6">Single Card Reading</h1>
      
      {!isReadingStarted ? (
        <div className="mystical-card max-w-md w-full">
          <h2 className="mystical-subtitle mb-4">What question seeks answer?</h2>
          <p className="mb-6 text-sm">
            Focus your energy and intention as you prepare to draw a card.
            You may ask a specific question or simply reflect on your current situation.
          </p>
          
          <textarea
            className="mystical-input w-full mb-4 min-h-20"
            placeholder="Enter your question here... (optional)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          
          <button 
            className="mystical-button w-full"
            onClick={startReading}
          >
            Begin Reading
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center">
          {question && (
            <div className="mb-6 italic text-mystical-light/70 text-center max-w-md">
              "{question}"
            </div>
          )}
          
          <div className="w-full flex flex-col items-center justify-center mb-8">
            {!isCardDrawn ? (
              <div className="text-center">
                <p className="mystical-subtitle mb-6">
                  Focus your energy and draw your card
                </p>
                <button 
                  className="mystical-button animate-pulse"
                  onClick={drawCard}
                >
                  Draw Card
                </button>
              </div>
            ) : (
              <div className="max-w-xs w-full">
                {card && (
                  <TarotCard 
                    card={card}
                    isReversed={isReversed}
                    isFlipped={isFlipped}
                    className="mx-auto"
                  />
                )}
              </div>
            )}
          </div>
          
          {isReadingComplete && (
            <div className="mystical-card p-6 max-w-md w-full text-center mt-6">
              <h2 className="mystical-subtitle mb-4">
                {isReversed ? 'Reversed' : 'Upright'} {card?.name}
              </h2>
              
              <div className="mb-6">
                <p className="mb-4">
                  The {card?.name} represents {isReversed ? card?.meaning.reversed.toLowerCase() : card?.meaning.upright.toLowerCase()}.
                </p>
                <p className="text-sm text-mystical-light/70">
                  Reflect on how this card's energy relates to your question or current situation.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="mystical-button bg-opacity-50 hover:bg-opacity-70"
                  onClick={newReading}
                >
                  New Reading
                </button>
                <Link href="/" className="mystical-button">
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 