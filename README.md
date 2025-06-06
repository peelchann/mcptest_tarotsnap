# TarotSnap

A modern AI-powered tarot card reading web application with an Agatha Harkness-inspired dark witchcraft theme. Features OpenRouter AI integration for authentic mystical readings using Llama 3.1-8B-Instruct.

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

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your OPENROUTER_API_KEY to .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **AI-Powered Readings**: Authentic tarot interpretations using OpenRouter AI with Llama 3.1-8B-Instruct
- **Interactive Card Drawing**: Mystical card selection with smooth reveal animations
- **AI Oracle Chat**: Follow-up questions and deeper reading exploration with AI
- **Freemium Model**: 3 free readings per day with upgrade path to unlimited
- **Beautiful UI**: Agatha Harkness-inspired dark theme with gold accents and mystical particles
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Cost Efficient**: 99% cheaper than Claude/GPT-4 while maintaining high quality

## Reading Experience

- **Question Input**: Ask the universe for guidance on any topic
- **Card Drawing**: Mystical card selection from the tarot deck
- **Card Reveal**: Smooth animation reveals your chosen card
- **AI Interpretation**: Personalized reading specific to your question
- **Follow-up Chat**: Deeper exploration with the AI Oracle
- **Reading History**: Coming soon - personalized reading memory

## Technologies

- **Next.js 14**: React framework with App Router for modern web development
- **TypeScript**: For type-safe, scalable code
- **OpenRouter API**: AI service with multiple model options (currently using Llama 3.1-8B-Instruct)
- **Tailwind CSS**: Utility-first styling with custom mystical theme
- **Shadcn/UI**: Modern component library built on Radix UI
- **Framer Motion**: Smooth animations and transitions
- **Vercel**: Deployment platform optimized for Next.js

## Project Structure

- `/app`: Next.js 14 application with App Router
  - `/page.tsx`: Landing page with question input
  - `/reading/single/page.tsx`: Single card reading interface
  - `/api/reading/route.ts`: OpenRouter AI integration endpoint
  - `/components`: React components (UI, reading-specific)
  - `/data/cards.ts`: Tarot card definitions and metadata
- `/lib`: Utility functions and API clients
  - `/openrouter.ts`: OpenRouter AI client configuration
  - `/prompt-templates.ts`: AI prompts for authentic readings
- `/docs`: Comprehensive project documentation
- `/public`: Static assets including card images

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
