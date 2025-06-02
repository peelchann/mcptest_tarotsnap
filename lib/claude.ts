import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface TarotCard {
  name: string;
  suit?: string;
  upright: boolean;
  meaning: string;
  keywords: string[];
}

export interface TarotReading {
  cards: TarotCard[];
  interpretation: string;
  timestamp: Date;
  spread: 'single' | 'three-card';
  question: string;
}

export interface ReadingRequest {
  question: string;
  spread?: 'single' | 'three-card';
}

// Core tarot cards for random selection
const TAROT_CARDS = [
  // Major Arcana
  { name: "The Fool", suit: "Major Arcana", keywords: ["new beginnings", "spontaneity", "innocence"] },
  { name: "The Magician", suit: "Major Arcana", keywords: ["manifestation", "willpower", "desire"] },
  { name: "The High Priestess", suit: "Major Arcana", keywords: ["intuition", "sacred knowledge", "divine feminine"] },
  { name: "The Empress", suit: "Major Arcana", keywords: ["fertility", "femininity", "beauty", "nature"] },
  { name: "The Emperor", suit: "Major Arcana", keywords: ["authority", "structure", "control", "father-figure"] },
  { name: "The Hierophant", suit: "Major Arcana", keywords: ["spiritual wisdom", "religious beliefs", "conformity"] },
  { name: "The Lovers", suit: "Major Arcana", keywords: ["love", "harmony", "relationships", "values alignment"] },
  { name: "The Chariot", suit: "Major Arcana", keywords: ["control", "willpower", "success", "determination"] },
  { name: "Strength", suit: "Major Arcana", keywords: ["courage", "inner strength", "patience", "control"] },
  { name: "The Hermit", suit: "Major Arcana", keywords: ["soul searching", "seeking inner guidance", "introspection"] },
  { name: "Wheel of Fortune", suit: "Major Arcana", keywords: ["change", "cycles", "fate", "breakthrough"] },
  { name: "Justice", suit: "Major Arcana", keywords: ["justice", "fairness", "truth", "cause and effect"] },
  { name: "The Hanged Man", suit: "Major Arcana", keywords: ["sacrifice", "waiting", "letting go"] },
  { name: "Death", suit: "Major Arcana", keywords: ["transformation", "endings", "change", "transition"] },
  { name: "Temperance", suit: "Major Arcana", keywords: ["balance", "moderation", "patience", "purpose"] },
  { name: "The Devil", suit: "Major Arcana", keywords: ["bondage", "addiction", "sexuality", "materialism"] },
  { name: "The Tower", suit: "Major Arcana", keywords: ["destruction", "chaos", "sudden change", "revelation"] },
  { name: "The Star", suit: "Major Arcana", keywords: ["hope", "faith", "rejuvenation", "spirituality"] },
  { name: "The Moon", suit: "Major Arcana", keywords: ["illusion", "fear", "anxiety", "intuition"] },
  { name: "The Sun", suit: "Major Arcana", keywords: ["joy", "success", "celebration", "positivity"] },
  { name: "Judgement", suit: "Major Arcana", keywords: ["reflection", "reckoning", "awakening"] },
  { name: "The World", suit: "Major Arcana", keywords: ["completion", "accomplishment", "travel", "success"] },
  
  // Sample Minor Arcana
  { name: "Ace of Cups", suit: "Cups", keywords: ["new love", "emotional beginnings", "compassion"] },
  { name: "Two of Cups", suit: "Cups", keywords: ["partnership", "union", "attraction"] },
  { name: "Three of Cups", suit: "Cups", keywords: ["friendship", "celebration", "community"] },
  { name: "Ten of Cups", suit: "Cups", keywords: ["happiness", "fulfillment", "emotional satisfaction"] },
  { name: "Ace of Wands", suit: "Wands", keywords: ["inspiration", "new opportunities", "growth"] },
  { name: "Two of Wands", suit: "Wands", keywords: ["planning", "making decisions", "leaving comfort zone"] },
  { name: "Three of Wands", suit: "Wands", keywords: ["expansion", "foresight", "overseas opportunities"] },
  { name: "Ten of Wands", suit: "Wands", keywords: ["burden", "hard work", "responsibility"] },
  { name: "Ace of Swords", suit: "Swords", keywords: ["new ideas", "mental clarity", "breakthrough"] },
  { name: "Two of Swords", suit: "Swords", keywords: ["indecision", "choices", "weighing options"] },
  { name: "Three of Swords", suit: "Swords", keywords: ["heartbreak", "sorrow", "grief"] },
  { name: "Ten of Swords", suit: "Swords", keywords: ["painful endings", "betrayal", "crisis"] },
  { name: "Ace of Pentacles", suit: "Pentacles", keywords: ["new financial opportunity", "manifestation"] },
  { name: "Two of Pentacles", suit: "Pentacles", keywords: ["balance", "adaptability", "time management"] },
  { name: "Three of Pentacles", suit: "Pentacles", keywords: ["teamwork", "collaboration", "learning"] },
  { name: "Ten of Pentacles", suit: "Pentacles", keywords: ["wealth", "financial security", "family"] }
];

