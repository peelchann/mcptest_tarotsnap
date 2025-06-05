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
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    const body = await request.json();

    // Check rate limit (different limits for readings vs follow-ups)
    const isFollowUp = !!body.followUp;
    const rateLimitResult = checkRateLimit(clientIp, isFollowUp);
    
    if (!rateLimitResult.allowed) {
      const limitType = isFollowUp ? 'follow-up questions' : 'tarot readings';
      const dailyLimit = isFollowUp ? FOLLOWUP_LIMIT : READING_LIMIT;
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: `You have reached the daily limit of ${dailyLimit} ${limitType}. Please try again tomorrow.`,
          resetTime: rateLimitMap.get(clientIp)?.resetTime,
          remaining: 0
        },
        { status: 429 }
      );
    }
    const { question, followUp } = body;

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

    // Handle follow-up questions differently (don't count against rate limit)
    if (followUp) {
      const { originalQuestion, cardName, cardMeaning, previousInterpretation } = followUp;
      
      if (!originalQuestion || !cardName || !cardMeaning || !previousInterpretation) {
        return NextResponse.json(
          { error: 'Invalid follow-up context provided' },
          { status: 400 }
        );
      }

      const followUpResponse = await generateFollowUpResponse(
        originalQuestion,
        cardName,
        cardMeaning,
        previousInterpretation,
        question.trim()
      );

      return NextResponse.json({
        success: true,
        response: followUpResponse,
        timestamp: new Date().toISOString(),
        remainingFollowUps: rateLimitResult.remaining,
        type: 'followUp'
      });
    }

    // Generate the initial tarot reading
    const reading = await generateTarotReading(question.trim());

    return NextResponse.json({
      success: true,
      reading,
      timestamp: new Date().toISOString(),
      remainingReadings: rateLimitResult.remaining,
      type: 'initial'
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