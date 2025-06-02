import { NextRequest, NextResponse } from 'next/server';
import { generateTarotReading, checkOpenRouterHealth } from '@/lib/openrouter';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // 3 readings per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= RATE_LIMIT) {
    return false;
  }

  clientData.count++;
  return true;
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
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'You have reached the daily limit of 3 tarot readings. Please try again tomorrow.',
          resetTime: rateLimitMap.get(clientIp)?.resetTime
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid question for your tarot reading' },
        { status: 400 }
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: 'Question is too long. Please keep it under 500 characters.' },
        { status: 400 }
      );
    }

    // Generate the tarot reading
    const reading = await generateTarotReading(question.trim());

    return NextResponse.json({
      success: true,
      reading,
      timestamp: new Date().toISOString(),
      remainingReadings: RATE_LIMIT - (rateLimitMap.get(clientIp)?.count || 0)
    });

  } catch (error) {
    console.error('Error in tarot reading API:', error);
    
    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: 'Unable to generate reading',
        message: 'The mystical energies are disrupted at the moment. Please try again shortly.'
      },
      { status: 500 }
    );
  }
} 