// Function to randomly select cards
function drawCards(count: number): TarotCard[] {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    ...card,
    upright: Math.random() > 0.3, // 70% chance upright
    meaning: "" // Will be filled by Claude
  }));
}

// Generate tarot reading using Claude
export async function generateTarotReading(request: ReadingRequest): Promise<TarotReading> {
  try {
    const cardCount = request.spread === 'three-card' ? 3 : 1;
    const drawnCards = drawCards(cardCount);
    
    const prompt = createTarotPrompt(request.question, drawnCards, request.spread || 'single');
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.8, // Higher creativity for mystical content
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    // Parse Claude's response
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const interpretation = content.text;

    return {
      cards: drawnCards,
      interpretation,
      timestamp: new Date(),
      spread: request.spread || 'single',
      question: request.question
    };

  } catch (error) {
    console.error('Error generating tarot reading:', error);
    throw new Error('Failed to generate tarot reading');
  }
}

// Create optimized prompt for Claude's creative strengths
function createTarotPrompt(question: string, cards: TarotCard[], spread: string): string {
  const cardDescriptions = cards.map((card, index) => {
    const position = spread === 'three-card' 
      ? ['Past', 'Present', 'Future'][index]
      : 'Present Situation';
    
    const orientation = card.upright ? 'upright' : 'reversed';
    return `${position}: ${card.name} (${orientation}) - Keywords: ${card.keywords.join(', ')}`;
  }).join('\n');

  return `You are a wise, intuitive tarot reader with deep knowledge of symbolism and human psychology. Your readings are mystical yet grounded, poetic yet practical. You have a gift for weaving card meanings into coherent, insightful narratives that resonate deeply with seekers.

A seeker has drawn the following cards for their question: "${question}"

Cards drawn:
${cardDescriptions}

Please provide a reading that:
- Interprets each card in context of their position and the question
- Weaves the cards together into a flowing, coherent narrative
- Uses mystical, evocative language that feels authentic to tarot tradition
- Offers practical guidance while maintaining spiritual depth
- Acknowledges both upright and reversed meanings appropriately
- Speaks directly to the seeker with warmth and wisdom

Begin your interpretation with a brief acknowledgment of the seeker's question, then flow into the card meanings and their interconnected message. End with gentle guidance or reflection.

Your reading:`;
}

// Utility function for error handling
export function isValidQuestion(question: string): boolean {
  if (!question || question.trim().length < 5) {
    return false;
  }
  
  if (question.length > 500) {
    return false;
  }
  
  // Basic content filtering
  const inappropriate = ['hate', 'kill', 'die', 'suicide', 'harm'];
  const lowerQuestion = question.toLowerCase();
  
  return !inappropriate.some(word => lowerQuestion.includes(word));
}

// Rate limiting helper (for IP-based limiting)
export function generateRateLimitKey(ip: string, date: Date = new Date()): string {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  return `tarot_reading:${ip}:${dateStr}`;
} 