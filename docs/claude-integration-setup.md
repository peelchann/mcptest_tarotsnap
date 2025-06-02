# 🔮 TarotSnap Claude Integration - Setup Guide

**Status:** ✅ **READY FOR TESTING** - Backend implemented, frontend connected  
**Next Step:** Add your Claude API key and test the integration  

---

## 🎯 **What We've Built**

### ✅ **Core Components Implemented**
1. **Claude Client Library** (`lib/claude.ts`)
   - Anthropic SDK integration with Claude 3.5 Sonnet
   - Complete tarot card database (22 Major Arcana + key Minor Arcana)
   - Intelligent prompt engineering optimized for Claude's creative strengths
   - Error handling and validation

2. **API Route** (`app/api/reading/route.ts`)
   - RESTful endpoint for tarot readings
   - Rate limiting (3 readings per day per IP)
   - Comprehensive error handling
   - Health check endpoint

3. **Frontend Integration** (`app/reading/single/page.tsx`)
   - Connected to real Claude API (no more mock data!)
   - Beautiful error handling with rate limit messaging
   - Real-time AI chat for follow-up questions
   - Loading states and user feedback

4. **Testing Tools** (`lib/test-claude.ts`)
   - Validation testing
   - API integration verification
   - Easy troubleshooting

---

## 🚀 **Quick Start - Get Your API Key**

### Step 1: Get Claude API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up for an account (if needed)
3. Navigate to **API Keys** section
4. Click **Create Key** 
5. Copy your API key

### Step 2: Configure Environment
Create `.env.local` file in your project root:

```bash
# Add this to .env.local (create the file if it doesn't exist)
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### Step 3: Test Integration
```bash
# Start your development server
npm run dev

# Test the API health check
curl http://localhost:3000/api/reading

# Or visit the single reading page and try a real question!
```

---

## 💰 **Cost Structure & Budget Planning**

### **Claude 3.5 Sonnet Pricing**
- **Input tokens:** $3 per million tokens (~$0.003 per 1K tokens)
- **Output tokens:** $15 per million tokens (~$0.015 per 1K tokens)

### **Estimated Costs Per Reading**
- **Average reading:** 200-400 input tokens, 400-800 output tokens
- **Cost range:** $0.012 - $0.035 per reading
- **Monthly projections:**
  - 100 readings: $1.20 - $3.50
  - 500 readings: $6.00 - $17.50  
  - 1000 readings: $12.00 - $35.00
  - 3000 readings: $36.00 - $105.00

### **Budget Recommendations**
- **Soft Launch:** $20-50/month (covers 500-1500 readings)
- **Growth Phase:** $50-100/month (covers 1500-4000 readings)
- **Scale Phase:** Monitor and adjust based on usage

---

## 🔧 **Technical Architecture**

### **Prompt Engineering Strategy**
Our prompts are optimized for Claude's strengths:
- **Creative writing excellence** - mystical, flowing language
- **Context understanding** - weaves card meanings into coherent narratives  
- **Personality consistency** - wise, warm, spiritual tone
- **Practical guidance** - balances mysticism with actionable advice

### **Rate Limiting Implementation**
```typescript
// Current: Simple in-memory (development)
// Production: Redis or database-backed
const RATE_LIMIT = 3; // readings per IP per day
```

### **Error Handling Levels**
1. **API Key missing** → Service unavailable message
2. **Rate limit exceeded** → Clear messaging with upgrade suggestion  
3. **Claude API errors** → Graceful degradation with retry suggestion
4. **Network issues** → User-friendly connection error

### **Card Selection Logic**
- **Randomized draw** from 38-card database
- **70% upright** / 30% reversed probability (authentic tarot feel)
- **Context-aware interpretation** based on card position and question

---

## 🧪 **Testing Your Integration**

### **Manual Testing Steps**
1. **Health Check:** GET `http://localhost:3000/api/reading`
2. **Basic Reading:** POST with simple question via frontend
3. **Rate Limiting:** Try 4+ readings to test limit enforcement
4. **Error Handling:** Test with invalid questions

### **Test Questions That Work Great**
- "What should I focus on today?"
- "How can I improve my relationships?"
- "What energy do I need to embrace right now?"
- "What's blocking my progress in [specific area]?"

### **Expected Response Format**
```json
{
  "success": true,
  "reading": {
    "cards": [
      {
        "name": "The Fool",
        "suit": "Major Arcana", 
        "upright": true,
        "keywords": ["new beginnings", "spontaneity", "innocence"]
      }
    ],
    "interpretation": "Beautiful mystical interpretation from Claude...",
    "timestamp": "2024-12-31T...",
    "spread": "single",
    "question": "What should I focus on today?"
  }
}
```

---

## 🚨 **Troubleshooting Guide**

### **API Key Issues**
```bash
# Error: "ANTHROPIC_API_KEY not configured"
# Solution: Check your .env.local file exists and has the correct key

# Test if environment variable is loaded:
# Add console.log(process.env.ANTHROPIC_API_KEY) temporarily
```

### **Rate Limiting Issues**  
```bash
# Error: "Daily reading limit reached"
# Solution: Wait until tomorrow OR restart development server to reset in-memory store
# Production: Implement proper Redis-backed rate limiting
```

### **Claude API Errors**
```bash
# Error: "rate limit" or "quota exceeded"  
# Solution: Check your Anthropic Console usage dashboard
# May need to add billing information for higher limits

# Error: "authentication failed"
# Solution: Verify API key is correct and active
```

### **Network/Connection Issues**
```bash
# Error: "Unable to connect to reading service"
# Solution: Check internet connection, verify Next.js server is running
# Check browser network tab for specific error codes
```

---

## 🎭 **Why Claude 3.5 Sonnet?**

### **Advantages for Tarot Content**
- **Superior creative writing** - generates flowing, mystical prose
- **Excellent context retention** - maintains coherent narrative across chat
- **Safety & filtering** - appropriate handling of spiritual/divination content  
- **Tone consistency** - maintains wise, warm personality throughout
- **Longer context windows** - can handle detailed card spreads and chat history

### **Performance vs Alternatives**
- **vs GPT-3.5:** Much better creative writing, similar cost
- **vs GPT-4:** Comparable quality, often better tone, competitive pricing
- **vs Local models:** More reliable, consistent, and mystical in tone

---

## 🔮 **What's Next**

### **Immediate Testing (Today)**
1. Add your API key to `.env.local`
2. Test a few readings through the UI
3. Verify error handling works
4. Test the chat functionality

### **Week 1 Optimizations**
- Monitor real usage patterns and costs
- Adjust prompts based on user feedback  
- Implement analytics tracking
- Fine-tune rate limiting based on actual usage

### **Week 2+ Enhancements**
- User accounts for personalized rate limiting
- Payment integration for unlimited access
- Three-card spread implementation
- Advanced prompt variants

---

## 📊 **Success Metrics to Track**

### **Technical Metrics**
- API response time (target: <3 seconds)
- Error rate (target: <2%)
- User satisfaction with readings
- Rate limit conversion (free → paid)

### **Business Metrics**  
- Daily active users
- Reading completion rate
- Return user percentage
- Cost per reading actual vs projected

---

**🎉 Your TarotSnap Claude integration is ready! Just add your API key and start testing.** 

**Questions or issues?** Check the troubleshooting section above or review the technical implementation in the source files. 