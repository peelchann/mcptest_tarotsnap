/** @jest-environment node */
import { NextRequest } from 'next/server'

jest.mock('@/lib/openrouter', () => ({
  generateTarotReading: jest.fn(async () => ({
    card: 'The Fool',
    meaning: 'New beginnings',
    interpretation: 'interpretation',
    guidance: 'guidance',
    energy: 'energy',
    timeframe: 'timeframe',
    imagePath: '/image.png'
  })),
  generateFollowUpResponse: jest.fn(async () => 'followUp')
}))

function loadRoute() {
  jest.resetModules()
  return require('@/app/api/reading/route')
}

function createRequest(body: any, ip = '1.1.1.1') {
  return new NextRequest('http://localhost/api/reading', {
    method: 'POST',
    headers: {
      'x-forwarded-for': ip,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

describe('POST /api/reading', () => {
  it('returns a tarot reading', async () => {
    const { POST } = loadRoute()
    const req = createRequest({ question: 'Will I succeed?' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.reading.card).toBe('The Fool')
  })

  it('handles follow-up questions', async () => {
    const { POST } = loadRoute()
    const body = {
      question: 'follow?',
      followUp: {
        originalQuestion: 'orig',
        cardName: 'The Fool',
        cardMeaning: 'meaning',
        previousInterpretation: 'interp'
      }
    }
    const req = createRequest(body)
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.type).toBe('followUp')
    expect(data.response).toBe('followUp')
  })

  it('enforces daily rate limit', async () => {
    const { POST } = loadRoute()
    for (let i = 0; i < 3; i++) {
      const r = await POST(createRequest({ question: 'Q'+i }))
      expect(r.status).toBe(200)
    }
    const res = await POST(createRequest({ question: 'Limit' }))
    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toBe('Rate limit exceeded')
  })
})
