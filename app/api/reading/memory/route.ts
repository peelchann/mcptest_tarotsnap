import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { readingStorage } from '@/lib/services/readingStorage'
import { themeExtraction } from '@/lib/services/themeExtraction'
import { getAnonymousUserId } from '@/lib/analytics'

function getEffectiveUserId(user: any) {
  if (user && user.id) return user.id
  if (typeof window !== 'undefined') return getAnonymousUserId()
  // For server-side, fallback to a header or cookie if needed
  return null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const body = await request.json()
    const { action, data } = body

    // Use anonymousId if not authenticated
    const effectiveUserId = user && user.id ? user.id : (typeof window !== 'undefined' ? getAnonymousUserId() : null)
    if (!effectiveUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    switch (action) {
      case 'store_session':
        return await handleStoreSession(effectiveUserId, data)
      case 'store_feedback':
        return await handleStoreFeedback(data.sessionId, data.feedback)
      case 'get_memory_context':
        return await handleGetMemoryContext(effectiveUserId, data?.limit)
      case 'update_preferences':
        return await handleUpdatePreferences(effectiveUserId, data.preferences)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Memory API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleStoreSession(userId: string, sessionData: {
  questionContext: string
  cardsDrawn: Array<{
    card_id: string
    position: string
    meaning: string
  }>
  spreadType: string
  fullInterpretation: string
  emotionalState?: any
}) {
  try {
    // Extract themes and insights using AI
    const themeAnalysis = await themeExtraction.extractThemes({
      question: sessionData.questionContext,
      cardsDrawn: sessionData.cardsDrawn.map(card => ({
        card_id: card.card_id,
        meaning: card.meaning
      })),
      interpretation: sessionData.fullInterpretation
    })

    // Store the reading session with extracted themes
    const result = await readingStorage.storeReadingSession({
      userId,
      questionContext: sessionData.questionContext,
      emotionalState: sessionData.emotionalState || themeAnalysis.emotionalState,
      cardsDrawn: sessionData.cardsDrawn.map(card => ({
        ...card,
        personal_significance: undefined // Will be learned over time
      })),
      spreadType: sessionData.spreadType,
      fullInterpretation: sessionData.fullInterpretation,
      keyThemes: themeAnalysis.themes
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        sessionId: result.sessionId,
        themes: themeAnalysis.themes,
        insights: themeAnalysis.insights,
        followUpNeeded: themeAnalysis.followUpNeeded
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

  } catch (error) {
    console.error('Error storing session:', error)
    return NextResponse.json(
      { error: 'Failed to store reading session' },
      { status: 500 }
    )
  }
}

async function handleStoreFeedback(sessionId: string, feedback: {
  helpful: boolean
  accuracy_rating: number
  notes: string
  resonance_level: number
  emotional_state: any
}) {
  try {
    const result = await readingStorage.storeUserFeedback(sessionId, {
      helpful: feedback.helpful,
      accuracy_rating: feedback.accuracy_rating,
      notes: feedback.notes,
      resonance_level: feedback.resonance_level
    })

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

  } catch (error) {
    console.error('Error storing feedback:', error)
    return NextResponse.json(
      { error: 'Failed to store feedback' },
      { status: 500 }
    )
  }
}

async function handleGetMemoryContext(userId: string, limit: number = 5) {
  try {
    const memoryContext = await readingStorage.getReadingMemoryContext(userId, limit)
    
    // Generate personalized context if user has reading history
    let personalizedContext = null
    if (memoryContext.recentSessions.length > 0) {
      personalizedContext = await themeExtraction.generatePersonalizedContext({
        userId,
        userThemes: memoryContext.dominantThemes.map(theme => ({
          theme_name: theme.theme_name,
          frequency: theme.frequency
        })),
        cardRelationships: memoryContext.frequentCards.map(card => ({
          card_id: card.card_id,
          frequency_drawn: card.frequency_drawn
        })),
        recentSessions: memoryContext.recentSessions.map(session => ({
          question_context: session.question_context,
          full_interpretation: session.full_interpretation
        })),
        userPreferences: memoryContext.userPreferences
      })
    }

    return NextResponse.json({
      success: true,
      memoryContext,
      personalizedContext
    })

  } catch (error) {
    console.error('Error getting memory context:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve memory context' },
      { status: 500 }
    )
  }
}

async function handleUpdatePreferences(userId: string, preferences: any) {
  try {
    const result = await readingStorage.updateUserPreferences(userId, preferences)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}

// GET method for retrieving user's memory data
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    // Use anonymousId if not authenticated
    const effectiveUserId = user && user.id ? user.id : (typeof window !== 'undefined' ? getAnonymousUserId() : null)
    if (!effectiveUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    switch (type) {
      case 'history':
        const history = await readingStorage.getUserReadingHistory(effectiveUserId, limit)
        return NextResponse.json({ success: true, data: history })
      case 'themes':
        const themes = await readingStorage.getUserThemes(effectiveUserId, limit)
        return NextResponse.json({ success: true, data: themes })
      case 'cards':
        const cards = await readingStorage.getUserCardRelationships(effectiveUserId, limit)
        return NextResponse.json({ success: true, data: cards })
      case 'preferences':
        const preferences = await readingStorage.getUserPreferences(effectiveUserId)
        return NextResponse.json({ success: true, data: preferences })
      case 'context':
        return await handleGetMemoryContext(effectiveUserId, limit)
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Memory GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 