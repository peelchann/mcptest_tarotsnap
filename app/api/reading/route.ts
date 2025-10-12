import { NextRequest, NextResponse } from 'next/server';
import { generateTarotReading, generateFollowUpResponse } from '@/lib/openrouter';

// Rate limiting configuration
const READING_LIMIT = 3; // Daily limit for tarot readings
const FOLLOWUP_LIMIT = 10; // Daily limit for follow-up questions

// In-memory rate limiting (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number; followUpCount: number }>();

function checkRateLimit(clientIp: string, isFollowUp: boolean = false): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  let rateLimitData = rateLimitMap.get(clientIp);
  
  // Reset if it's a new day
  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimitData = {
      count: 0,
      followUpCount: 0,
      resetTime: now + oneDayMs
    };
    rateLimitMap.set(clientIp, rateLimitData);
  }
  
  const currentCount = isFollowUp ? rateLimitData.followUpCount : rateLimitData.count;
  const limit = isFollowUp ? FOLLOWUP_LIMIT : READING_LIMIT;
  
  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  // Increment the appropriate counter
  if (isFollowUp) {
    rateLimitData.followUpCount++;
  } else {
    rateLimitData.count++;
  }
  
  return { allowed: true, remaining: limit - (isFollowUp ? rateLimitData.followUpCount : rateLimitData.count) };
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

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic' 