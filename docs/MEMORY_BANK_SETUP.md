# 🧠 TarotSnap Memory Bank System - Setup Guide

**Status:** ✅ **INITIALIZED & READY**  
**Phase:** 1 - Enhanced Reading Capture  
**Date:** December 2024  

---

## 🎯 **SYSTEM OVERVIEW**

The TarotSnap Memory Bank transforms the app from one-off readings into a **personal spiritual advisor with memory**. The system captures, analyzes, and learns from each reading session to provide increasingly personalized guidance.

### Core Capabilities
- **Enhanced Session Storage** - Rich context capture beyond basic card data
- **AI Theme Extraction** - Automatic identification of life patterns and concerns
- **User Journey Tracking** - Progressive understanding of spiritual growth
- **Personalized Context** - Memory-aware greetings and interpretations
- **Emotional State Analysis** - Understanding user's emotional patterns over time

---

## 🗄️ **DATABASE SCHEMA**

### New Tables Added

```sql
-- Enhanced reading sessions with rich context
CREATE TABLE reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  question_context TEXT NOT NULL,
  emotional_state JSONB DEFAULT '{}',
  cards_drawn JSONB NOT NULL DEFAULT '[]',
  spread_type VARCHAR(50) DEFAULT 'single',
  full_interpretation TEXT NOT NULL,
  key_themes TEXT[] DEFAULT ARRAY[]::TEXT[],
  user_feedback JSONB DEFAULT '{}',
  follow_up_needed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User life themes and patterns
CREATE TABLE user_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  theme_name VARCHAR(100) NOT NULL,
  frequency INTEGER DEFAULT 1,
  first_appearance TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_appearance TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  evolution_notes TEXT,
  resolution_status VARCHAR(20) DEFAULT 'ongoing' CHECK (resolution_status IN ('ongoing', 'resolved', 'improved')),
  significance_level INTEGER DEFAULT 1 CHECK (significance_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Personal card relationships and meanings
CREATE TABLE card_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  card_id VARCHAR(50) NOT NULL,
  personal_meaning TEXT,
  frequency_drawn INTEGER DEFAULT 1,
  significance_level INTEGER DEFAULT 1 CHECK (significance_level BETWEEN 1 AND 5),
  emotional_associations JSONB DEFAULT '[]',
  first_drawn TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_drawn TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, card_id)
);

-- Progress tracking for guidance follow-up
CREATE TABLE progress_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  guidance_given TEXT NOT NULL,
  check_in_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_progress JSONB DEFAULT '{}',
  outcome_notes TEXT,
  reading_session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User communication preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  communication_style JSONB DEFAULT '{}',
  preferred_spreads TEXT[] DEFAULT ARRAY[]::TEXT[],
  reading_frequency VARCHAR(20),
  reminder_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Performance Indexes
```sql
CREATE INDEX idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_timestamp ON reading_sessions(timestamp);
CREATE INDEX idx_user_themes_user_id ON user_themes(user_id);
CREATE INDEX idx_user_themes_theme_name ON user_themes(theme_name);
CREATE INDEX idx_card_relationships_user_id ON card_relationships(user_id);
CREATE INDEX idx_card_relationships_card_id ON card_relationships(card_id);
CREATE INDEX idx_progress_tracking_user_id ON progress_tracking(user_id);
```

---

## 🏗️ **ARCHITECTURE COMPONENTS**

### 1. Reading Storage Service (`lib/services/readingStorage.ts`)
**Purpose:** Handles all database operations for memory bank data

**Key Methods:**
- `storeReadingSession()` - Stores complete reading sessions with rich context
- `getUserReadingHistory()` - Retrieves user's reading history
- `getUserThemes()` - Gets dominant life themes for user
- `getUserCardRelationships()` - Tracks personal card significance
- `getReadingMemoryContext()` - Compiles full memory context for AI prompts

### 2. Theme Extraction Service (`lib/services/themeExtraction.ts`)
**Purpose:** AI-powered analysis of reading content for patterns and insights

**Key Methods:**
- `extractThemes()` - Analyzes reading content to identify life themes
- `analyzeProgressPatterns()` - Tracks user's spiritual journey evolution
- `generatePersonalizedContext()` - Creates memory-aware greetings and context

### 3. Post-Reading Reflection Component (`app/components/reading/PostReadingReflection.tsx`)
**Purpose:** Beautiful UI for capturing user emotional state and feedback

**Features:**
- 3-step guided reflection process
- Emotional state capture (mood, energy, openness, stress level)
- Reading accuracy and resonance ratings
- Optional notes and insights from user

### 4. Memory API Endpoints (`app/api/reading/memory/route.ts`)
**Purpose:** RESTful API for all memory bank operations

**Endpoints:**
- `POST /api/reading/memory` - Store sessions, feedback, preferences
- `GET /api/reading/memory?type=...` - Retrieve memory data

---

## 🔧 **IMPLEMENTATION STATUS**

### ✅ Phase 1: Enhanced Reading Capture (COMPLETE)
- [x] Extended database schema with memory tables
- [x] Reading storage service with theme tracking
- [x] AI-powered theme extraction using OpenRouter
- [x] Post-reading reflection UI component
- [x] Memory API endpoints for data operations
- [x] TypeScript interfaces for type safety

### 🚧 Phase 2: Memory Analysis Engine (READY TO START)
- [ ] Pattern detection algorithms
- [ ] User journey mapping
- [ ] Progress visualization components
- [ ] Relationship building metrics

### 📋 Phase 3: Personalized Reading Experience (PLANNED)
- [ ] Memory-aware reading generation
- [ ] Personalized greetings system
- [ ] Context-aware card interpretations
- [ ] Progress check-ins for returning users

### 🎯 Phase 4: Advanced Relationship Features (FUTURE)
- [ ] Growth celebration system
- [ ] Long-term guidance tracking
- [ ] Reading anniversary reminders
- [ ] Predictive coaching suggestions

---

## 🚀 **DEPLOYMENT INSTRUCTIONS**

### Database Setup
1. **Run the schema creation scripts** in your Supabase dashboard:
   ```sql
   -- Copy the schema from lib/supabase.ts DATABASE_SCHEMA
   -- Execute each table creation and RLS policy
   ```

2. **Verify tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('reading_sessions', 'user_themes', 'card_relationships', 'progress_tracking', 'user_preferences');
   ```

