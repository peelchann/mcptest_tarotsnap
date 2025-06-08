import { createBrowserSupabaseClient } from '../supabase'
import type { ReadingSession, UserTheme, CardRelationship, UserPreferences } from '../supabase'

export class ReadingStorageService {
  private supabase = createBrowserSupabaseClient()

  /**
   * Store a complete reading session with enhanced context
   */
  async storeReadingSession(data: {
    userId: string
    questionContext: string
    emotionalState?: {
      mood?: string
      energy?: string
      openness?: string
      stress_level?: number
    }
    cardsDrawn: Array<{
      card_id: string
      position: string
      meaning: string
      personal_significance?: string
    }>
    spreadType: string
    fullInterpretation: string
    keyThemes?: string[]
  }): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      const { data: session, error } = await this.supabase
        .from('reading_sessions')
        .insert({
          user_id: data.userId,
          question_context: data.questionContext,
          emotional_state: data.emotionalState || {},
          cards_drawn: data.cardsDrawn,
          spread_type: data.spreadType,
          full_interpretation: data.fullInterpretation,
          key_themes: data.keyThemes || [],
          follow_up_needed: false
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error storing reading session:', error)
        return { success: false, error: error.message }
      }

      // Process cards for relationship tracking
      await this.updateCardRelationships(data.userId, data.cardsDrawn)

      // Process themes
      if (data.keyThemes && data.keyThemes.length > 0) {
        await this.updateUserThemes(data.userId, data.keyThemes)
      }

      return { success: true, sessionId: session.id }
    } catch (error) {
      console.error('Error in storeReadingSession:', error)
      return { success: false, error: 'Failed to store reading session' }
    }
  }

  /**
   * Update card relationship tracking
   */
  private async updateCardRelationships(userId: string, cards: Array<{ card_id: string; position: string; meaning: string }>) {
    for (const card of cards) {
      try {
        // Check if relationship exists
        const { data: existing } = await this.supabase
          .from('card_relationships')
          .select('*')
          .eq('user_id', userId)
          .eq('card_id', card.card_id)
          .single()

        if (existing) {
          // Update existing relationship
          await this.supabase
            .from('card_relationships')
            .update({
              frequency_drawn: existing.frequency_drawn + 1,
              last_drawn: new Date().toISOString(),
              significance_level: Math.min(existing.significance_level + 1, 5)
            })
            .eq('id', existing.id)
        } else {
          // Create new relationship
          await this.supabase
            .from('card_relationships')
            .insert({
              user_id: userId,
              card_id: card.card_id,
              frequency_drawn: 1,
              significance_level: 1,
              emotional_associations: [],
              first_drawn: new Date().toISOString(),
              last_drawn: new Date().toISOString()
            })
        }
      } catch (error) {
        console.error('Error updating card relationship:', error)
      }
    }
  }

  /**
   * Update user themes tracking
   */
  private async updateUserThemes(userId: string, themes: string[]) {
    for (const themeName of themes) {
      try {
        // Check if theme exists
        const { data: existing } = await this.supabase
          .from('user_themes')
          .select('*')
          .eq('user_id', userId)
          .eq('theme_name', themeName)
          .single()

        if (existing) {
          // Update existing theme
          await this.supabase
            .from('user_themes')
            .update({
              frequency: existing.frequency + 1,
              last_appearance: new Date().toISOString(),
              significance_level: Math.min(existing.significance_level + 1, 5)
            })
            .eq('id', existing.id)
        } else {
          // Create new theme
          await this.supabase
            .from('user_themes')
            .insert({
              user_id: userId,
              theme_name: themeName,
              frequency: 1,
              significance_level: 1,
              first_appearance: new Date().toISOString(),
              last_appearance: new Date().toISOString(),
              resolution_status: 'ongoing'
            })
        }
      } catch (error) {
        console.error('Error updating user theme:', error)
      }
    }
  }

  /**
   * Store user feedback for a reading session
   */
  async storeUserFeedback(sessionId: string, feedback: {
    helpful?: boolean
    accuracy_rating?: number
    notes?: string
    resonance_level?: number
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('reading_sessions')
        .update({
          user_feedback: feedback
        })
        .eq('id', sessionId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error storing user feedback:', error)
      return { success: false, error: 'Failed to store feedback' }
    }
  }

  /**
   * Get user's reading history with rich context
   */
  async getUserReadingHistory(userId: string, limit: number = 20): Promise<ReadingSession[]> {
    try {
      const { data, error } = await this.supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching reading history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserReadingHistory:', error)
      return []
    }
  }

  /**
   * Get user's dominant themes
   */
  async getUserThemes(userId: string, limit: number = 10): Promise<UserTheme[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_themes')
        .select('*')
        .eq('user_id', userId)
        .order('frequency', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user themes:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserThemes:', error)
      return []
    }
  }

  /**
   * Get user's card relationships
   */
  async getUserCardRelationships(userId: string, limit: number = 15): Promise<CardRelationship[]> {
    try {
      const { data, error } = await this.supabase
        .from('card_relationships')
        .select('*')
        .eq('user_id', userId)
        .order('frequency_drawn', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching card relationships:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserCardRelationships:', error)
      return []
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return { success: false, error: 'Failed to update preferences' }
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error is OK
        console.error('Error fetching user preferences:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserPreferences:', error)
      return null
    }
  }

  /**
   * Get reading session summary for memory-aware prompts
   */
  async getReadingMemoryContext(userId: string, limit: number = 5): Promise<{
    recentSessions: ReadingSession[]
    dominantThemes: UserTheme[]
    frequentCards: CardRelationship[]
    userPreferences: UserPreferences | null
  }> {
    try {
      const [recentSessions, dominantThemes, frequentCards, userPreferences] = await Promise.all([
        this.getUserReadingHistory(userId, limit),
        this.getUserThemes(userId, 5),
        this.getUserCardRelationships(userId, 10),
        this.getUserPreferences(userId)
      ])

      return {
        recentSessions,
        dominantThemes,
        frequentCards,
        userPreferences
      }
    } catch (error) {
      console.error('Error getting reading memory context:', error)
      return {
        recentSessions: [],
        dominantThemes: [],
        frequentCards: [],
        userPreferences: null
      }
    }
  }
}

// Export singleton instance
export const readingStorage = new ReadingStorageService() 