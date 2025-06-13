# TarotSnap Technical Context

**Project:** TarotSnap - AI-powered Tarot Reading Application  
**Last Updated:** January 8, 2025  
**Current Status:** Production-ready with UI redesign opportunity identified  
**Live URL:** https://tarot-snap.vercel.app

---

## ✅ **CURRENT TECHNICAL STATUS - FULLY OPERATIONAL**

### **Core Systems Verified Working (January 8, 2025):**
- **OpenRouter AI Integration:** Meta-Llama 3.1-8B-Instruct delivering high-quality readings
- **Authentication:** Supabase with mystical theming and protected routes
- **Database:** Full user management and session tracking
- **Analytics:** Google Analytics 4 (ID: G-E0H4GY44BV) with comprehensive event tracking
- **Rate Limiting:** Freemium model (3 readings + 10 questions daily) working perfectly
- **Deployment:** Vercel with public access and all environment variables configured
- **Performance:** 5-10 second AI responses, fast page loads, zero errors in testing

### **SEO & Discovery (60% Complete):**
- ✅ Dynamic robots.txt and sitemap generation
- ✅ Structured data (JSON-LD) for spiritual services
- ✅ Enhanced metadata with template titles
- 🔄 OG images and per-route metadata (in progress)

---

## 🎨 **NEW TECHNICAL INITIATIVE: AI-ASSISTED UI REDESIGN**

### **Issue Analysis:**
**Current State:** Website functionality is excellent but visual design is "too pale and wordy"  
**Impact:** First-impression gap potentially limiting user acquisition and conversion  
**Opportunity:** Visual transformation without touching proven backend systems

### **Technical Approach: AI-First UI Generation**

#### **Recommended Stack:**
- **Primary Tool:** v0.dev for React/Tailwind component generation
- **Backup Options:** Hero UI, Lovable.dev, Replit AI
- **Animation Library:** Framer Motion for micro-interactions
- **Typography:** Cinzel font for mystical serif headlines
- **Color System:** Navy gradient + metallic gold accents

#### **Implementation Strategy:**
```bash
# Phase 1: Safe Branching & AI Generation
git checkout -b ui-revamp
# Preserve all working backend systems

# v0.dev prompt for component generation:
"Dark navy gradient tarot homepage with gold accents, 
three glowing tarot cards, mystical symbols, 
single prominent CTA button, minimal text"

# Integration approach:
- Replace only presentational components
- Preserve all API routes and business logic
- Maintain existing Tailwind config compatibility
```

#### **Component Replacement Strategy:**
```typescript
// Current structure preservation:
app/
├── api/reading/route.ts          // ✅ PRESERVE - Working AI integration
├── (auth)/                       // ✅ PRESERVE - Supabase auth working
├── reading/single/page.tsx       // 🎨 ENHANCE - Visual components only
├── page.tsx                      // 🎨 REDESIGN - Homepage UI transformation
├── components/
│   ├── reading/                  // 🎨 ENHANCE - Preserve logic, update UI
│   └── ui/                       // 🎨 REPLACE - New v0.dev components
└── lib/
    ├── openrouter.ts            // ✅ PRESERVE - AI integration working
    ├── analytics.ts             // ✅ PRESERVE - GA4 tracking operational
    └── supabase.ts              // ✅ PRESERVE - Auth working perfectly
```

### **Design System Implementation:**

#### **Color Tokens (Tailwind Config):**
```javascript
// Enhanced mystical color palette
colors: {
  navy: {
    900: '#1E1E3F',  // Deep navy base
    800: '#2E2E5F',  // Navy gradient end
    700: '#3E3E7F',  // Navy accent
  },
  gold: {
    400: '#FFD700',  // Metallic gold
    500: '#FFC107',  // Gold accent
    600: '#FF8F00',  // Gold highlight
  },
  // Preserve existing mystical theme compatibility
}
```

#### **Typography Scale:**
```css
/* Mystical serif for headlines */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap');

/* Enhanced typography hierarchy */
.headline-primary { font-size: 3rem; font-family: 'Cinzel', serif; }
.headline-secondary { font-size: 2rem; font-family: 'Cinzel', serif; }
.body-text { font-size: 1.125rem; line-height: 1.5; }
```

