import OpenAI from 'openai';
import { cards } from '@/app/data/cards';
import { generateInitialReadingPrompt, generateFollowUpPrompt, generateChatVariants } from './prompt-templates';

// Lazy initialization function for OpenAI client
function getOpenAIClient() {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000', // Optional: for OpenRouter analytics
      'X-Title': 'TarotSnap', // Optional: for OpenRouter analytics
    },
  });
}

// Comprehensive tarot card database (keeping for reference but not using for readings)
export const tarotCards = [
  // Major Arcana
  { name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity, free spirit', reversed: 'Recklessness, taken advantage of, inconsideration' },
  { name: 'The Magician', meaning: 'Manifestation, resourcefulness, power, inspired action', reversed: 'Manipulation, poor planning, untapped talents' },
  { name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, divine feminine, subconscious mind', reversed: 'Secrets, disconnected from intuition, withdrawal' },
  { name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing, abundance', reversed: 'Creative block, dependence on others' },
  { name: 'The Emperor', meaning: 'Authority, establishment, structure, father figure', reversed: 'Tyranny, rigidity, coldness' },
  { name: 'The Hierophant', meaning: 'Spiritual wisdom, religious beliefs, conformity, tradition', reversed: 'Personal beliefs, freedom, challenging the status quo' },
  { name: 'The Lovers', meaning: 'Love, harmony, relationships, values alignment', reversed: 'Self-love, disharmony, imbalance, misalignment of values' },
  { name: 'The Chariot', meaning: 'Control, willpower, success, determination', reversed: 'Self-discipline, opposition, lack of direction' },
  { name: 'Strength', meaning: 'Strength, courage, persuasion, influence, compassion', reversed: 'Self doubt, low energy, raw emotion' },
  { name: 'The Hermit', meaning: 'Soul searching, introspection, inner guidance', reversed: 'Isolation, loneliness, withdrawal' },
  { name: 'Wheel of Fortune', meaning: 'Good luck, karma, life cycles, destiny, turning point', reversed: 'Bad luck, lack of control, clinging to control' },
  { name: 'Justice', meaning: 'Justice, fairness, truth, cause and effect, law', reversed: 'Unfairness, lack of accountability, dishonesty' },
  { name: 'The Hanged Man', meaning: 'Suspension, restriction, letting go, sacrifice', reversed: 'Martyrdom, indecision, delay' },
  { name: 'Death', meaning: 'Endings, change, transformation, transition', reversed: 'Resistance to change, personal transformation, inner purging' },
  { name: 'Temperance', meaning: 'Balance, moderation, patience, purpose', reversed: 'Imbalance, excess, self-healing, re-alignment' },
  { name: 'The Devil', meaning: 'Shadow self, attachment, addiction, restriction, sexuality', reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment' },
  { name: 'The Tower', meaning: 'Sudden change, upheaval, chaos, revelation, awakening', reversed: 'Personal transformation, fear of change, averting disaster' },
  { name: 'The Star', meaning: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, self-trust, disconnection' },
  { name: 'The Moon', meaning: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotion, inner confusion' },
  { name: 'The Sun', meaning: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic' },
  { name: 'Judgement', meaning: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, inner critic, ignoring the call' },
  { name: 'The World', meaning: 'Completion, integration, accomplishment, travel', reversed: 'Seeking personal closure, short-cut to success' },
  
  // Popular Minor Arcana cards
  { name: 'Ace of Cups', meaning: 'Love, intuition, spiritual awakening, new relationships', reversed: 'Self-love, intuition blocked, emotional loss' },
  { name: 'Three of Cups', meaning: 'Celebration, friendship, creativity, community', reversed: 'Independence, alone time, creative blocks' },
  { name: 'Ten of Cups', meaning: 'Divine love, blissful relationships, harmony, alignment', reversed: 'Disconnection, misaligned values, struggling relationships' },
  { name: 'Ace of Pentacles', meaning: 'A new financial or career opportunity, manifestation, abundance', reversed: 'Lost opportunity, missed chance, bad investment' },
  { name: 'Three of Pentacles', meaning: 'Collaboration, learning, implementation', reversed: 'Disharmony, misalignment, working alone' },
  { name: 'Ten of Pentacles', meaning: 'Wealth, financial security, family, long-term success', reversed: 'The dark side of wealth, financial failure or loss' },
  { name: 'Ace of Swords', meaning: 'New ideas, mental clarity, breakthrough', reversed: 'Inner clarity, re-thinking an idea, clouded judgement' },
  { name: 'Three of Swords', meaning: 'Heartbreak, emotional pain, sorrow, grief, hurt', reversed: 'Negative self-talk, releasing pain, optimism, forgiveness' },
  { name: 'Ten of Swords', meaning: 'Painful endings, deep wounds, betrayal, loss, crisis', reversed: 'Recovery, regeneration, resisting an inevitable end' },
  { name: 'Ace of Wands', meaning: 'Inspiration, new opportunities, growth', reversed: 'An emerging idea, lack of direction, distractions, delays' },
  { name: 'Three of Wands', meaning: 'Progress, expansion, foresight, overseas opportunities', reversed: 'Playing small, lack of foresight, unexpected delays' },
  { name: 'Ten of Wands', meaning: 'Burden, extra responsibility, hard work, completion', reversed: 'Doing it all, carrying the burden, delegation, release' },
  { name: 'Two of Cups', meaning: 'Unified love, partnership, mutual attraction', reversed: 'Self-love, break-ups, disharmony, distrust' },
  { name: 'Four of Cups', meaning: 'Meditation, contemplation, apathy, reevaluation', reversed: 'Retreat, withdrawal, checking in for alignment' },
  { name: 'Seven of Cups', meaning: 'Opportunities, choices, wishful thinking, illusion', reversed: 'Alignment, personal values, overwhelmed by choices' },
  { name: 'Page of Cups', meaning: 'Creative opportunities, intuitive messages, curiosity, possibility', reversed: 'New ideas, doubting intuition, creative blocks' },
  { name: 'Knight of Cups', meaning: 'Creativity, romance, charm, imagination, beauty', reversed: 'Overactive imagination, unrealistic, jealous' },
  { name: 'Queen of Cups', meaning: 'Compassion, calm, comfort, intuition, inner feelings', reversed: 'Self-compassion, inner feelings, self-care, co-dependency' }
];

export interface TarotReading {
  card: string;
  meaning: string;
  interpretation: string;
  guidance: string;
  energy: string;
  timeframe: string;
  imagePath?: string;
}

export async function generateTarotReading(question: string): Promise<TarotReading> {
  try {
    // Select a random card from our Major Arcana deck (cards with images)
    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    
    // Generate personalized prompt using new template system
    const promptTemplate = generateInitialReadingPrompt(question, selectedCard.name, selectedCard.keywords);

    const completion = await getOpenAIClient().chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free", // Free model on OpenRouter
      messages: [
        {
          role: "system",
          content: promptTemplate.system
        },
        {
          role: "user",
          content: promptTemplate.user
        }
      ],
      max_tokens: 600,
      temperature: 0.9, // Increased for more varied responses
    });

    const response = completion.choices[0]?.message?.content || "";
    
    // Parse the response to extract sections
    const sections = {
      interpretation: extractSection(response, 'INTERPRETATION'),
      guidance: extractSection(response, 'GUIDANCE'),
      energy: extractSection(response, 'ENERGY'),
      timeframe: extractSection(response, 'TIMEFRAME')
    };

    return {
      card: selectedCard.name,
      meaning: selectedCard.keywords.join(', '),
      interpretation: sections.interpretation || "The universe speaks through this card with a message tailored just for you.",
      guidance: sections.guidance || "Trust in the wisdom of the cards and follow your intuition.",
      energy: sections.energy || "A mystical energy surrounds you, full of potential and transformation.",
      timeframe: sections.timeframe || "Divine timing is at work in your situation.",
      imagePath: selectedCard.imagePath
    };

  } catch (error) {
    console.error('Error generating tarot reading:', error);
    throw new Error('Unable to channel the mystical energies at this time. Please try again.');
  }
}

export async function generateFollowUpResponse(
  originalQuestion: string,
  cardName: string,
  cardMeaning: string,
  previousInterpretation: string,
  followUpQuestion: string
): Promise<string> {
  try {
    const promptTemplate = generateFollowUpPrompt({
      originalQuestion,
      cardName,
      cardMeaning,
      previousInterpretation,
      followUpQuestion
    });

    const completion = await getOpenAIClient().chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: promptTemplate.system
        },
        {
          role: "user",
          content: promptTemplate.user
        }
      ],
      max_tokens: 300,
      temperature: 0.85,
    });

    return completion.choices[0]?.message?.content || "The mystical energies encourage you to trust your inner wisdom as you navigate this question.";

  } catch (error) {
    console.error('Error generating follow-up response:', error);
    throw new Error('Unable to channel the mystical energies for your follow-up question.');
  }
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\\s*([^\\n]*(?:\\n(?!\\w+:)[^\\n]*)*)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

// Health check function
export async function checkOpenRouterHealth(): Promise<boolean> {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10,
    });
    
    return !!response.choices[0]?.message?.content;
  } catch (error) {
    console.error('OpenRouter health check failed:', error);
    return false;
  }
} 