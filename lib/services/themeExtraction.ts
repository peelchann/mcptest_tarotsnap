import OpenAI from 'openai'

// Lazy initialization function for OpenAI client (replicating from openrouter.ts)
function getOpenAIClient() {
  const refererUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.NODE_ENV === 'production' 
      ? 'https://tarotsnap.com' 
      : 'http://localhost:3000';

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': refererUrl,
      'X-Title': 'TarotSnap',
    },
  });
}

interface ThemeExtractionResult {
  themes: string[]
  emotionalState: {
    mood?: string
    energy?: string
    openness?: string
    stress_level?: number
  }
  significance: number
  followUpNeeded: boolean
  insights: string[]
}

export class ThemeExtractionService {
  /**
   * Extract themes and insights from a reading session
   */
  async extractThemes(data: {
    question: string
    cardsDrawn: Array<{ card_id: string; meaning: string }>
    interpretation: string
    userResponse?: string
  }): Promise<ThemeExtractionResult> {
    try {
      const prompt = this.buildThemeExtractionPrompt(data)
      
      const response = await getOpenAIClient().chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are a spiritual advisor and pattern recognition expert specializing in tarot reading analysis. Your role is to analyze reading sessions and extract meaningful themes, emotional patterns, and insights for building user memory profiles.

IMPORTANT: Respond ONLY with valid JSON in exactly this format:
{
  "themes": ["theme1", "theme2", "theme3"],
  "emotionalState": {
    "mood": "calm|anxious|hopeful|confused|excited|peaceful|troubled",
    "energy": "high|medium|low",
    "openness": "very_open|open|neutral|guarded|closed",
    "stress_level": 1-10
  },
  "significance": 1-5,
  "followUpNeeded": true|false,
  "insights": ["insight1", "insight2", "insight3"]
}

Do not include any text outside the JSON object.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      // Parse the JSON response
      const result = JSON.parse(content.trim()) as ThemeExtractionResult
      
      // Validate the result
      if (!result.themes || !Array.isArray(result.themes)) {
        throw new Error('Invalid response format')
      }

      return result
    } catch (error) {
      console.error('Error extracting themes:', error)
      
      // Return fallback analysis
      return this.getFallbackAnalysis(data)
    }
  }

  /**
   * Build the prompt for theme extraction
   */
  private buildThemeExtractionPrompt(data: {
    question: string
    cardsDrawn: Array<{ card_id: string; meaning: string }>
    interpretation: string
    userResponse?: string
  }): string {
    return `Analyze this tarot reading session to extract themes and emotional patterns:

QUESTION: "${data.question}"

CARDS DRAWN:
${data.cardsDrawn.map(card => `- ${card.card_id}: ${card.meaning}`).join('\n')}

INTERPRETATION: "${data.interpretation}"

${data.userResponse ? `USER RESPONSE: "${data.userResponse}"` : ''}

Extract:
1. THEMES: Life areas/concerns (max 5, use categories like: relationships, career, personal_growth, spirituality, finances, health, family, creativity, life_transitions, self_doubt, communication, inner_wisdom, healing, manifestation, balance, protection, challenges, opportunities)

2. EMOTIONAL STATE: Assess the user's current emotional state based on their question and the reading context

3. SIGNIFICANCE: Rate 1-5 how significant this reading appears to be for the user's journey

4. FOLLOW-UP NEEDED: Determine if this reading suggests the user might benefit from follow-up guidance

5. INSIGHTS: Key patterns or observations about the user's current life situation (max 3, focus on actionable insights)

Remember: Respond with ONLY the JSON object, no other text.`
  }

