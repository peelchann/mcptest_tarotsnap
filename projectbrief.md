# TarotSnap Project Brief

**Project Type:** Freemium SaaS Web Application  
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, OpenRouter API (Llama 3.1-8B-Instruct)  
**Target Market:** Tarot enthusiasts, spiritual seekers, entertainment users  
**Business Model:** Freemium (3 readings/day free, unlimited premium)  

## Core Vision
Modern tarot card reading web application with Agatha Harkness-inspired dark witchcraft theme, powered by OpenRouter AI with Llama 3.1-8B-Instruct for authentic mystical readings.

## Current State (December 2024)
- ✅ **Frontend Complete:** Beautiful mystical UI with navy/gold theme, responsive design, animations
- ✅ **Component Library:** React components with Shadcn/UI integration
- ✅ **AI Backend Complete:** OpenRouter integration with Llama 3.1-8B-Instruct, 99% cost savings
- ✅ **Rate Limiting:** 3 readings/day freemium model implemented
- ✅ **Documentation:** Comprehensive techcontext.md and system.pattern files
- 🔄 **Frontend-Backend Integration:** Currently connecting UI to working API (T002)
- 📋 **User Memory System:** Planning phase for authentication and reading history (T008-T010)
- ❌ **Analytics System:** Usage tracking and enhanced rate limiting (T003)

## Key Success Metrics
- **MVP Goal:** 100+ users try service, 25%+ return rate
- **Revenue Target:** Convert engaged users (5+ readings) to premium
- **Technical Goal:** Sub-3s response times for AI readings (currently ~10s)
- **Cost Efficiency:** $0.0008 per reading (99% cheaper than Claude)

## Strategic Decisions Made
- **AI Choice:** ✅ OpenRouter with Llama 3.1-8B-Instruct (superior cost efficiency, quality maintained)
- **Launch Strategy:** Functional over perfect - working AI readings > perfect animations
- **Monetization:** Experience-first freemium model with rate limiting
- **Cost Optimization:** Free tier model achieving massive cost savings

## Current Phase: Phase 1 - AI Integration (33% Complete)
**Major Achievement:** ✅ OpenRouter backend integration complete with production features
**Current Focus:** Frontend-backend connection to complete user experience
**Next Phase:** Launch optimization and user acquisition

## Technical Achievements
- **Production API:** `/api/reading` endpoints with health monitoring
- **Rate Limiting:** 3 readings/day per IP address implemented
- **Error Handling:** Comprehensive error handling with mystical user messaging
- **Cost Breakthrough:** 99% reduction in AI costs while maintaining quality
- **Scalability:** Architecture ready for thousands of concurrent users 