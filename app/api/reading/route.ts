import { NextRequest, NextResponse } from 'next/server';
import { generateTarotReading, checkOpenRouterHealth, generateFollowUpResponse } from '@/lib/openrouter';

// Enhanced rate limiting with separate limits for readings and follow-ups
const rateLimitMap = new Map<string, { readingCount: number; followUpCount: number; resetTime: number }>();
const READING_LIMIT = 3; // 3 readings per day
const FOLLOWUP_LIMIT = 10; // 10 follow-up questions per day per reading
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkRateLimit(clientId: string, isFollowUp: boolean = false): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    const newData = { 
      readingCount: isFollowUp ? 0 : 1, 
      followUpCount: isFollowUp ? 1 : 0, 
      resetTime: now + RATE_LIMIT_WINDOW 
    };
    rateLimitMap.set(clientId, newData);
    return { 
      allowed: true, 
      remaining: isFollowUp ? FOLLOWUP_LIMIT - 1 : READING_LIMIT - 1 
    };
  }

  if (isFollowUp) {
    if (clientData.followUpCount >= FOLLOWUP_LIMIT) {
      return { allowed: false, remaining: 0 };
    }
    clientData.followUpCount++;
    return { allowed: true, remaining: FOLLOWUP_LIMIT - clientData.followUpCount };
  } else {
    if (clientData.readingCount >= READING_LIMIT) {
      return { allowed: false, remaining: 0 };
    }
    clientData.readingCount++;
    return { allowed: true, remaining: READING_LIMIT - clientData.readingCount };
  }
}

export async function GET() {
  try {
    const isHealthy = await checkOpenRouterHealth();
    
    if (!isHealthy) {
      return NextResponse.json(
        { error: 'OpenRouter service is currently unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      status: 'OpenRouter tarot reading service is operational',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Service health check failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, followUp } = body;

    // Simple mock response for testing deployment
    if (followUp) {
      return NextResponse.json({
        response: "Thank you for your follow-up question. The cards suggest following your intuition on this matter."
      });
    }

    // Simple mock reading for testing
    const mockReading = {
      card: "The Star",
      meaning: "Hope, faith, purpose, renewal, spirituality",
      interpretation: "The Star appears to bring you hope and guidance. This card suggests that better times are ahead and that you should trust in the universe's plan for you.",
      guidance: "Follow your dreams and trust your intuition. The universe is aligning to support your highest good.",
      energy: "Peaceful and inspiring energy surrounds you, filled with hope and possibility.",
      timeframe: "This energy will manifest within the next lunar cycle.",
      imagePath: "/cards/major/star.jpg"
    };

    return NextResponse.json({
      reading: mockReading,
      remainingReadings: 2
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 