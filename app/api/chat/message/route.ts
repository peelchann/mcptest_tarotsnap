import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { chatStorage } from '@/lib/services/chatStorage'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role, content, sessionId, readingId, context } = body

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      )
    }

    if (!['user', 'ai'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "user" or "ai"' },
        { status: 400 }
      )
    }

    // Analyze content for metadata (themes, emotions, etc.)
    const metadata = await chatStorage.analyzeChatContent(content, context)

    // Store the message
    const { data: message, error } = await chatStorage.storeChatMessage({
      role,
      content,
      sessionId,
      readingId,
      metadata
    })

    if (error) {
      console.error('Error storing chat message:', error)
      return NextResponse.json(
        { error: 'Failed to store message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Chat message API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 