# TarotSnap

**🚀 LIVE & FULLY OPERATIONAL:** https://tarot-snap.vercel.app

A modern AI-powered tarot card reading web application with an Agatha Harkness-inspired dark witchcraft theme. Features OpenRouter AI integration for authentic mystical readings using Llama 3.1-8B-Instruct.

**✨ Experience the future of tarot:** An AI spiritual advisor that remembers your journey and provides increasingly personalized guidance over time.

## 🎯 **Current Status - January 2025**

**✅ FULLY FUNCTIONAL & PUBLICLY ACCESSIBLE**
- Complete end-to-end tarot reading experience
- AI-powered interpretations with contextual chat
- Rate limiting (3 readings + 10 follow-ups daily)
- Comprehensive analytics tracking
- Authentication system with mystical theming
- 100% responsive design (desktop, tablet, mobile)

**🧪 THOROUGHLY TESTED:** Complete user journey verified with browser automation testing

## Quick Start

### 🌟 **Try It Live**
Visit **https://tarot-snap.vercel.app** - no setup required!

### 🛠️ **Local Development**

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

## ✨ **Core Features**

### **🔮 AI-Powered Readings**
- Authentic tarot interpretations using OpenRouter AI with Llama 3.1-8B-Instruct
- 99% cost savings compared to premium AI models while maintaining quality
- Multiple interpretation sections: Guidance, Energy, Timeframe

### **🎭 Interactive Experience**
- Mystical card selection with smooth reveal animations
- Step-by-step reading flow: Question → Draw → Card Reveal → Interpretation
- Beautiful Agatha Harkness-inspired dark theme with gold accents

### **🤖 AI Oracle Chat**
- Context-aware follow-up conversations
- AI remembers your original question and card drawn
- Natural, mystical language that feels authentic
- Deeper exploration of your reading's meaning

### **💎 Freemium Business Model**
- 3 free readings per day + 10 follow-up questions
- Rate limiting with upgrade path to unlimited access
- Analytics tracking for conversion optimization

### **🎨 Beautiful Design**
- Responsive design optimized for all devices
- Mystical particles and scrolling symbol animations
- High contrast readability with professional UI/UX
- Custom mystical color palette (navy/gold theme)

## 🎪 **Reading Experience**

1. **Question Input**: Ask the universe for guidance on any topic
2. **Card Drawing**: Mystical card selection from the complete tarot deck
3. **Card Reveal**: Smooth animation reveals your chosen card with imagery
4. **AI Interpretation**: Personalized reading with multiple insight sections
5. **Follow-up Chat**: Natural conversation with the AI Oracle for deeper understanding
6. **Reading Memory**: Coming soon - AI remembers your spiritual journey

## 🛠️ **Technologies**

### **Frontend**
- **Next.js 14**: React framework with App Router for modern web development
- **TypeScript**: Type-safe, scalable development
- **Tailwind CSS**: Utility-first styling with custom mystical theme
- **Shadcn/UI**: Modern component library built on Radix UI
- **Framer Motion**: Smooth animations and transitions

### **Backend & AI**
- **OpenRouter API**: AI service with multiple model options (Llama 3.1-8B-Instruct)
- **Supabase**: Authentication and database for user management
- **Next.js API Routes**: Server-side logic and AI integration

### **Deployment & Analytics**
- **Vercel**: Production deployment platform optimized for Next.js
- **Google Analytics 4**: Comprehensive user behavior tracking
- **Custom Analytics**: Reading completion, chat engagement, conversion events

## 📁 **Project Structure**

```
TarotSnap/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                  # Landing page with question input
│   ├── reading/single/page.tsx   # Single card reading interface
│   ├── api/reading/route.ts      # OpenRouter AI integration endpoint
│   ├── components/               # React components
│   │   ├── reading/              # Reading-specific components
│   │   └── ui/                   # Reusable UI components
│   ├── data/cards.ts            # Tarot card definitions and metadata
│   ├── layout.tsx               # Root layout with SEO and analytics
│   ├── robots.ts                # Dynamic robots.txt generation
│   └── sitemap.ts               # Dynamic sitemap generation
├── lib/                         # Utility functions and services
│   ├── openrouter.ts           # OpenRouter AI client configuration
│   ├── prompt-templates.ts     # AI prompts for authentic readings
│   ├── analytics.ts            # Google Analytics integration
│   └── services/               # Business logic services
├── docs/                       # Comprehensive project documentation
├── public/                     # Static assets including card images
└── middleware.ts               # Authentication and route protection
```

## 🧪 **Development**

### **Testing**
Run the test suite:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

The API route tests in `__tests__/api` mock OpenRouter and Supabase so they can
run offline. Simply run `npm test` after installing dependencies to execute
them.

### **Quality Assurance**
- ✅ Complete browser automation testing with Playwright
- ✅ End-to-end user journey verification
- ✅ Cross-device responsiveness testing
- ✅ AI response quality validation
- ✅ Rate limiting and analytics verification
- ✅ Automated image validation (`npm run check:images`)

## 📈 **Analytics & Business Intelligence**

### **Tracking Events**
- Reading completions and user engagement
- Chat interactions and session duration
- Rate limit encounters (premium conversion signals)
- User journey funnel analysis
- Technical performance metrics

### **Business Metrics**
- Daily/Monthly Active Users
- Reading completion rates
- Premium conversion indicators
- User retention patterns

## 🎨 **Custom Mystical Theme**

The application features a carefully crafted **Agatha Harkness-inspired** aesthetic:

- **Color Palette**: Deep navy blues with mystical gold accents
- **Typography**: Clean, readable fonts with magical flourishes
- **Animations**: Subtle mystical particles and symbol scrolling
- **Visual Elements**: Witchcraft symbols, runes, and tarot imagery
- **Interaction Design**: Smooth transitions that enhance the mystical experience

## 🚀 **Recent Achievements (January 2025)**

- ✅ **Public Launch**: Fully accessible at https://tarot-snap.vercel.app
- ✅ **Complete Testing**: End-to-end user journey verified
- ✅ **Analytics Integration**: Google Analytics 4 operational
- ✅ **SEO Foundation**: Dynamic robots.txt, sitemap, structured data
- ✅ **Performance Optimization**: Fast loading, smooth AI responses
- ✅ **Rate Limiting**: Freemium model working for conversion

## 🔮 **Future Vision - The Remembering Reader**

TarotSnap is evolving beyond one-off readings to become a **personal spiritual advisor with memory**:

### **Planned Features (2025)**
- **Reading History**: Personal spiritual journey tracking
- **AI Memory System**: Contextual readings that build upon your past
- **Relationship Building**: AI that grows with your spiritual evolution
- **Advanced Spreads**: Celtic Cross, relationship readings, and more
- **Premium Insights**: Enhanced AI personalities and deeper analysis

## 📄 **License**

This project is licensed under the [MIT License](LICENSE).

## 🆘 **Support & Troubleshooting**

### **Common Issues**
1. **Slow loading**: Clear browser cache and reload
2. **AI responses**: Ensure stable internet connection
3. **Rate limiting**: Free tier includes 3 readings + 10 questions daily
4. **Mobile issues**: Refresh page, check latest browser version

### **Technical Requirements**
- Node.js 18+ for local development
- Modern browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection for AI features

### **Getting Help**
- Check existing documentation in `/docs`
- Review troubleshooting guides
- Report issues via GitHub Issues

---

**🌟 Experience the magic of AI-powered tarot at https://tarot-snap.vercel.app**

*Transform your spiritual journey with an AI that remembers.*