#### **Animation System:**
```typescript
// Framer Motion micro-interactions
const cardHoverAnimation = {
  scale: 1.05,
  transition: { duration: 0.15 }
}

const ctaShimmerEffect = {
  background: 'linear-gradient(90deg, gold, transparent, gold)',
  animation: 'shimmer 2s infinite'
}
```

### **Testing & Quality Assurance:**

#### **Smoke Test Suite:**
```typescript
// Critical path verification
describe('UI Redesign Smoke Tests', () => {
  test('Reading generation still works', () => {
    // 1. Navigate to homepage
    // 2. Input question
    // 3. Draw card
    // 4. Verify AI interpretation loads
    // 5. Test chat functionality
  })
  
  test('Authentication flow preserved', () => {
    // Verify Supabase auth still functional
  })
  
  test('Analytics events firing', () => {
    // Confirm GA4 tracking operational
  })
})
```

#### **Performance Benchmarks:**
- **Core Web Vitals:** Maintain or improve current scores
- **Bundle Size:** Monitor for increases from new components
- **Loading Speed:** Preserve 5-10 second AI response times
- **Accessibility:** Ensure 4.5:1 contrast ratios with new color system

### **A/B Testing Infrastructure:**

#### **Vercel Preview Deployment:**
```bash
# Deploy redesign to preview URL
vercel --prod --alias ui-revamp-preview.vercel.app

# Compare metrics:
# - Current: tarot-snap.vercel.app
# - Redesign: ui-revamp-preview.vercel.app
```

#### **Analytics Tracking:**
```typescript
// Enhanced conversion tracking for A/B test
gtag('event', 'ui_version_impression', {
  version: 'redesign_v1',
  page_path: window.location.pathname
})

// Key metrics to compare:
// - Bounce rate
// - Reading completion rate  
// - Session duration
// - Premium conversion signals
```

### **Risk Mitigation:**

#### **Backend Preservation Strategy:**
- **All API routes remain unchanged**
- **Supabase integration preserved**
- **OpenRouter AI logic untouched**
- **Analytics tracking maintained**
- **Environment variables unchanged**

#### **Rollback Plan:**
```bash
# Quick rollback if issues arise
git checkout main
vercel --prod

# Or selective rollback of specific components
git cherry-pick <working-component-commit>
```

### **Expected Technical Outcomes:**

#### **Performance Improvements:**
- **User Engagement:** 20%+ increase in reading completion
- **Conversion Metrics:** 15%+ improvement in key funnels
- **SEO Benefits:** Better social media preview cards
- **Mobile Experience:** Enhanced touch interactions and visual hierarchy

#### **Development Benefits:**
- **Component Quality:** Modern, accessible React components
- **Maintainability:** Cleaner UI/logic separation
- **Scalability:** Design system foundation for future features
- **Developer Experience:** AI-generated components reduce manual styling

### **Timeline & Resource Allocation:**

#### **Week 1: AI Generation & Integration**
- v0.dev component generation (1-2 days)
- Component integration and testing (2-3 days)
- Smoke test verification (1 day)

#### **Week 2: Design System Application**
- Typography and color system implementation
- Animation and micro-interaction addition
- Copy optimization and content reduction
- Cross-device testing and refinement

#### **Week 3: A/B Testing & Optimization**
- Preview deployment and metric comparison
- User feedback collection and iteration
- Performance optimization
- Final deployment preparation

**Technical Risk Assessment:** LOW - Strong backend foundation allows safe UI experimentation with quick rollback capability.

---

## 🔧 **DEVELOPMENT WORKFLOW ENHANCEMENT**

### **Enhanced Git Strategy:**
```bash
# Feature branch for UI redesign
git checkout -b ui-revamp

# Preserve working state
git tag stable-foundation

# AI-assisted development workflow
# 1. Generate components with v0.dev
# 2. Integrate preserving business logic
# 3. Test functionality preservation
# 4. Iterate based on metrics
```

