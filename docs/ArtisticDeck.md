# ArtisticDeck Component

## Purpose
Creates a mystical three-card tarot spread in an isosceles triangle formation on the TarotSnap homepage. Provides responsive layout with proper animations and accessibility.

## Key Features
- **Triangle Layout**: Left (-6°), center (0°, elevated), right (+6°) positioning
- **Responsive Design**: Desktop triangle, mobile flat layout  
- **Z-Index Stacking**: Center card elevated (z:2) above sides (z:1)
- **Individual Transforms**: Each card gets its own transform (eliminates wrapper issues)
- **Bound Captions**: Semantic `<figcaption>` prevents layout leaks
- **Performance**: `whileInView` animations, `viewport={{ once: true }}`

## Public API

```tsx
interface ArtisticDeckProps {
  cards: TarotCardType[];     // Array of tarot cards (uses first 3)
  className?: string;         // Optional additional classes
}
```

## Layout System

### Desktop (≥768px)
```
    [Center]     ← -6% Y, 0° rotation, z:2
   /        \
[Left]    [Right]  ← +10-12% Y, ±6° rotation, z:1
```

### Mobile (<768px)
Flat horizontal layout with no transforms

## Usage Example
```tsx
<ArtisticDeck 
  cards={randomCards}
  className="w-full h-full"
/>
```

## Technical Notes
- Uses `clamp(160px,18vw,220px)` for responsive card sizing
- `isolate` class creates stacking context boundary
- Percentage-based transforms work across all viewport sizes
- Semantic HTML with `<figcaption>` for accessibility
- Framer Motion optimizations prevent layout thrashing

## Dependencies
- `framer-motion` for animations
- `TarotCard` component for individual card rendering
- `@/lib/utils` for className utilities 