# 🔮 TarotSnap Analytics Setup Guide

**Last Updated:** December 2024  
**Analytics Platform:** Google Analytics 4 (GA4)  
**Implementation:** Next.js with @next/third-parties/google  

---

## 📊 **Analytics Overview**

TarotSnap analytics system tracks user engagement, reading completions, business metrics, and technical performance to optimize the mystical user experience and drive premium conversions.

### **Key Metrics Tracked:**
- **User Engagement:** Reading completions, chat interactions, session duration
- **Business Intelligence:** Rate limit hits, premium interest signals, user retention
- **Technical Performance:** API response times, error rates, web vitals
- **User Journey:** Signup/login flows, returning user patterns

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Create Google Analytics 4 Property**

1. **Go to Google Analytics:** https://analytics.google.com/
2. **Create Account:** 
   - Account name: "TarotSnap"
   - Property name: "TarotSnap Web App"
   - Industry: "Arts & Entertainment"
   - Business size: "Small" (1-10 employees)
3. **Configure Data Stream:**
   - Platform: Web
   - Website URL: `https://tarotsnap.com` (or your domain)
   - Stream name: "TarotSnap Main Site"
4. **Copy Measurement ID:** Format `G-XXXXXXXXXX`

### **Step 2: Add Environment Variable**

Add to your `.env.local` file:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 1.**

### **Step 3: Verify Installation**

1. **Deploy your app** or run locally with the environment variable
2. **Visit your site** and interact with readings
3. **Check Google Analytics:** Go to Reports → Realtime
4. **Confirm events** are appearing within 1-2 minutes

---

## 📈 **Analytics Implementation Details**

### **Automatic Tracking (Built-in)**
✅ **Page Views** - All page navigation  
✅ **Web Vitals** - Performance metrics (LCP, FID, CLS)  
✅ **Session Data** - User sessions, bounce rate, demographics  
✅ **Conversions** - Goal completions and funnels  

### **Custom Events Tracked**

#### **Reading Engagement Events**
```typescript
// Reading lifecycle
reading_started: { question_length, user_type, session_id }
reading_completed: { card_drawn, session_duration, question_category }
chat_started: { card_name, user_type }
chat_message_sent: { message_count, session_duration, user_type }
```

#### **Business Intelligence Events**
```typescript
// Rate limiting and premium signals
rate_limit_hit: { limit_type, remaining_count, user_type }
premium_interest: { trigger, user_engagement_score }

// User authentication
signup_completed: { referrer }
login_completed: { return_user }
```

#### **Error and Performance Tracking**
```typescript
// Error monitoring
error_occurred: { error_type, error_message, user_impact }

// Custom page views
page_view: { page_title, page_location, user_type, session_id }
```

---

## 🎯 **Key Reports to Monitor**

### **Daily Monitoring Dashboard**
1. **Real-time Users** - Current active users
2. **Reading Completions** - Daily reading volume
3. **Error Events** - Technical issues requiring attention
4. **Rate Limit Events** - Premium conversion opportunities

### **Weekly Business Reports**
1. **User Retention** - 1-day, 7-day, 30-day retention rates
2. **Reading Engagement** - Average readings per user, chat usage
3. **Question Categories** - Popular reading topics (love, career, etc.)
4. **Premium Interest** - Users hitting rate limits, engagement scores

### **Monthly Growth Analysis**
1. **User Acquisition** - New vs returning users, traffic sources
2. **Feature Adoption** - Chat usage, repeat reading patterns
3. **Technical Performance** - Error rates, API response times
4. **Conversion Funnels** - Signup flow, premium upgrade paths

---

## 🔧 **Advanced Configuration**

### **Custom Dimensions Setup**

In Google Analytics Admin → Custom Definitions → Custom Dimensions:

1. **User Type** - Dimension: `user_type` (authenticated/anonymous)
2. **Reading Category** - Dimension: `question_category` (love, career, etc.)
3. **Session ID** - Dimension: `session_id` (user session tracking)
4. **Engagement Score** - Metric: `user_engagement_score` (premium prediction)

### **Goal and Conversion Setup**

1. **Reading Completion Goal:**
   - Event: `reading_completed`
   - Value: 1 reading
   - Funnel: Page view → Question → Reading → Chat

2. **Premium Interest Goal:**
   - Event: `premium_interest`
   - Value: Engagement score
   - Trigger: Rate limit or dashboard interest

3. **User Signup Goal:**
   - Event: `signup_completed`
   - Value: 1 new user
   - Attribution: Track referrer sources

---

## 📊 **Privacy and Compliance**

### **Privacy-First Analytics**
- **Anonymous User IDs** - Generated locally, no personal data
- **Session-Based Tracking** - Temporary session identifiers
- **No PII Collection** - Questions and readings not stored in GA4
- **GDPR Compliant** - Data retention settings configured

### **Data Retention Settings**
1. **Go to:** Admin → Data Settings → Data Retention
2. **Set:** User and event data retention to 14 months
3. **Enable:** Reset on new activity
4. **Configure:** IP anonymization enabled

---

## 🚀 **Launch Checklist**

### **Pre-Launch Verification**
- [ ] GA4 property created and configured
- [ ] `NEXT_PUBLIC_GA_ID` environment variable set
- [ ] Real-time analytics showing test events
- [ ] Custom dimensions and goals configured
- [ ] Data retention and privacy settings applied

### **Post-Launch Monitoring**
- [ ] Daily real-time user monitoring
- [ ] Weekly reading completion reports
- [ ] Monthly retention and growth analysis
- [ ] Quarterly premium conversion optimization

---

## 🎯 **Business Intelligence Insights**

### **Premium Conversion Signals**
Monitor users who:
- Hit rate limits multiple times
- Have high engagement scores (5+)
- Use chat feature extensively
- Return for readings within 24 hours

### **Product Optimization Opportunities**
Track:
- Question categories with highest chat engagement
- Reading completion vs abandonment rates
- Error events impacting user experience
- Session duration patterns for feature development

---

## 🔮 **Analytics-Driven Roadmap**

### **Immediate Actions (Week 1)**
1. Monitor real-time usage patterns
2. Identify peak usage times for infrastructure scaling
3. Track error rates and fix critical issues
4. Validate reading completion funnel

### **Short-term Optimization (Month 1)**
1. A/B test question prompts based on category data
2. Optimize chat experience based on engagement metrics
3. Implement premium upgrade prompts for high-engagement users
4. Enhance error handling for common failure points

### **Long-term Growth (Month 3+)**
1. Predictive premium conversion modeling
2. Personalized reading recommendations
3. Advanced user segmentation and targeting
4. Memory system implementation guided by user patterns

---

**🎉 Congratulations! Your TarotSnap analytics system is ready to provide mystical insights into user behavior and business growth!**

**Next Steps:** Deploy with the environment variable and start gathering user insights for data-driven product decisions. 