### **AI Development Tools Integration:**
- **v0.dev:** Component generation with prompts
- **Cursor AI:** Code completion and refactoring assistance  
- **GitHub Copilot:** Pattern-based component enhancement
- **Vercel Analytics:** Real-time performance monitoring

This technical approach enables rapid visual transformation while preserving the excellent functionality that's already been built and tested. The AI-first methodology reduces development time while maintaining code quality and system reliability.

---

## 🏗️ **System Architecture**

### **Frontend Architecture**
```
Next.js 14 App Router Architecture
├── app/
│   ├── page.tsx                    # Landing page with question input
│   ├── reading/single/page.tsx     # Single card reading interface
│   ├── api/reading/route.ts        # AI reading API endpoint
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Shadcn/UI base components
│   │   ├── reading/                # Reading-specific components
│   │   └── TarotCard.tsx          # Interactive card display
│   ├── data/cards.ts              # Tarot card definitions
│   └── globals.css                # Tailwind + custom styles
├── lib/
│   ├── openrouter.ts              # OpenRouter AI client
│   ├── prompt-templates.ts        # AI prompts for readings
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets (card images)
```

### **AI Integration Architecture**
```
User Question → Next.js API Route → OpenRouter → Llama 3.1-8B → Structured Response
     ↓                ↓                    ↓            ↓              ↓
sessionStorage → /api/reading → lib/openrouter.ts → AI Model → TarotReading object
```

---

## 🛠️ **Technology Stack**

### **Core Framework**
- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + Shadcn/UI components
- **State Management:** React useState/useEffect (no external state manager)
- **Deployment:** Vercel (optimized for Next.js)

### **AI & Backend**
- **AI Service:** OpenRouter API
- **AI Model:** `meta-llama/llama-3.1-8b-instruct:free`
- **API Client:** OpenAI SDK (configured for OpenRouter)
- **Rate Limiting:** In-memory storage (3 readings/day per IP)
- **Environment:** `.env.local` for API key management

### **UI/UX Components**
- **Component Library:** Shadcn/UI (built on Radix UI)
- **Animations:** Framer Motion for smooth transitions
- **Icons:** Lucide React
- **Particles:** Custom mystical particle system
- **Theme:** Agatha Harkness-inspired dark mystical (navy/gold palette)

### **Development Tools**
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + TypeScript strict mode
- **Code Quality:** Prettier, pre-commit hooks
- **Memory Bank:** Cursor isolation rules for development context

---

## 🔌 **AI Integration Details**

### **OpenRouter Configuration**
```typescript
// lib/openrouter.ts
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'TarotSnap',
  },
});
```

### **AI Model Performance**
- **Model:** `meta-llama/llama-3.1-8b-instruct:free`
- **Cost:** ~$0.0008 per reading (99% cheaper than Claude/GPT-4)
- **Response Time:** ~10 seconds for complete reading
- **Quality:** High-quality mystical tarot interpretations
- **Rate Limit:** 3 readings/day per user (freemium model)

### **Response Structure**
```typescript
interface TarotReading {
  card: string;           // "The Fool", "Death", etc.
  meaning: string;        // Traditional card meaning
  interpretation: string; // Specific to user's question
  guidance: string;       // Actionable spiritual advice
  energy: string;         // Current mystical energy
  timeframe: string;      // Mystical timing predictions
  imagePath?: string;     // Card image path
}
```

---

## 📊 **Performance & Cost Metrics**

### **Cost Efficiency (Major Achievement)**
- **Current:** $0.0008 per reading (OpenRouter + Llama 3.1)
- **Previous Plan:** $0.08 per reading (Claude 3.5 Sonnet)
- **Savings:** 99% cost reduction
- **Daily Cost:** <$1 for 1000+ readings

### **Performance Benchmarks**
- **Response Time:** 8-12 seconds (AI generation)
- **Bundle Size:** <2MB total JavaScript
- **Lighthouse Score:** 90+ (Performance, Accessibility)
- **Mobile Performance:** Optimized for all screen sizes

### **Rate Limiting Implementation**
```typescript
// In-memory rate limiting (production ready for MVP)
const userReadings = new Map<string, number>();
const MAX_READINGS_PER_DAY = 3;

// IP-based tracking for anonymous users
const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
```

