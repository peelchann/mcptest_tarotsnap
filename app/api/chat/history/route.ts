import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { chatStorage } from '@/lib/services/chatStorage'

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const readingId = searchParams.get('readingId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Fetch chat history
    const { data: messages, error } = await chatStorage.getChatHistory({
      sessionId: sessionId || undefined,
      readingId: readingId || undefined,
      limit,
      offset
    })

    if (error) {
      console.error('Error fetching chat history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch chat history' },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Chat history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (messageId) {
      // Delete specific message
      const { error } = await chatStorage.deleteChatMessage(messageId)
      
      if (error) {
        console.error('Error deleting chat message:', error)
        return NextResponse.json(
          { error: 'Failed to delete message' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Message deleted' })
    } else {
      // Delete all messages for user
      const { error } = await chatStorage.deleteAllChatMessages()
      
      if (error) {
        console.error('Error deleting all chat messages:', error)
        return NextResponse.json(
          { error: 'Failed to delete all messages' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'All messages deleted' })
    }
  } catch (error) {
    console.error('Chat delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 