# SpreadCard Component

## Overview

The `SpreadCard.tsx` component is a reusable UI element designed to display an option for a Tarot spread (e.g., Single Card, Three Card Spread) on the homepage. It includes a title, a representative card image, a brief description, and a call-to-action button.

## Props

The component accepts the following props:

-   `title: string`: The title of the spread (e.g., "Single Card Draw").
-   `description: string`: A short description of the spread.
-   `buttonText: string`: The text for the call-to-action button (e.g., "Draw a Card").
-   `linkHref: string`: The URL path the button should link to (e.g., "/reading/single").
-   `imageSrc: string`: The path to the representative image for the card (e.g., "/images/tarot/the_fool.png").
-   `imageAlt: string`: The alt text for the image.

## Usage Example

```tsx
import SpreadCard from './components/SpreadCard';
import { cards } from './data/cards'; // Or your card data source

// ... inside your page component

const cardImage = cards.find(card => card.id === 'the-fool')?.imagePath || '/images/tarot/default.png';

return (
  <SpreadCard
    title="Single Card Draw"
    description="A quick insight for your day."
    buttonText="Draw Now"
    linkHref="/reading/single"
    imageSrc={cardImage}
    imageAlt="Single Tarot Card Spread"
  />
);
```

## Styling

-   The component uses Tailwind CSS for styling.
-   It features a gold accent theme consistent with the "Golden Tarot UI Revamp".
-   Includes hover effects for interactivity.
-   A custom scrollbar class (`custom-scrollbar`) is applied to the description, with suggested CSS provided in comments within the component file. This styling should ideally be moved to a global CSS file. 