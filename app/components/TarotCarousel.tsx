"use client";

import { useState } from "react";
import { Sparkles, MoveUpRight, MoveDownLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import type { TarotCard } from "../data/cards";
import { CardImage, useMouseMoveEffect, useStarEffect, useSpotlightEffect } from "./CardUtils";

interface TarotCardProps {
  card: TarotCard;
}

const TarotCardComponent = ({ card }: TarotCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(card.isReversed || Math.random() > 0.7);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Use shared hooks
  const stars = useStarEffect();
  const { cardRef, handleMouseMove, handleMouseLeave } = useMouseMoveEffect();
  const { spotlightRef, handleMouseMove: handleSpotlightMove, spotlightStyle } = useSpotlightEffect();

  return (
    <div 
      className="[perspective:1200px] [transform-style:preserve-3d]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
    >
      {/* Magical particles that appear on hover */}
      {isHovered && (
        <div className="absolute -inset-6 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-agatha-rune/60 animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-3/4 right-1/3 h-1.5 w-1.5 rounded-full bg-agatha-accent/60 animate-float" style={{ animationDelay: '0.7s', animationDuration: '2.5s' }} />
          <div className="absolute top-1/2 right-1/4 h-2 w-2 rounded-full bg-agatha-purple/60 animate-float" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
        </div>
      )}
      
      <div
        ref={cardRef}
        className={cn(
          "relative flex h-[450px] w-[280px] cursor-pointer select-none flex-col rounded-xl transition-all duration-700 group will-change-transform",
          isHovered 
            ? "magical-border shadow-intense-glow" 
            : "border-2 border-agatha-purple/50 bg-agatha-dark/70 backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.5)]",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleSpotlightMove(e);
        }}
        style={{
          transform: `${isFlipped ? "rotateY(180deg)" : "rotateY(0)"} 
                     perspective(1200px) 
                     rotateX(var(--rotate-x, 0deg)) 
                     rotateY(var(--rotate-y, 0deg)) 
                     translate3d(calc(var(--x) / 25), calc(var(--y) / 25), 0)`,
          transition: isHovered 
            ? "transform 0.1s ease-out, box-shadow 0.3s ease" 
            : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
        }}
      >
        {/* Spotlight effect */}
        <div 
          ref={spotlightRef}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl overflow-hidden pointer-events-none z-10"
          style={spotlightStyle}
        />
        
        {/* Floating runes that appear when hovering */}
        {isHovered && (
          <div className="absolute -inset-3 z-0">
            <div className="absolute top-0 left-1/4 font-witchcraft text-xl text-agatha-rune/30 animate-magic-text delay-100">ᛦ</div>
            <div className="absolute bottom-0 right-1/4 font-witchcraft text-xl text-agatha-rune/30 animate-magic-text delay-200">ᛏ</div>
            <div className="absolute top-1/3 right-0 font-witchcraft text-xl text-agatha-rune/30 animate-magic-text delay-300">ᛯ</div>
            <div className="absolute bottom-1/3 left-0 font-witchcraft text-xl text-agatha-rune/30 animate-magic-text delay-400">ᛥ</div>
          </div>
        )}
      
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-xl p-4 backface-hidden",
            isReversed ? "rotate-180" : ""
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-agatha-purple/80 px-2 py-1 text-xs text-purple-100 transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="size-3 text-purple-300" />
              {isReversed ? "Reversed" : "Upright"}
            </span>
            {isReversed ? (
              <MoveDownLeft className="size-4 text-purple-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            ) : (
              <MoveUpRight className="size-4 text-purple-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            )}
          </div>

          {/* Card Content with parallax effect */}
          <div className="relative flex-1 w-full mt-2 mb-1 rounded-lg overflow-hidden">
            {/* Enhanced image with parallax */}
            <div className={`w-full h-full transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}>
              <CardImage
                card={card}
                imageError={imageError}
                setImageError={setImageError}
              />
            </div>
            
            {/* Magical Border */}
            <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-agatha-purple/30 group-hover:border-agatha-accent/50 transition-colors duration-500"></div>
          </div>

          <div className="w-full text-center">
            <h3 className="font-witchcraft text-xl text-agatha-vibrant animate-magic-text group-hover:text-agatha-accent transition-colors duration-300">{card.name}</h3>
            <p className="mt-1 text-xs text-purple-300 font-mystical group-hover:text-agatha-mist transition-colors duration-300">
              {card.keywords.slice(0, 3).join(" • ")}
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-agatha-deeper to-agatha-purple/90 p-4 text-white backface-hidden rotate-y-180",
          )}
        >
          <div className="relative flex h-full w-full flex-col items-center justify-center">
            {/* Enhanced Magic Circle with more layers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-44 rounded-full border-2 border-agatha-accent/40 animate-witchcraft"></div>
              <div className="absolute size-32 rounded-full border-2 border-agatha-rune/50 animate-magic-pulse"></div>
              <div className="absolute size-24 rounded-full border border-agatha-rune/30 animate-spell-cast"></div>
              <div className="absolute size-52 rounded-full border border-agatha-purple/20 animate-witchcraft" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
            </div>

            {/* Witchcraft symbol with parallax effect */}
            <div className="relative z-10 text-4xl text-agatha-vibrant animate-magic-text transform transition-transform duration-500 group-hover:scale-110">
              <div className="font-witchcraft">✧ ⛧ ✧</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card meaning displayed below when flipped */}
      {isFlipped && (
        <div className="mt-4 text-center animate-fade-in">
          <h4 className="font-witchcraft text-lg text-agatha-vibrant">{isReversed ? "Reversed" : "Upright"}</h4>
          <p className="mt-1 text-sm text-agatha-mist font-mystical">
            {isReversed ? card.meaning.reversed : card.meaning.upright}
          </p>
        </div>
      )}
    </div>
  );
};

interface TarotCarouselProps {
  cards: TarotCard[];
}

export function TarotCarousel({ cards }: TarotCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? cards.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === cards.length ? 0 : next);
  };

  return (
    <div 
      className="relative mx-auto w-full max-w-5xl py-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced magic circle background with more layers and animations */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-agatha-purple/5 opacity-50"></div>
      <div className="absolute left-1/2 top-1/2 -z-10 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-agatha-purple/20 opacity-20 animate-witchcraft"></div>
      <div className="absolute left-1/2 top-1/2 -z-10 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-agatha-rune/10 opacity-10 animate-magic-pulse"></div>
      <div className="absolute left-1/2 top-1/2 -z-10 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-agatha-accent/15 opacity-15 animate-spell-cast"></div>

      {/* Previous button with enhanced hover effects */}
      <button
        onClick={handlePreviousClick}
        className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-agatha-accent/30 bg-agatha-deeper/80 p-2 text-agatha-mist transition-all hover:border-agatha-accent/60 hover:bg-agatha-deeper hover:text-white hover:shadow-agatha-glow md:left-12 magical-border"
        aria-label="Previous card"
      >
        <ChevronLeft className="size-6" />
      </button>

      {/* Cards stack with enhanced 3D effect and transitions */}
      <div className="relative h-[600px]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {cards.map((card, index) => {
            // Calculate position in the carousel
            const isCurrent = index === current;
            const isPrevious = index === (current - 1 + cards.length) % cards.length;
            const isNext = index === (current + 1) % cards.length;
            
            if (!isCurrent && !isPrevious && !isNext) return null;

            return (
              <div
                key={card.id}
                className={cn(
                  "absolute transition-all duration-700 ease-in-out will-change-transform",
                  isCurrent
                    ? "z-30 scale-100 opacity-100"
                    : isPrevious
                    ? "left-[-70%] z-20 scale-90 opacity-80 rotate-y-12"
                    : "left-[70%] z-20 scale-90 opacity-80 rotate-y-[-12deg]"
                )}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <TarotCardComponent card={card} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Next button with enhanced hover effects */}
      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-agatha-accent/30 bg-agatha-deeper/80 p-2 text-agatha-mist transition-all hover:border-agatha-accent/60 hover:bg-agatha-deeper hover:text-white hover:shadow-agatha-glow md:right-12 magical-border"
        aria-label="Next card"
      >
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
} 