  /**
   * Provide fallback analysis when AI extraction fails
   */
  private getFallbackAnalysis(data: {
    question: string
    cardsDrawn: Array<{ card_id: string; meaning: string }>
    interpretation: string
  }): ThemeExtractionResult {
    // Simple keyword-based theme detection
    const themes: string[] = []
    const text = `${data.question} ${data.interpretation}`.toLowerCase()

    // Theme mapping based on keywords
    const themeKeywords = {
      'relationships': ['love', 'relationship', 'partner', 'dating', 'marriage', 'romance', 'heart'],
      'career': ['job', 'work', 'career', 'employment', 'business', 'money', 'success'],
      'personal_growth': ['growth', 'change', 'development', 'improve', 'better', 'journey'],
      'spirituality': ['spiritual', 'soul', 'purpose', 'meaning', 'faith', 'divine'],
      'life_transitions': ['transition', 'change', 'new', 'beginning', 'end', 'moving'],
      'challenges': ['problem', 'difficulty', 'struggle', 'challenge', 'hard', 'difficult']
    }

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        themes.push(theme)
      }
    }

    // If no themes detected, add a general one
    if (themes.length === 0) {
      themes.push('personal_guidance')
    }

    return {
      themes: themes.slice(0, 3), // Limit to 3 themes
      emotionalState: {
        mood: 'neutral',
        energy: 'medium',
        openness: 'open',
        stress_level: 5
      },
      significance: 3,
      followUpNeeded: false,
      insights: ['Reading provides general guidance for current situation']
    }
  }

  /**
   * Analyze user's spiritual journey progression
   */
  async analyzeProgressPatterns(data: {
    userId: string
    recentThemes: Array<{ theme_name: string; frequency: number; last_appearance: string }>
    recentSessions: Array<{ question_context: string; key_themes: string[]; created_at: string }>
  }): Promise<{
    progressTrend: 'improving' | 'stable' | 'declining' | 'cyclical'
    dominantConcerns: string[]
    evolutionInsights: string[]
    recommendedFocus: string[]
  }> {
    try {
      const prompt = `Analyze this user's spiritual journey patterns:

RECENT THEMES (by frequency):
${data.recentThemes.map(theme => `- ${theme.theme_name}: ${theme.frequency} times, last seen ${theme.last_appearance}`).join('\n')}

RECENT READING CONTEXTS:
${data.recentSessions.map((session, index) => 
  `${index + 1}. ${session.created_at}: "${session.question_context}" - Themes: [${session.key_themes.join(', ')}]`
).join('\n')}

Analyze for:
1. PROGRESS TREND: Is the user improving, stable, declining, or in cycles?
2. DOMINANT CONCERNS: Top 3 recurring life areas
3. EVOLUTION INSIGHTS: How their concerns are evolving
4. RECOMMENDED FOCUS: Areas for future guidance

Respond in JSON format:
{
  "progressTrend": "improving|stable|declining|cyclical",
  "dominantConcerns": ["concern1", "concern2", "concern3"],
  "evolutionInsights": ["insight1", "insight2"],
  "recommendedFocus": ["focus1", "focus2"]
}`

      const response = await getOpenAIClient().chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'You are a spiritual advisor analyzing user journey patterns. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      return JSON.parse(content.trim())
    } catch (error) {
      console.error('Error analyzing progress patterns:', error)
      
      // Return fallback analysis
      return {
        progressTrend: 'stable',
        dominantConcerns: data.recentThemes.slice(0, 3).map(t => t.theme_name),
        evolutionInsights: ['User shows consistent engagement with spiritual guidance'],
        recommendedFocus: ['personal_growth', 'self_awareness']
      }
    }
  }

  /**
   * Generate personalized reading context for future sessions
   */
  async generatePersonalizedContext(data: {
    userId: string
    userThemes: Array<{ theme_name: string; frequency: number }>
    cardRelationships: Array<{ card_id: string; frequency_drawn: number }>
    recentSessions: Array<{ question_context: string; full_interpretation: string }>
    userPreferences: any
  }): Promise<{
    personalizedGreeting: string
    contextualPrompt: string
    adaptedStyle: string
  }> {
    try {
      const prompt = `Create personalized context for a returning user:

USER THEMES (frequency):
${data.userThemes.map(theme => `- ${theme.theme_name}: ${theme.frequency} times`).join('\n')}

FREQUENT CARDS:
${data.cardRelationships.map(card => `- ${card.card_id}: drawn ${card.frequency_drawn} times`).join('\n')}

RECENT READING CONTEXTS:
${data.recentSessions.slice(0, 3).map((session, i) => 
  `${i + 1}. "${session.question_context}"`
).join('\n')}

COMMUNICATION PREFERENCES:
${JSON.stringify(data.userPreferences?.communication_style || {})}

Generate:
1. PERSONALIZED GREETING: Warm, specific greeting referencing their journey (2-3 sentences)
2. CONTEXTUAL PROMPT: Context to include in AI prompts for this user (1 paragraph)
3. ADAPTED STYLE: How to adapt communication based on their preferences

Respond in JSON:
{
  "personalizedGreeting": "greeting text",
  "contextualPrompt": "context for AI prompts",
  "adaptedStyle": "style guidance"
}`

             const response = await getOpenAIClient().chat.completions.create({
         model: 'anthropic/claude-3.5-sonnet',
         messages: [
           {
             role: 'system',
             content: 'You are a spiritual advisor creating personalized user experiences. Respond only with valid JSON.'
           },
           {
             role: 'user',
             content: prompt
           }
         ],
         temperature: 0.7,
         max_tokens: 1000
       })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      return JSON.parse(content.trim())
    } catch (error) {
      console.error('Error generating personalized context:', error)
      
      // Return fallback context
      return {
        personalizedGreeting: "Welcome back! I'm delighted to continue our spiritual journey together.",
        contextualPrompt: "This user has been exploring spiritual guidance and personal growth through tarot readings.",
        adaptedStyle: "Maintain a warm, mystical tone with caring guidance."
      }
    }
  }
}

// Export singleton instance
export const themeExtraction = new ThemeExtractionService() 