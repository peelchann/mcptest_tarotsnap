// TarotSnap Analytics Service
// Tracks user engagement, reading completions, and business metrics

import { sendGAEvent } from '@next/third-parties/google'

// Analytics event types for TarotSnap
export interface TarotAnalyticsEvent {
  // User engagement events
  reading_started: {
    question_length: number
    user_type: 'authenticated' | 'anonymous'
    session_id: string
  }
  
  reading_completed: {
    card_drawn: string
    session_duration: number
    user_type: 'authenticated' | 'anonymous'
    question_category?: string
  }
  
  chat_started: {
    card_name: string
    user_type: 'authenticated' | 'anonymous'
  }
  
  chat_message_sent: {
    message_count: number
    session_duration: number
    user_type: 'authenticated' | 'anonymous'
  }
  
  // Rate limiting events
  rate_limit_hit: {
    limit_type: 'readings' | 'followup_questions'
    remaining_count: number
    user_type: 'authenticated' | 'anonymous'
  }
  
  // User journey events
  signup_completed: {
    referrer?: string
  }
  
  login_completed: {
    return_user: boolean
  }
  
  // Business intelligence events
  premium_interest: {
    trigger: 'rate_limit' | 'dashboard' | 'features'
    user_engagement_score: number
  }
  
  error_occurred: {
    error_type: 'api_failure' | 'rate_limit' | 'network' | 'user_error' | 'unknown'
    error_message: string
    user_impact: 'low' | 'medium' | 'high'
  }
}

// Enhanced analytics tracking with privacy considerations
class TarotAnalytics {
  private isEnabled: boolean = false
  private sessionId: string = ''
  private sessionStartTime: number = 0
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.isEnabled = process.env.NODE_ENV === 'production'
      this.sessionId = this.generateSessionId()
      this.sessionStartTime = Date.now()
    }
  }
  
  private generateSessionId(): string {
    // Generate privacy-friendly session ID
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private getSessionDuration(): number {
    return Math.round((Date.now() - this.sessionStartTime) / 1000)
  }
  
  private getUserType(): 'authenticated' | 'anonymous' {
    // Check if user is logged in (you can implement this based on your auth)
    if (typeof window !== 'undefined') {
      // Simple check - you can enhance this based on your auth implementation
      const hasAuthToken = document.cookie.includes('supabase-auth-token') || 
                          localStorage.getItem('supabase.auth.token')
      return hasAuthToken ? 'authenticated' : 'anonymous'
    }
    return 'anonymous'
  }
  
  // Core event tracking method
  private trackEvent<T extends keyof TarotAnalyticsEvent>(
    eventName: T,
    parameters: TarotAnalyticsEvent[T] & { session_id?: string }
  ) {
    if (!this.isEnabled) {
      console.log(`[Analytics] ${eventName}:`, parameters)
      return
    }
    
    try {
      // Add session context to all events
      const enrichedParameters = {
        ...parameters,
        session_id: this.sessionId,
        timestamp: Date.now()
      }
      
      // Send to Google Analytics
      sendGAEvent('event', eventName, enrichedParameters)
      
      // Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}:`, enrichedParameters)
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }
  
  // Public tracking methods for TarotSnap events
  
  trackReadingStarted(questionLength: number) {
    this.trackEvent('reading_started', {
      question_length: questionLength,
      user_type: this.getUserType(),
      session_id: this.sessionId
    })
  }
  
  trackReadingCompleted(cardDrawn: string, questionCategory?: string) {
    this.trackEvent('reading_completed', {
      card_drawn: cardDrawn,
      session_duration: this.getSessionDuration(),
      user_type: this.getUserType(),
      question_category: questionCategory
    })
  }
  
  trackChatStarted(cardName: string) {
    this.trackEvent('chat_started', {
      card_name: cardName,
      user_type: this.getUserType()
    })
  }
  
  trackChatMessage(messageCount: number) {
    this.trackEvent('chat_message_sent', {
      message_count: messageCount,
      session_duration: this.getSessionDuration(),
      user_type: this.getUserType()
    })
  }
  
  trackRateLimitHit(limitType: 'readings' | 'followup_questions', remainingCount: number) {
    this.trackEvent('rate_limit_hit', {
      limit_type: limitType,
      remaining_count: remainingCount,
      user_type: this.getUserType()
    })
  }
  
  trackSignupCompleted(referrer?: string) {
    this.trackEvent('signup_completed', {
      referrer: referrer || document.referrer || 'direct'
    })
  }
  
  trackLoginCompleted(returnUser: boolean = false) {
    this.trackEvent('login_completed', {
      return_user: returnUser
    })
  }
  
  trackPremiumInterest(trigger: 'rate_limit' | 'dashboard' | 'features', engagementScore: number = 1) {
    this.trackEvent('premium_interest', {
      trigger,
      user_engagement_score: engagementScore
    })
  }
  
  trackError(
    errorType: 'api_failure' | 'rate_limit' | 'network' | 'user_error' | 'unknown',
    errorMessage: string,
    userImpact: 'low' | 'medium' | 'high' = 'medium'
  ) {
    this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // Limit message length
      user_impact: userImpact
    })
  }
  
  // Page view tracking (automatic with GA4 but useful for custom logic)
  trackPageView(pageName: string, additionalData?: Record<string, any>) {
    if (!this.isEnabled) return
    
    try {
      sendGAEvent('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        user_type: this.getUserType(),
        session_id: this.sessionId,
        ...additionalData
      })
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }
  
  // User engagement scoring (for premium conversion prediction)
  calculateEngagementScore(): number {
    // Simple engagement scoring based on current session
    let score = 0
    
    // Base score for authenticated users
    if (this.getUserType() === 'authenticated') score += 3
    
    // Session duration bonus
    const sessionMinutes = this.getSessionDuration() / 60
    if (sessionMinutes > 2) score += 2
    if (sessionMinutes > 5) score += 3
    
    // You can enhance this based on user behavior patterns
    return Math.min(score, 10) // Cap at 10
  }
}

// Export singleton instance
export const analytics = new TarotAnalytics()

// Helper function for question categorization
export function categorizeQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('love') || lowerQuestion.includes('relationship') || lowerQuestion.includes('romance')) {
    return 'love_relationships'
  }
  if (lowerQuestion.includes('career') || lowerQuestion.includes('job') || lowerQuestion.includes('work')) {
    return 'career_work'
  }
  if (lowerQuestion.includes('money') || lowerQuestion.includes('finance') || lowerQuestion.includes('wealth')) {
    return 'finances'
  }
  if (lowerQuestion.includes('spiritual') || lowerQuestion.includes('growth') || lowerQuestion.includes('purpose')) {
    return 'spirituality'
  }
  if (lowerQuestion.includes('future') || lowerQuestion.includes('will') || lowerQuestion.includes('happen')) {
    return 'future_prediction'
  }
  if (lowerQuestion.includes('decision') || lowerQuestion.includes('should') || lowerQuestion.includes('choice')) {
    return 'decision_making'
  }
  
  return 'general'
}

// Privacy-compliant user identification
export function getAnonymousUserId(): string {
  if (typeof window === 'undefined') return 'server'
  
  let userId = localStorage.getItem('tarot_user_id')
  if (!userId) {
    // Generate privacy-friendly anonymous ID
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('tarot_user_id', userId)
  }
  return userId
}

// Export types for use in components (already exported above) 