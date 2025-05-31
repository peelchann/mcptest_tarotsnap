# TarotSnap TODO - Freemium MVP Launch Strategy

**Last Updated:** December 2024  
**Strategy:** Live Functional Website → Real Usage Data → Convert Engaged Users to Paid  
**Timeline:** 4-week MVP launch with incremental revenue milestones  
**Repository:** [peelchann/mcptest_tarotsnap](https://github.com/peelchann/mcptest_tarotsnap)

---

## 🚀 **CURRENT STATE ASSESSMENT**

### ✅ **Completed Foundation**
- Beautiful mystical UI with navy/gold theme
- Responsive design working on desktop and mobile
- Navigation flow (Home → Single Reading) functional
- Animations and mystical particles system
- Title color optimization with proper contrast
- Component library with Shadcn/UI integration

### 🔄 **Current Gap: Backend & AI Integration**
- Frontend exists but no AI backend to generate real readings
- Single reading page needs connection to actual AI service
- No user data storage or usage tracking

---

## 🎯 **PHASE 1: FUNCTIONAL MVP (Week 1-2) - IMMEDIATE PRIORITY**

### 🔥 **P1: Claude 3.5 Sonnet Integration - Day 1-2** 
**Status:** ❌ **BLOCKING - START TODAY**
- **Decision:** Claude 3.5 Sonnet (superior creative writing, mystical tone)
- **Tasks:**
  - Install Anthropic SDK: `npm install @anthropic-ai/sdk`
  - Create environment variable setup for Claude API key
  - Create API route: `app/api/reading/route.ts`
  - Design tarot reading prompts for authentic mystical experience
  - Test prompt engineering with sample questions (Claude excels at creative content)
- **Files to Create:**
  - `app/api/reading/route.ts`
  - `lib/claude.ts` (Claude client configuration)
  - `lib/tarot-prompts.ts` (prompt templates optimized for Claude)
  - `.env.local` (ANTHROPIC_API_KEY storage)
- **Success Criteria:** Claude returns flowing, mystical tarot readings with authentic tone

### 🔥 **P2: Frontend-Backend Connection - Day 3-4**
**Status:** ❌ **HIGH PRIORITY**
- **Current Issue:** Single reading page has dummy data, needs real AI integration
- **Tasks:**
  - Connect existing single reading form to new API endpoint
  - Replace mock card data with real AI-generated readings
  - Add loading states during AI generation (existing UI can be enhanced)
  - Implement error handling for API failures
  - Add response formatting for structured tarot readings
- **Files to Update:**
  - `app/reading/single/page.tsx` (connect to API)
  - `app/components/` (reading display components)
- **Success Criteria:** Users can ask questions and receive AI tarot readings

### 🔥 **P3: Usage Analytics & Rate Limiting - Day 5-7**
**Status:** ❌ **REQUIRED FOR LAUNCH**
- **Tasks:**
  - Google Analytics 4 implementation with custom events
  - Track: readings completed, session duration, question types
  - Rate limiting: 3 readings per IP per day (freemium model)
  - Basic error logging and monitoring
  - Mobile performance optimization for AI calls
- **Files to Create:**
  - `lib/analytics.ts`
  - `lib/rate-limiter.ts`
  - Update `app/layout.tsx` (analytics integration)
- **Success Criteria:** Can track real usage patterns and prevent abuse

---

## 📊 **PHASE 2: LAUNCH & OPTIMIZATION (Week 2)**

### 🔥 **P4: Soft Launch & Testing - Day 8-10**
**Status:** ❌ **PLANNED**
- **Tasks:**
  - End-to-end user journey testing with real AI
  - Mobile responsiveness verification for reading flow
  - Share with friends/colleagues for initial feedback
  - Monitor AI response quality and user satisfaction
  - Quick iterations based on early user feedback
- **Success Criteria:** 10+ beta users complete satisfying readings

### 🔥 **P5: Public Launch Campaign - Day 11-14**
**Status:** ❌ **PLANNED**
- **Tasks:**
  - Social media launch announcement (Twitter, Instagram)
  - Reddit/community sharing (r/tarot, r/sideproject)
  - SEO optimization for tarot-related keywords
  - Product Hunt submission preparation
  - Monitor and respond to user feedback
- **Success Criteria:** 100+ users try the service, 25%+ return rate

---

## 💰 **PHASE 3: MONETIZATION PREPARATION (Week 3)**

### 🟡 **P6: User Account System**
**Status:** ❌ **MEDIUM PRIORITY**
- **Purpose:** Track usage for freemium conversion
- **Tasks:**
  - Simple email-based signup (no complex auth initially)
  - Reading history storage for registered users
  - Usage tracking per user for conversion targeting
  - Basic user dashboard showing reading history
- **Files to Create:**
  - `app/auth/` pages
  - `lib/supabase.ts` (simple database setup)
- **Success Criteria:** Power users can save and review their readings

### 🟡 **P7: Payment System Foundation**
**Status:** ❌ **FUTURE ENHANCEMENT**
- **Tasks:**
  - Stripe integration for subscription payments
  - Premium tier definition (unlimited readings + enhanced AI)
  - Conversion funnel for engaged users (5+ readings)
  - Payment success/failure handling
- **Success Criteria:** Can convert engaged users to paying subscribers

---

## ⚡ **PHASE 4: POST-LAUNCH POLISH (Week 4+)**

### 🟡 **P8: Enhanced UI Features** 
**Status:** ⚠️ **MOVED TO POST-LAUNCH**
- **Previous P1-P3 items moved here:** Advanced animations, component polish
- **Rationale:** Focus on functional value delivery first
- **Tasks:**
  - Three-card spread implementation
  - Advanced card animations
  - Sound effects toggle
  - Accessibility improvements (WCAG 2.1)
- **Priority:** After proven user engagement and revenue

### 🟡 **P9: Advanced AI Features**
**Status:** ❌ **FUTURE ENHANCEMENT**
- **Tasks:**
  - Multiple AI personalities (wise, mystical, practical)
  - Different tarot spreads (Celtic Cross, etc.)
  - Personalized reading styles based on user history
  - AI prompt optimization based on user feedback
- **Priority:** Based on user feedback and revenue milestones

---

## 📋 **IMMEDIATE NEXT ACTIONS (This Week)**

### **TODAY (Day 1):**
1. Set up Anthropic account and get Claude API key
2. Install Anthropic SDK: `npm install @anthropic-ai/sdk`
3. Create basic API route structure for Claude
4. Test Claude with tarot-style prompts (focus on mystical tone)

### **Tomorrow (Day 2):**
1. Refine prompt engineering for Claude's strengths (creative, flowing language)
2. Create structured response format optimized for Claude
3. Test API with various question types (Claude handles nuance well)
4. Document prompt templates that leverage Claude's creative abilities

### **Day 3-4:**
1. Connect frontend single reading page to API
2. Replace mock data with real AI responses
3. Add proper loading and error states
4. Test complete user journey

### **Day 5-7:**
1. Add analytics tracking
2. Implement rate limiting (3 reads/day)
3. Mobile optimization
4. Prepare for soft launch

---

## 💡 **KEY STRATEGIC DECISIONS MADE**

### **✅ API Choice: Claude 3.5 Sonnet** 
- **Superior creative writing** for mystical/spiritual content
- **Excellent tone consistency** - more natural, flowing language
- **Better safety filtering** - good for tarot/spiritual content
- **Competitive pricing** - similar to GPT-4 (~$12-35 per 1000 readings)
- **Longer context windows** - can handle detailed tarot spreads
- **Easy upgrade path** to Claude 3 Opus for premium users

### **✅ Freemium Model: Experience First**
- Free: 3 readings per day (enough to experience value)
- Premium: Unlimited + enhanced AI personalities
- Conversion target: Users with 5+ readings in first week

### **✅ Launch Strategy: Functional Over Perfect**
- Working AI readings > perfect animations
- Real user feedback > theoretical optimization
- Revenue validation > feature completeness

---

## 🎯 **SUCCESS METRICS**

### **Week 1 Target:**
- ✅ AI integration working reliably
- ✅ 10+ beta users complete real readings
- ✅ <2% API error rate
- ✅ Mobile experience optimized

### **Week 2 Target:**
- ✅ 100+ unique users try the service
- ✅ 300+ total readings generated
- ✅ 25%+ return rate (users come back)
- ✅ 4+ minute average session duration

### **Week 3-4 Target:**
- ✅ 20+ power users (10+ readings each)
- ✅ Clear user behavior patterns identified
- ✅ Payment system ready for engaged users
- ✅ Path to $50+ MRR established

---

## 🔧 **TECHNICAL IMPLEMENTATION NOTES**

### **API Structure:**
```typescript
POST /api/reading
Body: { question: string, spread?: "single" }
Response: { cards: Card[], interpretation: string, timestamp: Date }
// Claude excels at structured JSON responses with creative content
```

### **Claude-Specific Implementation:**
```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateTarotReading(question: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0.8, // Higher creativity for mystical content
    messages: [{
      role: "user", 
      content: tarotPrompt + question
    }]
  });
  return response.content;
}
```

### **Cost Optimization:**
```typescript
// Claude pricing: ~$3 per 1000 input tokens, ~$15 per 1000 output tokens
// Estimated cost per reading: $0.012-0.035 (competitive with GPT-4)
// Budget: $50-100/month covers 1500-4000 readings
```

### **Rate Limiting Strategy:**
```typescript
// IP-based for anonymous users
// User-based for registered users
// 3 readings per day for free tier
```

### **Analytics Events:**
```typescript
// Track: reading_completed, question_submitted, user_returned
// Metrics: session_duration, bounce_rate, conversion_funnel
```

---

## 🚨 **RISK MITIGATION**

### **Technical Risks:**
- **OpenAI costs:** Daily usage caps, prompt optimization
- **API reliability:** Error handling, fallback responses
- **Performance:** Caching, optimization

### **Business Risks:**
- **Low engagement:** Rapid iteration based on feedback
- **Competition:** Focus on AI quality and user experience
- **Monetization:** Test willingness to pay early with engaged users

---

**Philosophy:** Build working product → Gather real usage data → Convert engaged users  
**Next Review:** After Phase 1 completion (AI integration working)  
**Success Definition:** Users repeatedly choose to return for more readings**