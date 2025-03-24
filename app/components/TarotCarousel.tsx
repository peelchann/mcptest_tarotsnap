"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, MoveUpRight, MoveDownLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "../lib/utils";
import type { TarotCard } from "../data/cards";

interface TarotCardProps {
  card: TarotCard;
}

const TarotCardComponent = ({ card }: TarotCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(card.isReversed || Math.random() > 0.7);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!cardRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      cardRef.current.style.setProperty("--x", `${x}px`);
      cardRef.current.style.setProperty("--y", `${y}px`);

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
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };
  
  // Card gradient styles with Agatha's purple color scheme (fallback if image fails)
  const cardGradientStyle = {
    backgroundImage: `linear-gradient(135deg, var(--agatha-dark) 0%, var(--agatha-purple) 50%, var(--agatha-deeper) 100%)`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 10s ease infinite',
  };

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <div
        ref={cardRef}
        className={cn(
          "relative flex h-[450px] w-[280px] cursor-pointer select-none flex-col rounded-xl border-2 border-agatha-purple/50 bg-agatha-dark/70 backdrop-blur-sm transition-all duration-700",
          "shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.8)]",
          "before:absolute before:inset-0 before:rounded-xl before:content-[''] before:transition-opacity before:duration-700",
          isFlipped ? "rotate-y-180" : ""
        )}
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `${isFlipped ? "rotateY(180deg)" : "rotateY(0)"} translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)`,
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Floating runes that appear when hovering */}
        <div className="absolute -inset-3 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute top-0 left-1/4 font-witchcraft text-xl text-agatha-rune/30 animate-magic-text">ᛦ</div>
          <div className="absolute bottom-0 right-1/4 font-witchcraft text-xl text-agatha-rune/30 animate-magic-text">ᛏ</div>
        </div>
      
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-xl p-4 [backface-visibility:hidden]",
            isReversed ? "rotate-180" : ""
          )}
        >
          <div className="flex w-full items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-agatha-purple/80 px-2 py-1 text-xs text-purple-100">
              <Sparkles className="size-3 text-purple-300" />
              {isReversed ? "Reversed" : "Upright"}
            </span>
            {isReversed ? (
              <MoveDownLeft className="size-4 text-purple-300" />
            ) : (
              <MoveUpRight className="size-4 text-purple-300" />
            )}
          </div>

          {/* Card Content */}
          <div className="relative flex-1 w-full mt-2 mb-1 rounded-lg overflow-hidden">
            {/* Card Image */}
            {card.imagePath && !imageError ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={card.imagePath}
                  alt={card.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center"
                  onError={() => setImageError(true)}
                  priority
                />
                {/* Purple overlay for Agatha style */}
                <div className="absolute inset-0 bg-agatha-purple/30 mix-blend-overlay"></div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-lg" style={cardGradientStyle}>
                <div className="font-witchcraft text-4xl text-agatha-vibrant animate-magic-text">
                  {card.number}
                </div>
              </div>
            )}
            
            {/* Magical Border */}
            <div className="absolute inset-0 pointer-events-none border-2 border-agatha-purple/30 rounded-lg"></div>
          </div>

          <div className="w-full text-center">
            <h3 className="font-witchcraft text-xl text-agatha-vibrant animate-magic-text">{card.name}</h3>
            <p className="mt-1 text-xs text-purple-300 font-mystical">
              {card.keywords.slice(0, 3).join(" • ")}
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-agatha-deeper to-agatha-purple/90 p-4 text-white [backface-visibility:hidden] rotate-y-180",
          )}
        >
          <div className="relative flex h-full w-full flex-col items-center justify-center">
            {/* Magic Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-44 rounded-full border-2 border-agatha-accent/40 animate-witchcraft"></div>
              <div className="absolute size-32 rounded-full border-2 border-agatha-rune/50 animate-magic-pulse"></div>
              <div className="absolute size-24 rounded-full border border-agatha-rune/30 animate-spell-cast"></div>
            </div>

            {/* Witchcraft symbol */}
            <div className="relative z-10 text-4xl text-agatha-vibrant animate-magic-text">
              <div className="font-witchcraft">✧ ⛧ ✧</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card meaning displayed below when flipped */}
      {isFlipped && (
        <div className="mt-4 text-center">
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

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? cards.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === cards.length ? 0 : next);
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl py-12">
      {/* Magic circle background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-agatha-rune/30 animate-spell-cast"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-agatha-rune/20 animate-witchcraft"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border border-agatha-rune/40 animate-magic-pulse"></div>
      </div>
      
      <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 duration-700">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              "[grid-area:stack] transition-all duration-700",
              index === current
                ? "z-30 scale-100"
                : index === (current + 1) % cards.length
                ? "z-20 translate-x-16 translate-y-8 scale-95 opacity-80"
                : index === (current + 2) % cards.length
                ? "z-10 translate-x-32 translate-y-16 scale-90 opacity-60"
                : "z-0 translate-x-48 translate-y-24 scale-85 opacity-40"
            )}
          >
            <TarotCardComponent card={card} />
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <button
          onClick={handlePreviousClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-agatha-purple bg-agatha-dark text-agatha-accent transition-all hover:bg-agatha-purple/20 hover:text-agatha-vibrant"
        >
          ←
        </button>
        <button
          onClick={handleNextClick}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-agatha-purple bg-agatha-dark text-agatha-accent transition-all hover:bg-agatha-purple/20 hover:text-agatha-vibrant"
        >
          →
        </button>
      </div>
    </div>
  );
} 