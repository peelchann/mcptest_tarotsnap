# 14-Day Launch Plan for TarotSnap (AI-Powered Tarot MVP)

**Goal:** Launch a public-facing MVP of TarotSnap (an AI tarot reading web app) in 2 weeks and acquire the first 10–100 users, while working full-time.

**Strategy:** This plan breaks down tasks day-by-day, leveraging no-code/low-code tools and AI services for maximum efficiency.

---

## **Day 1: Kickoff & Planning**

### Define MVP Scope
- Clarify what's essential for launch
- Core feature: AI-driven tarot reading
- Defer nice-to-haves (detailed profiles, complex spreads) until traction is proven
- Keep tech minimal – use existing front-end UI and plan lightweight backend

### Choose Key Tools & Platforms
- **AI Engine:** OpenAI GPT-4 API for robust text generation
- **Hosting:** Vercel for front-end + serverless functions
- **Backend/Database:** Supabase (Postgres + auth) or Firebase
- **Decision:** Stick to one that's quick to implement

### Plan User Registration Approach
- **Option 1:** Skip full accounts, just collect emails for onboarding
- **Option 2:** Use plug-and-play auth (Supabase/Firebase) vs coding from scratch
- **Recommendation:** Start with email capture only for speed

### Allocate Budget & Resources
- **Total Budget:** HKD $10k (~$1280)
- **Breakdown:**
  - ~$200 for API costs/subscriptions
  - ~$200 for marketing (ads)
  - Reserve funds for outsourcing tasks
- **Outsourcing Platforms:** Upwork, Fiverr for AI integration, design, quick fixes

### Draft Timeline
- Map out next 14 days with specific daily goals
- Block evening/early morning time for TarotSnap (accounting for full-time job)

---

## **Day 2: Backend & AI Integration**

### Set Up Minimal Backend
- Create Vercel API route (Node.js/Python) for AI requests
- Function receives user question/cards → calls AI API → returns reading
- Vercel hosts serverless function automatically on deploy

### Integrate AI Model
- **Primary Choice:** OpenAI GPT-4 API
- **System Prompt Example:** "You are a wise tarot reader. Interpret the cards drawn and the user's question with insight."
- **Alternatives:** Anthropic Claude, Cohere APIs
- **Pricing:** Usage-based with free tier for small projects

### Test Prompt Outputs
- Feed example questions and card draws via test script
- Ensure style/tone fits tarot reading ("mystical yet helpful")
- Tweak prompts for right vibe - crucial for UX

### Parallel Option - No-Code Integration
- **Alternative:** Zapier/Make automation (form → OpenAI → result)
- **Note:** Might be clunky for real-time interaction

### Freelancer Coordination
- If posting Upwork job, review proposals today
- Target completion by Day 4-5
- **Clear Requirements:** "Call GPT-4 API with prompt when user clicks 'Get Reading'"

---

## **Day 3: Basic User Account/Data (Keep Simple)**

### Implement Email Capture
- Add signup form for email collection
- **Tool:** Mailchimp embedded form for mailing list
- Stores addresses + triggers welcome emails
- Avoids building backend for user data

### No-Code User Registration (Optional)
- **If login needed:** Supabase (auth + database) or Firebase
- **Decision Factor:** Only if necessary for MVP - otherwise skip for complexity reduction

### Data Storage for Readings (Optional)
- **Simple Options:**
  - Google Sheet via Zapier (new reading → append to sheet)
  - Supabase/Firestore database
- **Note:** Not critical for MVP

### Security & Privacy
- Draft quick Privacy Policy
- Clarify: questions sent to AI API, no sensitive personal data
- Build trust through transparency

### Prepare Welcome Content
- Set up Mailchimp automation for new subscribers
- **Welcome Email Content:**
  - Greet user warmly
  - Explain how to get best results ("ask open-ended questions")
  - Invite feedback replies
  - Keep short and friendly

---

## **Day 4: Build the Landing Page**

### Create Polished Landing Site
- **Recommended Tools:**
  - **Typedream:** AI-enabled website builder, generate from prompt
  - **Alternatives:** Webflow (powerful but learning curve), Carrd (simple single-page)
  - **Prompt Example:** "TarotSnap – AI Tarot Readings, get insights from tarot cards via AI"

