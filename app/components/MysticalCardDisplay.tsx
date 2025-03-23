'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Define a type for showcase card data
interface ShowcaseCard {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  imagePath: string;
}

export default function MysticalCardDisplay() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [stars, setStars] = useState<React.ReactNode[]>([]);
  
  // Sample showcase cards with actual image paths
  const showcaseCards: ShowcaseCard[] = [
    {
      id: "fool",
      name: "The Fool",
      description: "New beginnings, adventure, and the start of a journey into the unknown",
      keywords: ["Beginnings", "Adventure", "Potential"],
      imagePath: "/images/fool.jpg"
    },
    {
      id: "magician",
      name: "The Magician",
      description: "Manifestation, resourcefulness, and the power to transform your reality",
      keywords: ["Power", "Skill", "Manifestation"],
      imagePath: "/images/magician.jpg"
    },
    {
      id: "high-priestess",
      name: "The High Priestess",
      description: "Intuition, unconscious knowledge, and inner wisdom guiding your path",
      keywords: ["Intuition", "Mystery", "Wisdom"],
      imagePath: "/images/high-priestess.jpg"
    },
    {
      id: "star",
      name: "The Star",
      description: "Hope, inspiration, and spiritual connection to the universe",
      keywords: ["Hope", "Faith", "Inspiration"],
      imagePath: "/images/star.jpg"
    },
    {
      id: "moon",
      name: "The Moon",
      description: "Intuition, dreams, and navigating through the unknown and subconscious",
      keywords: ["Intuition", "Dreams", "Illusion"],
      imagePath: "/images/moon.jpg"
    },
    {
      id: "sun",
      name: "The Sun",
      description: "Success, vitality, and the warmth of achieving clarity and happiness",
      keywords: ["Joy", "Success", "Vitality"],
      imagePath: "/images/sun.jpg"
    }
  ];

  // Animation effect on mount and generate stars on client only
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Generate random stars in client-side only
      const generatedStars = [];
      for (let i = 0; i < 25; i++) {
        const size = Math.random() * 3 + 1;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        
        generatedStars.push(
          <div 
            key={i}
            className="twinkle absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              animationDelay: `${delay}s`
            }}
          />
        );
      }
      setStars(generatedStars);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle card selection
  const handleCardClick = (cardId: string) => {
    if (selectedCard === cardId) {
      // If already selected, start a reading
      router.push('/reading');
    } else {
      setSelectedCard(cardId);
    }
  };

  // Handle image error
  const handleImageError = (cardId: string) => {
    setImageErrors(prev => ({ ...prev, [cardId]: true }));
  };

  // Generate a symbolic representation for the card
  const getSymbol = (cardId: string) => {
    const symbols: Record<string, string> = {
      "fool": "☼",
      "magician": "✦",
      "high-priestess": "☽",
      "empress": "♀",
      "emperor": "♂",
      "lovers": "❤",
      "star": "★",
      "moon": "☾",
      "sun": "☀"
    };
    return symbols[cardId] || "✧";
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-16 relative">
      {/* Title */}
      <h2 className={`mystical-subtitle text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        Let the cards guide your journey
      </h2>
      
      {/* Organized card display area */}
      <div className="relative w-full bg-mystical-dark/40 rounded-xl border border-mystical-light/10 overflow-hidden p-8">
        {/* Background stars - only rendered client-side */}
        {mounted && stars}
        
        {/* Organized card layout in two rows */}
        <div className="w-full flex flex-col gap-12">
          {/* First row - featured cards */}
          <div className="flex justify-center flex-wrap gap-6 md:gap-8">
            {showcaseCards.slice(0, 3).map((card, index) => (
              <div
                key={card.id}
                className={`
                  transition-all duration-700 transform
                  ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                  ${selectedCard && selectedCard !== card.id ? 'opacity-30 scale-95' : ''}
                  ${selectedCard === card.id ? 'z-10 scale-110' : 'z-0'}
                `}
                style={{
                  transitionDelay: `${index * 0.2}s`
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="w-32 md:w-40 aspect-[2/3] bg-gradient-to-br from-mystical-primary to-mystical-accent/50 rounded-lg shadow-lg border border-mystical-gold/30 hover:shadow-glow-purple transition-all duration-300 relative overflow-hidden cursor-pointer">
                  {/* Card image - only render if mounted to avoid hydration mismatch */}
                  {mounted && !imageErrors[card.id] && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={card.imagePath}
                        alt={card.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 160px"
                        className="object-cover"
                        onError={() => handleImageError(card.id)}
                        priority
                      />
                    </div>
                  )}
                  
                  {/* Fallback for when image fails to load - only render if mounted */}
                  {mounted && imageErrors[card.id] && (
                    <div className="w-full h-full bg-gradient-to-br from-mystical-primary to-mystical-accent/50 p-3">
                      <div className="w-full h-full rounded-md bg-mystical-primary/70 backdrop-blur-sm flex flex-col justify-between p-3">
                        <div className="text-center">
                          <h3 className="font-mystical text-mystical-gold text-sm">{card.name}</h3>
                        </div>
                        
                        <div className="my-2 flex justify-center">
                          <div className="w-10 h-10 rounded-full bg-mystical-accent/30 flex items-center justify-center border border-mystical-light/20">
                            <span className="font-mystical text-mystical-gold text-xl">
                              {getSymbol(card.id)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-2xs text-mystical-light/80 text-center">
                          {card.keywords.join(' • ')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Always show card placeholder during SSR */}
                  {!mounted && (
                    <div className="w-full h-full bg-gradient-to-br from-mystical-primary to-mystical-accent/50 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-mystical-dark/40 flex items-center justify-center">
                        <span className="font-mystical text-mystical-gold text-xl">
                          {getSymbol(card.id)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay with card name */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-mystical-dark/70 backdrop-blur-sm border-t border-mystical-gold/20">
                    <h3 className="font-mystical text-mystical-gold text-center text-xs md:text-sm">{card.name}</h3>
                  </div>
                  
                  {/* Highlight effect */}
                  <div className={`absolute inset-0 border-2 border-mystical-gold/0 rounded-lg transition-all duration-300 ${selectedCard === card.id ? 'border-mystical-gold/70' : 'border-mystical-gold/0'}`}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - additional cards with slightly smaller display */}
          <div className="flex justify-center flex-wrap gap-6 md:gap-8">
            {showcaseCards.slice(3).map((card, index) => (
              <div
                key={card.id}
                className={`
                  transition-all duration-700 transform
                  ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                  ${selectedCard && selectedCard !== card.id ? 'opacity-30 scale-95' : ''}
                  ${selectedCard === card.id ? 'z-10 scale-110' : 'z-0'}
                `}
                style={{
                  transitionDelay: `${(index + 3) * 0.2}s`
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="w-28 md:w-36 aspect-[2/3] bg-gradient-to-br from-mystical-primary to-mystical-accent/50 rounded-lg shadow-lg border border-mystical-gold/30 hover:shadow-glow-purple transition-all duration-300 relative overflow-hidden cursor-pointer">
                  {/* Card image - only render if mounted */}
                  {mounted && !imageErrors[card.id] && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={card.imagePath}
                        alt={card.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 144px"
                        className="object-cover"
                        onError={() => handleImageError(card.id)}
                        priority
                      />
                    </div>
                  )}
                  
                  {/* Fallback for when image fails to load - only render if mounted */}
                  {mounted && imageErrors[card.id] && (
                    <div className="w-full h-full bg-gradient-to-br from-mystical-primary to-mystical-accent/50 p-3">
                      <div className="w-full h-full rounded-md bg-mystical-primary/70 backdrop-blur-sm flex flex-col justify-between p-3">
                        <div className="text-center">
                          <h3 className="font-mystical text-mystical-gold text-xs">{card.name}</h3>
                        </div>
                        
                        <div className="my-2 flex justify-center">
                          <div className="w-8 h-8 rounded-full bg-mystical-accent/30 flex items-center justify-center border border-mystical-light/20">
                            <span className="font-mystical text-mystical-gold text-lg">
                              {getSymbol(card.id)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-2xs text-mystical-light/80 text-center">
                          {card.keywords[0]}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Always show card placeholder during SSR */}
                  {!mounted && (
                    <div className="w-full h-full bg-gradient-to-br from-mystical-primary to-mystical-accent/50 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-mystical-dark/40 flex items-center justify-center">
                        <span className="font-mystical text-mystical-gold text-lg">
                          {getSymbol(card.id)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay with card name */}
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-mystical-dark/70 backdrop-blur-sm border-t border-mystical-gold/20">
                    <h3 className="font-mystical text-mystical-gold text-center text-xs">{card.name}</h3>
                  </div>
                  
                  {/* Highlight effect */}
                  <div className={`absolute inset-0 border-2 border-mystical-gold/0 rounded-lg transition-all duration-300 ${selectedCard === card.id ? 'border-mystical-gold/70' : 'border-mystical-gold/0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Card description (shown when a card is selected) - only show if mounted */}
        {mounted && selectedCard && (
          <div className="absolute bottom-4 left-0 right-0 mx-auto w-4/5 bg-mystical-dark/80 backdrop-blur-md p-4 rounded border border-mystical-light/10 transition-all duration-500 animate-fade-in text-center">
            <p className="text-mystical-light text-sm">
              {showcaseCards.find(card => card.id === selectedCard)?.description}
            </p>
            
            <div className="mt-3 flex justify-center">
              <button
                className="mystical-button text-sm px-4 py-2"
                onClick={() => router.push('/reading')}
              >
                Begin Your Reading
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Call to action */}
      <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <Link href="/reading" className="mystical-button inline-block">
          Explore All Readings
        </Link>
      </div>
    </div>
  );
} 