---

## 🔄 **System Patterns**

### **Data Flow Pattern**
1. **User Input:** Question entered on landing page
2. **Session Storage:** Question temporarily stored for navigation
3. **API Call:** Frontend calls `/api/reading` with question
4. **AI Processing:** OpenRouter processes via Llama 3.1-8B
5. **Response Parsing:** Structured TarotReading object returned
6. **UI Rendering:** Card reveal animation + interpretation display
7. **Chat Interface:** Follow-up questions via same API

### **Error Handling Pattern**
```typescript
// Graceful degradation with user-friendly messages
try {
  const reading = await generateReading(question);
  return NextResponse.json({ reading });
} catch (error) {
  if (error.status === 429) {
    return NextResponse.json(
      { error: 'Daily reading limit reached. Please try again tomorrow.' },
      { status: 429 }
    );
  }
  return NextResponse.json(
    { error: 'Unable to connect to reading service. Please try again.' },
    { status: 500 }
  );
}
```

### **Component Architecture Pattern**
- **Page Components:** Handle routing and data fetching
- **Feature Components:** Business logic (CardReveal, ReadingInterpretation)
- **UI Components:** Reusable Shadcn/UI components
- **Utility Components:** MysticalParticles, loading states

---

## 🚀 **Deployment & Environment**

### **Environment Variables**
```bash
# .env.local
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### **Build Configuration**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};
```

### **Vercel Deployment**
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Environment Variables:** OPENROUTER_API_KEY configured in dashboard
- **Automatic Deployments:** GitHub integration enabled

---

## 📈 **Scalability Considerations**

### **Current Limitations**
- **Rate Limiting:** In-memory storage (resets on server restart)
- **User Sessions:** No persistent user accounts
- **Reading History:** No storage of past readings

### **Planned Enhancements**
- **Database:** Supabase integration for user accounts and reading history
- **Authentication:** User login system for personalized experience
- **Persistent Rate Limiting:** Database-backed rate limiting
- **Reading Memory:** Per-user reading history for personalized feedback

### **Performance Optimizations**
- **Image Optimization:** Next.js Image component with lazy loading
- **Bundle Splitting:** Automatic code splitting per route
- **Caching:** Static card data and images cached
- **Memory Management:** Efficient particle system cleanup

---

## 🔐 **Security Implementation**

### **API Security**
- **Rate Limiting:** IP-based request limiting
- **Input Validation:** Question length and content validation
- **Error Handling:** No sensitive data leaked in error messages
- **Environment Security:** API keys stored in environment variables

### **Frontend Security**
- **XSS Prevention:** React's built-in XSS protection
- **Content Security:** No inline scripts or dangerous HTML
- **Session Security:** Minimal session storage (question only)

---

## 📱 **Mobile Responsiveness**

### **Responsive Design System**
- **Breakpoints:** Mobile-first Tailwind CSS approach
- **Touch Interactions:** Optimized for mobile touch events
- **Performance:** Efficient particle rendering on mobile
- **Typography:** Responsive text sizing for readability

---

## 🎯 **Business Logic Integration**

### **Freemium Model Implementation**
- **Free Tier:** 3 readings per day
- **Rate Limiting:** Graceful messaging when limit reached
- **Upgrade Path:** Ready for premium user implementation
- **Analytics Ready:** Structured for usage tracking

### **User Experience Flow**
```
Landing Page → Question Input → Card Draw → Card Reveal → 
Reading Interpretation → AI Chat → New Reading Option
```

---

## 🔮 **Future Technical Roadmap**

### **Phase 2: User Accounts (Planned)**
- **Authentication:** Supabase Auth integration
- **Database:** User profiles and reading history
- **Personalization:** Custom AI responses based on reading history
- **Premium Features:** Unlimited readings, advanced spreads

### **Phase 3: Advanced Features (Future)**
- **Multiple Spreads:** 3-card, Celtic Cross layouts
- **AI Personalities:** Different reader personalities
- **Social Features:** Reading sharing and community
- **Mobile App:** React Native implementation

---

**This technical context provides the complete foundation for understanding TarotSnap's architecture, implementation, and future roadmap.** 