// Chat Storage Service for TarotSnap Chat-Centric Memory System
// Handles all chat message and session operations with user authentication

import { createBrowserSupabaseClient } from '../supabase'

// Chat message and session types
export interface ChatMessage {
  id: string
  user_id: string
  session_id?: string
  role: 'user' | 'ai'
  content: string
  created_at: string
  reading_id?: string
  metadata: Record<string, any>
}

export interface ChatSession {
  id: string
  user_id: string
  reading_id?: string
  title?: string
  created_at: string
  updated_at: string
}

type InsertChatMessage = Omit<ChatMessage, 'id' | 'created_at'>
type InsertChatSession = Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>

export class ChatStorageService {
  private supabase = createBrowserSupabaseClient()

  /**
   * Create a new chat session
   */
  async createChatSession(data: {
    readingId?: string
    title?: string
  }): Promise<{ data: ChatSession | null; error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const sessionData: InsertChatSession = {
      user_id: user.id,
      reading_id: data.readingId,
      title: data.title || `Chat Session ${new Date().toLocaleDateString()}`
    }

    const { data: session, error } = await this.supabase
      .from('chat_sessions')
      .insert(sessionData)
      .select()
      .single()

    return { data: session, error }
  }

  /**
   * Store a new chat message
   */
  async storeChatMessage(data: {
    role: 'user' | 'ai'
    content: string
    sessionId?: string
    readingId?: string
    metadata?: Record<string, any>
  }): Promise<{ data: ChatMessage | null; error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const messageData: InsertChatMessage = {
      user_id: user.id,
      role: data.role,
      content: data.content,
      session_id: data.sessionId,
      reading_id: data.readingId,
      metadata: data.metadata || {}
    }

    const { data: message, error } = await this.supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single()

    return { data: message, error }
  }

  /**
   * Get chat history for the current user
   */
  async getChatHistory(options?: {
    sessionId?: string
    readingId?: string
    limit?: number
    offset?: number
  }): Promise<{ data: ChatMessage[] | null; error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    let query = this.supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (options?.sessionId) {
      query = query.eq('session_id', options.sessionId)
    }

    if (options?.readingId) {
      query = query.eq('reading_id', options.readingId)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1)
    }

    const { data: messages, error } = await query

    return { data: messages, error }
  }

  /**
   * Get chat sessions for the current user
   */
  async getChatSessions(options?: {
    limit?: number
    offset?: number
  }): Promise<{ data: ChatSession[] | null; error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    let query = this.supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1)
    }

    const { data: sessions, error } = await query

    return { data: sessions, error }
  }

  /**
   * Delete a specific chat message
   */
  async deleteChatMessage(messageId: string): Promise<{ error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'User not authenticated' } }
    }

    const { error } = await this.supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId)
      .eq('user_id', user.id)

    return { error }
  }

  /**
   * Delete all chat messages for the current user
   */
  async deleteAllChatMessages(): Promise<{ error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'User not authenticated' } }
    }

    const { error } = await this.supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id)

    return { error }
  }

  /**
   * Delete a chat session and all its messages
   */
  async deleteChatSession(sessionId: string): Promise<{ error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'User not authenticated' } }
    }

    // Delete session (messages will be cascade deleted)
    const { error } = await this.supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id)

    return { error }
  }

  /**
   * Export chat history as JSON for privacy compliance
   */
  async exportChatHistory(): Promise<{ data: any | null; error: any }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } }
    }

    const { data: sessions, error: sessionsError } = await this.getChatSessions()
    const { data: messages, error: messagesError } = await this.getChatHistory()

    if (sessionsError || messagesError) {
      return { data: null, error: sessionsError || messagesError }
    }

    const exportData = {
      user_id: user.id,
      exported_at: new Date().toISOString(),
      sessions: sessions || [],
      messages: messages || []
    }

    return { data: exportData, error: null }
  }

  /**
   * Analyze chat content for insights (themes, emotions, etc.)
   */
  async analyzeChatContent(content: string, context?: {
    readingId?: string
    cardDrawn?: string
    userQuestion?: string
  }): Promise<Record<string, any>> {
    // This would integrate with your AI service (OpenRouter) for content analysis
    // For now, return basic metadata structure
    return {
      timestamp: new Date().toISOString(),
      content_length: content.length,
      word_count: content.split(' ').length,
      context: context || {},
      // Future: AI-extracted themes, emotions, topics, etc.
      themes: [],
      emotions: [],
      topics: []
    }
  }
}

// Export singleton instance
export const chatStorage = new ChatStorageService() 