### Key Landing Page Sections
- **Hero:** "Your Personal Tarot Reading, Powered by AI"
- **Description:** "Get instant interpretations of tarot cards with smart AI fortune teller"
- **CTA:** "Try TarotSnap Now"
- **How it Works:** 3 steps
  1. Think of a question
  2. Our AI draws & interprets cards  
  3. You get personalized reading
- **Visuals:** Icons/illustrations for each step

### Leverage AI for Copy & Graphics
- **Copy:** ChatGPT for taglines, feature lists
- **Graphics:** Canva templates + AI features
  - Create logo, hero image, social media graphics
  - AI design suggestions for professional look

### Optimize for Conversion
- Clean, mobile-friendly design
- Prominent email signup placement
- **Basic SEO:**
  - Meta title: "TarotSnap – AI Tarot Reading in Seconds"
  - Meta description with keywords: "Free AI tarot reading, virtual tarot cards, instant psychic insights"

### Outsource Design if Needed
- **Options:** Typedream Expert, Fiverr freelancer
- **Budget:** $50-$150 for landing page design/copy
- **Provide:** Core text and images, let them polish layout

---

## **Day 5: SEO, Copywriting & Prep for Marketing**

### Refine Copy and Messaging
- **AI Writing Tools:**
  - **Jasper AI:** Marketing copy, engaging tone
  - **ChatGPT:** Content generation/editing
  - **Copy.ai:** Short-form copy with SEO keywords
- **Prompts:** "Rewrite this to be more inspiring", "3 headline variations with SEO keywords"

### Set Up Basic SEO/Analytics
- Verify site with Google Search Console
- Add Google Analytics 4 or Plausible
- Track visitors and user behavior for measuring traction

### Content for Credibility
- **Blog Ideas:**
  - "The Making of an AI Tarot Reader"
  - "How TarotSnap Works"
  - FAQ section addressing skepticism
- **Benefits:** Improves SEO and user trust
- **AI Assistance:** Draft with ChatGPT, then edit

### Plan Marketing Content
- **Social Media:** 2-3 posts for launch announcements
- **Ad Copy:** Facebook/Twitter ad variations
- **AI Generation:** 
  - ChatGPT for Twitter thread introducing TarotSnap
  - Facebook ad text highlighting novelty (AI + tarot)

### Test Email Automation
- Subscribe with test email to verify welcome flow
- Refine copy to sound warm and personal, not spammy

---

## **Day 6: Final QA & Launch Readiness**

### Full Product Testing
- **End-to-End User Journey:**
  - Visit landing page (desktop + mobile)
  - Check value prop clarity and loading
  - Complete tarot reading flow
  - Test question input → AI response
  - Verify response quality and speed
  - Test email signup/login if implemented

### Fix Critical Bugs
- **Priority:** Issues blocking core usage
- **Examples:** Unresponsive buttons, mobile UI breaks, AI timeouts
- **Philosophy:** Function over perfection for MVP

### Load Test & Monitor
- Simulate multiple API calls in succession
- Verify API keys and quotas (OpenAI billing setup)
- Check rate limits for ~100 user goal
- Monitor account caps and daily limits

### Prepare for Launch Promo
- Finalize social media content
- Set up social accounts (Twitter, Instagram, Facebook Page)
- Ensure consistent branding across platforms
- Grab handles even if not actively posting

### Soft Launch Checklist
- ✅ Everything working?
- ✅ Domain pointing correctly?
- ✅ Analytics capturing visits?
- ✅ Email signups working?
- ✅ AI responses good quality?
- **If all yes → Ready for public launch!** 🎉

---

## **Day 7: Soft Launch & Early Feedback**

### Go Live Quietly
- Push site live on custom domain
- **Soft Launch Strategy:** Share with small, friendly audience first
- Send to friends/colleagues interested in tarot or tech
- Ask for honest feedback and tolerance of hiccups

### Community Outreach
- **Relevant Communities:**
  - Slack channels for side-project builders
  - Discord for AI projects
- **Message:** "Built an AI Tarot Reading app as fun project – would love feedback!"

### Gather Feedback
- **Methods:**
  - Informal: email/message replies
  - Formal: Google Form with questions
