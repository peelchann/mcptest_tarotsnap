# TarotSnap Development TODO - Launch & Monetization Roadmap

**Last Updated:** December 2024  
**Ultimate Goal:** Launch → Get Payments → User Feedback → Iterate  
**Repository:** [peelchann/mcptest_tarotsnap](https://github.com/peelchann/mcptest_tarotsnap)  
**Target:** 14-day MVP launch with paid users

---

## 🚀 **PHASE 1: CORE INFRASTRUCTURE (Days 1-3) - BLOCKING**

### 🔥 **P1: Backend & AI Integration** 
**Status:** ❌ **MISSING - BLOCKING ALL ELSE**
- **Dependency:** Nothing can work without AI backend
- **Tasks:**
  - Set up Vercel API routes (`/api/reading`) for AI requests
  - Integrate OpenAI GPT-4 API for tarot readings
  - Create AI prompt engineering for tarot interpretation
  - Test AI response quality and tune prompts
  - Handle API errors, rate limits, timeouts
  - Environment variables setup (OpenAI API key)
- **Files to Create:** 
  - `app/api/reading/route.ts`
  - `lib/openai.ts`
  - `lib/tarot-prompts.ts`
- **Success Criteria:** User can get AI tarot reading via API call

### 🔥 **P2: Payment Integration (Stripe)**
**Status:** ❌ **MISSING - REQUIRED FOR MONETIZATION**
- **Dependency:** Need this for revenue goal
- **Tasks:**
  - Set up Stripe account and webhook endpoints
  - Create pricing tiers (Free: 1 reading, Paid: $5 for 10 readings)
  - Implement Stripe Checkout flow
  - Create payment success/failure pages
  - Set up subscription management (optional)
  - Add payment tracking to analytics
- **Files to Create:**
  - `app/api/stripe/route.ts`
  - `app/api/webhooks/stripe/route.ts`
  - `app/checkout/page.tsx`
  - `lib/stripe.ts`
- **Success Criteria:** Users can pay for readings and receive access

### 🔥 **P3: User Authentication & Data Storage**
**Status:** ❌ **MISSING - REQUIRED FOR PAYMENT TRACKING**
- **Dependency:** Need user accounts to track payments
- **Tasks:**
  - Set up Supabase for auth + database
  - Create user registration/login flow
  - Design database schema (users, readings, payments)
  - Implement reading history storage
  - Email verification system
  - Password reset functionality
- **Files to Create:**
  - `lib/supabase.ts`
  - `app/auth/login/page.tsx`
  - `app/auth/register/page.tsx`
  - `app/dashboard/page.tsx`
- **Success Criteria:** Users can create accounts, login, see reading history

---

## 🎯 **PHASE 2: MVP COMPLETION (Days 4-6) - HIGH PRIORITY**

### 🔥 **P4: Analytics & Tracking Setup**
**Status:** ❌ **MISSING - REQUIRED FOR LAUNCH DATA**
- **Dependency:** Need tracking before marketing spend
- **Tasks:**
  - Google Analytics 4 implementation
  - Facebook Pixel for ad conversion tracking
  - Stripe webhook event tracking
  - User behavior analytics (reading completion rate)
  - Error logging with Sentry
  - Conversion funnel tracking
- **Files to Create:**
  - `lib/analytics.ts`
  - `app/layout.tsx` (analytics integration)
- **Success Criteria:** All user actions and conversions tracked

### 🔥 **P5: Email Marketing System**
**Status:** ❌ **MISSING - REQUIRED FOR USER RETENTION**
- **Dependency:** Need for user onboarding and retention
- **Tasks:**
  - Set up Mailchimp/ConvertKit integration
  - Create welcome email sequence
  - Build email capture forms
  - Automated payment confirmation emails
  - Weekly tarot insights newsletter
  - Re-engagement email campaigns
- **Files to Create:**
  - `lib/email.ts`
  - `app/api/subscribe/route.ts`
- **Success Criteria:** Automated email sequences working

### 🟡 **P6: Landing Page Optimization**
**Status:** ⚠️ **NEEDS CONVERSION FOCUS**
- **Current Issue:** Not optimized for payments
- **Tasks:**
  - Add clear pricing section
  - Testimonials/social proof area
  - FAQ section addressing payment concerns
  - Mobile payment flow optimization
  - Trust badges (SSL, Stripe, etc.)
  - CTA button improvements for conversion
- **Files to Update:**
  - `app/page.tsx` (add pricing section)
  - Create `app/components/Pricing.tsx`
  - Create `app/components/Testimonials.tsx`
- **Success Criteria:** Higher visitor-to-payment conversion rate

---

## 📢 **PHASE 3: MARKETING & LAUNCH (Days 7-10) - CRITICAL**

### 🔥 **P7: SEO & Content Setup**
**Status:** ❌ **MISSING - REQUIRED FOR ORGANIC TRAFFIC**
- **Tasks:**
  - Meta tags optimization for tarot keywords
  - Google Search Console setup
  - XML sitemap generation
  - Blog setup with SEO-optimized posts
  - Schema markup for rich snippets
  - Page speed optimization
- **Files to Create:**
  - `app/blog/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `app/sitemap.xml`
- **Success Criteria:** Site indexed by Google, ranking for tarot keywords

### 🔥 **P8: Social Media & Community Setup**
**Status:** ❌ **MISSING - REQUIRED FOR LAUNCH**
- **Tasks:**
  - Create Twitter, Instagram, Facebook accounts
  - Design social media templates
  - Set up posting schedule automation
  - Join tarot/spirituality communities
  - Create shareable content (card meanings, etc.)
  - Influencer outreach list
- **Success Criteria:** Social presence ready for launch announcement

### 🔥 **P9: Paid Advertising Campaign**
**Status:** ❌ **MISSING - REQUIRED FOR USER ACQUISITION**
- **Tasks:**
  - Facebook/Instagram ad account setup
  - Create ad creatives and copy variations
  - Set up conversion tracking
  - Launch test campaigns ($50/day budget)
  - Google Ads setup for "tarot reading" keywords
  - Retargeting pixel implementation
- **Success Criteria:** Ads driving paid conversions at reasonable CAC

---

## 🚀 **PHASE 4: LAUNCH EXECUTION (Days 11-14) - CRITICAL**

### 🔥 **P10: Soft Launch & Testing**
**Status:** ❌ **PLANNED**
- **Tasks:**
  - Beta launch to friends/colleagues
  - Load testing with multiple concurrent users
  - Payment flow end-to-end testing
  - Mobile responsiveness verification
  - Bug fixes from beta feedback
  - Customer support system setup
- **Success Criteria:** 10+ beta users completing paid readings

### 🔥 **P11: Public Launch Campaign**
**Status:** ❌ **PLANNED**
- **Tasks:**
  - Product Hunt launch preparation
  - Reddit/community announcements
  - Press release to tech/spirituality blogs
  - Influencer collaboration posts
  - Launch day social media blast
  - Email announcement to subscribers
- **Success Criteria:** 100+ users, 10+ paying customers in first week

### 🔥 **P12: Feedback Collection & Iteration**
**Status:** ❌ **PLANNED**
- **Tasks:**
  - User feedback forms and surveys
  - Review/testimonial collection system
  - Feature request tracking
  - Payment conversion analysis
  - Customer support ticket system
  - Weekly iteration planning
- **Success Criteria:** Feedback loop established for continuous improvement

---

## ⚡ **PHASE 5: POST-LAUNCH OPTIMIZATION (Ongoing)**

### 🟡 **P13: UI/UX Polish (Previously P1-P3)**
**Status:** ⚠️ **MOVED TO POST-LAUNCH**
- **Note:** Moving visual polish after core functionality
- **Tasks:**
  - Main page title color enhancement ✅ **COMPLETED**
  - Responsive design audit and fixes
  - Card animation improvements
  - Typography and spacing optimization
  - Mobile-first design improvements
  - Accessibility compliance (WCAG 2.1)
- **Priority:** After paying users acquired

### 🟡 **P14: Advanced Features**
**Status:** ❌ **POST-MVP**
- **Tasks:**
  - Multiple tarot spreads (3-card, Celtic Cross)
  - Tarot deck selection options
  - Reading sharing functionality
  - Advanced AI personality options
  - Reading history export
  - Premium subscription tiers
- **Priority:** Based on user feedback and revenue

### 🟡 **P15: Technical Debt & Performance**
**Status:** ❌ **POST-MVP**
- **Tasks:**
  - Code splitting and lazy loading
  - Image optimization
  - Database query optimization
  - Caching strategy implementation
  - Error boundary improvements
  - Test coverage improvement
- **Priority:** After core business metrics achieved

---

## 🎯 **SUCCESS METRICS & TIMELINE**

### **Week 1 (Days 1-7): Infrastructure**
- ✅ Backend AI integration working
- ✅ Payment system functional
- ✅ User auth and data storage live
- ✅ Analytics tracking everything

### **Week 2 (Days 8-14): Launch**
- ✅ Marketing channels active
- ✅ Soft launch completed (10+ beta users)
- ✅ Public launch executed
- 🎯 **TARGET:** 100+ users, 10+ paying customers, $50+ revenue

### **Post-Launch: Growth**
- Monthly: 500+ users, 50+ paying customers
- Revenue target: $500+ MRR within 30 days
- Feedback loop: Weekly feature iterations based on user data

---

## 📋 **IMMEDIATE NEXT ACTIONS (This Week)**

1. **TODAY:** Set up OpenAI API integration
2. **Day 2:** Implement Stripe payment system
3. **Day 3:** User authentication with Supabase
4. **Day 4:** Analytics and email marketing setup
5. **Day 5:** Landing page conversion optimization

**🚨 CRITICAL:** No UI polish until backend and payments work!

---

## 💰 **REVENUE MODEL**

- **Free Tier:** 1 tarot reading per day
- **Paid Tier:** $5 for 10 readings (48-hour access)
- **Premium:** $15/month unlimited readings + exclusive features
- **Target:** 2% conversion rate (2 paying customers per 100 visitors)

---

*Priority: Launch-first approach focused on revenue generation and user feedback*  
*Next Review: After Phase 1 completion*