3. **Test with sample data:**
   ```sql
   -- Insert test user preferences
   INSERT INTO user_preferences (user_id, communication_style) 
   VALUES ('your-test-user-id', '{"tone": "mystical", "detail_level": "medium"}');
   ```

### Environment Variables
Ensure these are configured:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Integration Points
The memory bank integrates with existing TarotSnap components:

1. **Reading Generation** - Enhanced to store sessions automatically
2. **User Authentication** - Leverages existing Supabase auth
3. **Card Data** - Uses existing card database for theme extraction
4. **Analytics** - Ready for integration with existing analytics system

---

## 🔍 **TESTING GUIDE**

### Manual Testing Checklist
- [ ] **Create Reading Session** - Verify data is stored in `reading_sessions`
- [ ] **Theme Extraction** - Check themes appear in `user_themes`
- [ ] **Card Relationships** - Confirm tracking in `card_relationships`
- [ ] **User Feedback** - Test reflection component storage
- [ ] **Memory Context** - Verify API returns user history
- [ ] **Personalization** - Test personalized greetings generation

### API Testing Examples
```bash
# Store a reading session
curl -X POST /api/reading/memory \
  -H "Content-Type: application/json" \
  -d '{"action": "store_session", "data": {...}}'

# Get user memory context
curl -X GET "/api/reading/memory?type=context&limit=5"

# Store user feedback
curl -X POST /api/reading/memory \
  -H "Content-Type: application/json" \
  -d '{"action": "store_feedback", "data": {...}}'
```

---

## 📊 **MONITORING & METRICS**

### Key Metrics to Track
- **Memory Capture Rate** - % of readings that store enhanced context
- **Theme Extraction Success** - AI analysis success rate
- **User Feedback Completion** - % completing reflection process
- **Personalization Accuracy** - User satisfaction with memory-aware features
- **Data Growth** - Number of stored sessions, themes, relationships per user

### Performance Considerations
- **Database Queries** - Monitor performance with indexes
- **AI API Calls** - Track OpenRouter usage and costs
- **Storage Growth** - Plan for user data scaling
- **Privacy Compliance** - Ensure user data protection

---

## 🔐 **PRIVACY & SECURITY**

### Data Protection
- **Row-Level Security** - Users can only access their own data
- **Encrypted Storage** - Sensitive data encrypted in Supabase
- **Data Retention** - Clear policies for data lifecycle
- **User Control** - Ability to delete memory data

### GDPR Compliance
- **Right to Access** - Users can export their memory data
- **Right to Deletion** - Memory bank data can be purged
- **Data Minimization** - Only necessary data is collected
- **Consent** - Clear opt-in for memory features

---

## 🎉 **SUCCESS CRITERIA**

### Phase 1 Complete When:
- ✅ All database tables created and functional
- ✅ Reading sessions store with rich context
- ✅ AI theme extraction working
- ✅ User feedback capture implemented
- ✅ Memory API endpoints operational
- ✅ Integration with existing reading flow

### User Experience Goals:
- **Seamless Integration** - Memory features don't disrupt current flow
- **Optional Participation** - Users can skip reflection if desired
- **Immediate Value** - Users see benefit from first enhanced reading
- **Progressive Enhancement** - Experience improves with each reading

---

## 🚀 **NEXT STEPS**

1. **Database Migration** - Apply schema changes to production
2. **Feature Flag** - Gradual rollout of memory features
3. **User Testing** - Gather feedback on reflection component
4. **Analytics Integration** - Track memory feature usage
5. **Phase 2 Planning** - Begin memory analysis engine development

---

**The TarotSnap Memory Bank is now initialized and ready to transform one-time readings into meaningful spiritual journeys! 🌟** 