- **Key Questions:**
  - "Did your reading feel meaningful?"
  - "Any part of UI confuse you?"

### Monitor Everything
- Watch error logs and analytics
- Track user drop-off points
- Catch API errors early
- Monitor weird inputs that might crash AI calls

### Tweak Based on Feedback
- **Examples:**
  - "Reading too generic" → adjust AI prompt for specificity
  - "Trouble understanding how to start" → clearer CTA or instructions
- Make quick adjustments while feedback is fresh

### Encourage Sharing
- **Approach:** "Glad you enjoyed it! Feel free to share with friends who like tarot 😊"
- Word of mouth is powerful and free

---

## **Day 8: Official Launch & Social Media Burst**

### Public Announcement
- **Platform Strategy:**
  - **Personal Social Media:** Facebook, Twitter/X, LinkedIn
  - **LinkedIn:** "Building in public" or tech/innovation angle
  - **Twitter/Instagram:** Fun and mystical aspect
- **Post Template:** "Excited to launch TarotSnap – AI tarot card reading web app 🤖🔮! Built in spare time. Free to try, ask a question and let AI interpret cards. Check it out!"

### Use AI for Social Posts
- **Canva:** Eye-catching images/videos for announcements
- **Publer:** Caption suggestions with emojis and hashtags
- **ChatGPT Prompt:** "Give me 3 tweet ideas announcing AI tarot app, playful tone with tarot emojis"

### Multi-Channel Outreach
- **Reddit:**
  - r/tarot, r/Divination: "Made AI Tarot Reading website – looking for beta users!"
  - r/sideproject, r/startups: Builder perspective
  - **Tone:** Community-friendly, emphasize welcoming feedback
