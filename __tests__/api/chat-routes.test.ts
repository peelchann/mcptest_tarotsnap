/** @jest-environment node */
import { NextRequest } from 'next/server'

// Mock Supabase client to simulate unauthenticated user
jest.mock('@/lib/supabase-server', () => ({
  createServerSupabaseClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } })
    }
  })
}))

function createRequest(method: string) {
  return new NextRequest('http://localhost/api/test', { method })
}

describe('Chat API authentication', () => {
  it('export route requires auth', async () => {
    const { GET } = require('@/app/api/chat/export/route')
    const res = await GET(createRequest('GET'))
    expect(res.status).toBe(401)
  })

  it('history route requires auth', async () => {
    const { GET } = require('@/app/api/chat/history/route')
    const res = await GET(createRequest('GET'))
    expect(res.status).toBe(401)
  })

  it('message route requires auth', async () => {
    const { POST } = require('@/app/api/chat/message/route')
    const res = await POST(new NextRequest('http://localhost', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role: 'user', content: 'hi' }) }))
    expect(res.status).toBe(401)
  })
})

// Memory route also checks user

describe('Reading memory API authentication', () => {
  it('POST requires auth or anon id', async () => {
    const { POST } = require('@/app/api/reading/memory/route')
    const res = await POST(new NextRequest('http://localhost', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'store_session', data: {} }) }))
    expect(res.status).toBe(401)
  })
})
