# Golden Tarot UI Revamp Documentation

This document outlines the changes made during Sprint 2, focusing on the "Golden Tarot UI Revamp."

## 1. Palette and Theme
- **Objective**: Shift from a purple-heavy theme to a navy and gold palette.
- **Changes**:
    - Updated `tailwind.config.js` with new color tokens:
        - `agatha-navy`: `#1E1E3F`
        - `agatha-mid`: `#2E2E5F`
        - `gold-400`: `#C8AD7F`
        - `gold-500`: `#B8986A`
    - Changed the global background in `app/layout.tsx` to a gradient from `agatha-navy` to `agatha-mid`.
    - Replaced various purple accents and elements throughout `app/page.tsx` with `gold-400` and `gold-500`.

## 2. Hero Section
- **Objective**: Align the hero section with the new design template.
- **Changes**:
    - Updated site title in `app/layout.tsx` metadata to "TarotSnap".
    - Updated H1 title in `app/page.tsx` to "TarotSnap".
    - Centered title and subtitle, applied "Cinzel" font (implicitly via `font-witchcraft` which uses Cinzel) to H1 at `3rem` (`text-5xl` which is 3rem by default in the config, explicitly set `text-[3rem]`).
    - Subtitle font size set to `1.25rem` (explicitly `text-[1.25rem]`).
    - Wrapped hero text in a `max-w-2xl mx-auto text-center` block.
    - Gold accents applied to dividers.
    - (Note: SVG corner decorations for the hero section were mentioned but not implemented via direct file edit in this pass; assume they will be added if a `.hero-wrapper` class or specific container is identified/created).

## 3. 3-Card Spread Panel
- **Objective**: Implement a three-column grid for card spreads.
- **Changes**:
    - Removed the `TarotCarousel` component from `app/page.tsx`.
    - Implemented a `grid grid-cols-1 md:grid-cols-3 gap-6` layout for "Single Card," "Three Cards," and "Witch's Cross" spreads.
    - Each card container styled with `border border-gold-400 rounded-lg`.
    - Removed skew/transform effects from these card containers.
    - Added hover/focus effects: `hover:scale-105` and `hover:ring-4 hover:ring-opacity-40 ring-gold-400`.
    - Placeholder divs used for actual card content/images.

## 4. CTA Button Restyle
- **Objective**: Restyle Call-to-Action buttons to match the gold theme.
- **Changes**:
    - Buttons ("Draw a Card," "Begin Reading," "Deep Dive," "About the Craft," "Begin Divination") updated to `bg-gold-400 text-[#1E1E3F]` with `hover:bg-gold-500`.
    - Applied `px-6 py-3` (py-3 used) and `rounded-xl font-semibold`.

## 5. Side-Bar Icon Toning
- **Objective**: Make sidebar runes less prominent.
- **Changes**:
    - Updated `app/components/ScrollingSymbols.tsx`.
    - Symbols are now styled with `opacity-20` and `text-gold-300`.
    - Removed dynamic HSL color generation for symbols to ensure consistent gold color.

## Verification Notes
- **Palette**: CSS diff will show `bg-gradient-to-b from-agatha-navy to-agatha-mid` and widespread use of `gold-400`, `gold-500`. Lighthouse contrast for text on new backgrounds should be checked.
- **Hero**: Figma mock comparison for typography/layout. Text centering on various devices.
- **3-Card Spread**: DOM inspection for three `SpreadCard` (or current placeholder `div`) components. DevTools to confirm no transforms on cards.
- **Borders & Corners**: CSS for `border-gold-400`. (Hero corner SVGs need specific implementation if a suitable wrapper exists).
- **CTA Buttons**: Visual check for gold background and hover states.
- **Sidebar Icons**: Visual check for faint, non-interactive gold runes.
- **Card Hover**: Interaction check for scale and glow effects.
- **Responsive**: Manual check at 320px, 768px, 1440px for layout integrity. 