# TarotSnap

A modern tarot card reading web application with an Agatha Harkness-inspired dark witchcraft theme. Built with Next.js and Tailwind CSS.

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TarotSnap.git
cd TarotSnap
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Interactive 3D Card Carousel**: Browse through tarot cards with fluid 3D animations and hover effects
- **Realistic Tarot Card Imagery**: Displays authentic Rider-Waite tarot deck cards with a magical purple overlay
- **Card Reading Functionality**: View upright and reversed meanings for each card
- **Witchcraft-Inspired Design**: Dark purple color scheme with magical runes, symbols, and animations
- **Responsive Layout**: Optimized for all device sizes

## Card Reading Types

- **Single Card**: Quick insights for simple questions
- **Three Card Spread**: Past, present, and future analysis
- **Celtic Cross**: Deep dive into complex situations

## Technologies

- **Next.js 14**: React framework for server-rendered applications
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling with custom witchcraft-themed extensions
- **CSS Animations**: Custom keyframes for magical effects
- **React Hooks**: For state management and animations

## Project Structure

- `/app`: Next.js application pages and components
- `/app/components`: React components including TarotCard and TarotCarousel
- `/app/data`: Tarot card data and utility functions
- `/public/images/tarot`: Tarot card images

## Development

### Testing

Run the test suite with:

```bash
npm test
```

Or in watch mode:

```bash
npm run test:watch
```

### Recent Improvements (Sprint 1)

- 🎨 Added skeleton loaders for card images during loading
- 🔧 Fixed image path handling for consistency 
- 🌟 Added static stars fallback during initial page load
- 🧪 Added basic smoke tests for the TarotCard component
- 🚫 Removed runtime error toast notifications
- 📱 Enhanced mobile experience with better fallbacks

## Custom Theme

The application features a custom Agatha Harkness-inspired theme with:

- Dark purples and magical accent colors
- Witchcraft symbols and runes
- Animated spell effects
- Magic circle backgrounds
- Glowing borders and text

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

If you encounter any issues:

1. Make sure you're using Node.js 18+
2. Clear your browser cache
3. Delete `.next` folder and run `npm run dev` again
4. Check the console for any errors
