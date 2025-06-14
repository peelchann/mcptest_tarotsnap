import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { chatStorage } from '@/lib/services/chatStorage'

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

    // Export chat history
    const { data: exportData, error } = await chatStorage.exportChatHistory()

    if (error) {
      console.error('Error exporting chat history:', error)
      return NextResponse.json(
        { error: 'Failed to export chat history' },
        { status: 500 }
      )
    }

    // Return as downloadable JSON
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Content-Disposition', `attachment; filename="tarotsnap-chat-export-${new Date().toISOString().split('T')[0]}.json"`)

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Chat export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 