- **Facebook Groups:** Tarot, spirituality, new age topics
- **Instagram:** Hashtags (#tarot, #tarotreading, #AI), stories, reels
- **Product Hunt/Hacker News:** Tech-centric audience (optional given timeline)

### Engage with Responders
- **Handle Skepticism:** "How can AI do tarot?"
- **Response Strategy:** Explain AI trained on mythology/text, entertainment focus
- **Emphasize:** Fun experiment bridging old traditions with new tech
- **Tone:** Personal and positive

### Schedule Follow-up Posts
- **Tools:** Buffer, Hootsuite, Publer scheduler
- **Content Ideas:**
  - Tomorrow: Tips for asking good questions
  - Next day: Share cool anonymous reading
  - **AI Generation:** Predis.ai for automated post+image suggestions
- **Goal:** 3-5 posts for next week to maintain activity

---

## **Day 9: Initiate Targeted Ads (Low Budget Experiments)**

### Launch Facebook/Instagram Ad Campaign
- **Budget:** HKD $500 (~$65 USD) to start
- **Campaign Type:** Meta Advantage+ campaign
- **Targeting:** Tarot cards, Astrology, Meditation, Spirituality
- **Placements:** Advantage+ (AI optimizes across FB/Instagram)
- **Daily Spend:** $10-$20/day for few days
- **Benefits:** AI-driven targeting shows 22% better returns vs manual

### Consider Google Ads (Budget Permitting)
- **Campaign Type:** Performance Max (AI distributes across Search, YouTube, Gmail)
- **Goal:** "Start reading" button clicks (Google Analytics events)
- **Keywords:** "Free tarot reading online"
- **Benefits:** 18% more conversions on average via machine learning
- **Note:** More complex than Meta; skip if overwhelming

### Ad Creative with AI
- **Tools:**
  - **AdCreative.ai:** AI ad generator
  - **Canva:** Ad templates for multiple versions
- **Copy Variations:** ChatGPT for 3 angles:
  1. Quick and fun focus
  2. AI technology focus  
  3. Spiritual guidance focus

### Set Up Tracking
- **Facebook Pixel:** Track "Lead" or "SignUp" events
- **Google Analytics:** Conversion tracking for button clicks
- **Purpose:** Let AI algorithms optimize based on actual conversions

### Monitor Ad Performance
- **Timing:** Check Day 10 morning for red flags
- **Red Flags:** Disapproved ads, zero impressions
- **Strategy:** Let algorithms run 2+ days before deep analysis

---

## **Day 10: Nurture Users & Gather Data**

### Welcome New Users
- **Email Sequence:**
  - Day 0: Welcome email
  - Day 2: "Example questions to ask TarotSnap"
- **Tools:** Mailchimp, ConvertKit, Sendinblue
- **Follow-up:** "How was your reading? Hit reply to let me know!"

### Engage Users for Feedback
- **Feedback Tools:** Google Form, Typeform
- **Incentive:** Chance for detailed personalized reading
- **Response Strategy:** Reply to each comment personally

### Community Building
- **Options:** Discord server, Facebook Group for TarotSnap users
- **Purpose:** Discussion space for readings, tarot topics
- **Benefits:** Future growth tool, organic community growth

### Analyze Analytics
- **Key Metrics:**
  - Unique visitors
  - Conversion rate (visitors → readings)
  - Traffic sources (social, ads, etc.)
- **Ad Analysis:** Which visuals/text get best CTR
- **Optimization:** Adjust based on data patterns

### Tweak Marketing Based on Data
- **Examples:**
  - Many clicks, few readings → improve landing page flow
  - High-performing tweet → double down on messaging
  - Underperforming ad → adjust targeting/creative

### Customer Support
- **Channels:** Project email, Twitter DM
- **Approach:** Support = listening at early stage
- **Example Response:** Apologize for issues, offer retry, learn from feedback

---

## **Day 11: Iterate Product and Marketing**

### AI Model Adjustments
- **Evaluation:** Review real usage examples for quality
- **Common Issues:** Too generic, not mentioning specific cards
- **Improvements:**
  - Add context: "Always reference tarot cards by name"
  - Adjust length via API parameters
  - Use few-shot learning with examples
- **Alternative Models:** GPT-3.5 turbo (faster), Claude (creative writing)

### Feature Tweaks
- **Quick Wins from Feedback:**
  - "Draw another reading" button
  - Clarify random spread selection
  - Shuffle option
- **Principle:** Keep changes small and deployable in one day

### UX Enhancements
- **Visual Flair:**
  - Animation when revealing reading
  - Tarot card images (free sets or AI-generated)
  - Background music toggle (free sound loops)
- **Goal:** One small wow-factor to get people talking

### Re-Engage Existing Users
- **Follow-up Email:** "Thanks for trying TarotSnap! We've made improvements based on feedback..."
- **Updates:** Faster responses, clearer meanings
- **CTA:** "Come back and test new question!"
- **Tone:** Personal and short

### Scale Marketing If Possible
- **Additional Channels:**
  - Indie Hackers post
  - AI project newsletters
  - App directories
- **Condition:** Only if capacity allows, otherwise focus on core users

---

## **Day 12: Double Down & Outsource Where Needed**

### Assess Progress
- **Goal Check:** How close to 10-100 user target?
- **Strategy Adjustment:**
  - <10 users: Final push needed (more ads, personal invites)
  - 50+ users: On track (focus on experience, convert to evangelists)

### Final Marketing Push
- **Best Channel Amplification:**
  - High-engagement social → create more content (infographics, fun facts)
  - Effective ads → extend budget slightly for final days
  - Community success → follow-up posts with updates

### Leverage Freelancers Strategically
- **Content Creation:**
  - SEO blog post (Fiverr/Upwork writer)
  - Social media posts (AI-assisted)
  - Example: "10 Most Fascinating Tarot Cards" with TarotSnap plug
- **Graphic Design:**
  - Polished banner or promo video (<$100)
  - Better visuals for ads/social
- **SEO Audit:**
  - Quick expert review of meta tags, schema
  - Basic optimization for MVP
- **Tech Support:**
  - Bug fixes or small features
  - API integration specialists on Upwork
  - Free up time for growth focus

### Community/Influencer Outreach
- **Target:** Tarot YouTubers, spirituality bloggers
- **Pitch:** "Innovative blend of tarot and AI"
- **Offer:** Free access, feedback welcome
- **Potential:** One share could bring dozens of users

---

## **Day 13: Maintain Momentum & Plan Next Steps**

### User Traction Check
- **Assessment:** Closer to 10 or 100 users?
- **Final Push Ideas:**
  - Contest: "Share TarotSnap reading on Twitter, tag us for $50 gift card"
  - Requires existing active users for viral effect

### Ensure Retention
- **Post-Launch Plan:**
  - Content schedule sustainable during work
  - One blog post/newsletter per week (AI-assisted)
  - "Tarot Card of the Week" social series
- **Goal:** Keep users engaged beyond initial burst

### Collect Testimonials
- **Target:** Users with great experiences
- **Format:** Short quotes for landing page/tweets
- **Example:** "Amazed how accurate it felt – like talking to real tarot reader! – Jane D."
- **Impact:** Social proof significantly boosts trust

### Light SEO Work
- **Tasks:**
  - Submit sitemap to search engines
  - List on LinkedIn profile
  - Submit to AI tool directories
  - Product listing sites
- **Benefit:** Long-term SEO improvement

### Budget Review
- **Analysis:** HKD spending breakdown
- **Last-Minute Opportunities:**
  - Newsletter sponsorship ($50-$100)
  - Tool upgrades for easier workflow
  - Reserve funds for post-launch period

---

## **Day 14: Launch Wrap-Up & Future Planning**

### Evaluate Launch Metrics
- **Key Numbers:**
  - Total unique users/readings
  - Goal achievement (10-100 users)
  - Channel performance (social vs ads vs referrals)
  - Cost analysis ("Facebook: 30 users at $3 each")

### Learn from Data
- **User Behavior Analysis:**
  - Retention: How many did multiple readings?
  - Drop-off patterns: Where do users leave?
  - Quality assessment: Reading satisfaction vs novelty
- **Strategic Insights:** What engaged repeat users?

### Top Priorities Moving Forward
- **Example List:**
  1. Improve AI reading accuracy/insight
  2. Implement user accounts (if requested)
  3. Ramp up marketing in tarot communities
- **Purpose:** Clear game plan beyond launch to maintain momentum

### Thank Early Users
- **Public Acknowledgment:** Social media thank-you post
- **Personal Touch:** Email to initial users
- **Message:** "Two weeks ago TarotSnap was idea – now X readings done! Thanks to beta testers!"

### Keep Communication Lines Open
- **Channels:**
  - Newsletter subscriptions
  - Discord/community groups
  - Social media follows
- **Goal:** Reach users for future updates/features

### Celebrate and Reflect
- **Achievement:** Functional AI product in 14 days while working full-time! 🎉
- **Learning:** Which tactics saved most time vs time sinks
- **Application:** Insights for next project or TarotSnap phase

---

## **Top Priorities for MVP Traction (Summary)**

### 1. Leverage No-Code and AI Tools
- **Backend:** Serverless BaaS instead of custom building
- **Design:** AI site builders (Typedream)
- **Content:** AI generators (ChatGPT, Jasper)
- **Marketing:** AI social media tools (Publer, Predis.ai)
- **Benefit:** Solo founder moves quickly

### 2. Outsource to Fill Gaps
- **Platforms:** Upwork, Fiverr for specialists
- **Tasks:** AI integration, SEO content, landing page polish
- **Principle:** Your time is limited/valuable – focus on unique value (tarot experience)

### 3. Get Product Out ASAP
- **Philosophy:** Real user feedback > weeks of speculation
- **Approach:** Launch with rough edges, iterate based on learning
- **Focus:** Test traction with minimal tech, skip non-essentials

### 4. Marketing > Perfection
- **Balance:** Equal time on development and promotion
- **Channels:** Social posts, communities, ads
- **Truth:** Great product without users fails

### 5. Focus on Core Value
- **Heart:** AI tarot reading experience
- **Priority:** Prompt engineering and reading quality over fancy features
- **MVP Principle:** Deliver main value prop clearly, scale features later

---

## **Expected Outcomes**

By following this 14-day plan:
- ✅ **Live MVP:** Functional TarotSnap in production
- ✅ **Real Users:** 10-100 initial user base
- ✅ **Valuable Feedback:** Wealth of user insights for iteration
- ✅ **Efficient Process:** Leveraging best current tools to minimize coding, maximize output
- ✅ **Budget-Friendly:** Startup-friendly costs within HKD $10k budget

**Good luck with your TarotSnap launch – may the cards be in your favor!** 🔮🚀

---

*Created: December 2024*  
*Status: Strategic planning document for TarotSnap MVP launch*  
*Next Action: Begin Day 1 planning phase* 