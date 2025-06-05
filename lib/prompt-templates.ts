interface PromptTemplate {
  system: string;
  user: string;
}

interface FollowUpContext {
  originalQuestion: string;
  cardName: string;
  cardMeaning: string;
  previousInterpretation: string;
  followUpQuestion: string;
}

// Various personality prompts to add variety
const personalityPrompts = [
  "You are an ancient, wise tarot reader who speaks with gentle authority and deep spiritual insight.",
  "You are a mystical oracle with centuries of wisdom, known for your intuitive and compassionate guidance.",
  "You are a Celtic druid-priestess with profound connection to nature's cycles and lunar wisdom.",
  "You are a modern spiritual guide who bridges ancient tarot wisdom with contemporary life challenges.",
  "You are a grandmother-witch whose tarot readings reveal practical magic and earthly wisdom."
];

// Question-type specific approaches
const questionTypeAnalysis = {
  career: "Focus on professional growth, leadership, creative expression, and life purpose.",
  love: "Emphasize emotional connections, self-love, relationships, and heart wisdom.", 
  spiritual: "Dive deep into spiritual awakening, intuition, soul purpose, and divine guidance.",
  general: "Provide holistic guidance covering multiple life aspects and personal evolution.",
  decision: "Offer clarity on choices, timing, and the consequences of different paths."
};

function analyzeQuestionType(question: string): keyof typeof questionTypeAnalysis {
  const q = question.toLowerCase();
  
  if (q.includes('career') || q.includes('job') || q.includes('work') || q.includes('business') || q.includes('money') || q.includes('financial')) {
    return 'career';
  }
  if (q.includes('love') || q.includes('relationship') || q.includes('partner') || q.includes('romance') || q.includes('heart')) {
    return 'love';
  }
  if (q.includes('spiritual') || q.includes('soul') || q.includes('purpose') || q.includes('meditation') || q.includes('divine')) {
    return 'spiritual';
  }
  if (q.includes('should i') || q.includes('what if') || q.includes('choose') || q.includes('decision')) {
    return 'decision';
  }
  
  return 'general';
}

function getRandomPersonality(): string {
  return personalityPrompts[Math.floor(Math.random() * personalityPrompts.length)];
}

export function generateInitialReadingPrompt(question: string, cardName: string, cardKeywords: string[]): PromptTemplate {
  const personality = getRandomPersonality();
  const questionType = analyzeQuestionType(question);
  const focusArea = questionTypeAnalysis[questionType];
  
  const systemPrompt = `${personality}

You create deeply personalized tarot readings that feel authentic and meaningful. ${focusArea}

Your readings should:
- Feel personal and specific to the seeker's question
- Use evocative, mystical language without being overly dramatic
- Provide practical spiritual guidance alongside mystical insight
- Vary in tone and approach to feel fresh and unique
- Reference the card's symbolism in relation to their specific situation`;

  const userPrompt = `A seeker has drawn "${cardName}" for this question: "${question}"

The card's energy: ${cardKeywords.join(', ')}

Create a reading with these sections (write naturally, don't use section headers):

First, provide a 2-3 sentence INTERPRETATION of how this card specifically speaks to their question, weaving together the card's symbolism with their personal situation.

Then offer GUIDANCE - 2-3 sentences of practical spiritual advice on what they should consider or do based on this card's wisdom.

Next, describe the current ENERGY surrounding them in 1-2 mystical sentences that capture the spiritual atmosphere of their situation.

Finally, give a TIMEFRAME using mystical timing references for when this guidance may manifest or resolve.

Write as if you're sitting across from them, speaking directly to their heart. Make it feel personal and meaningful to their specific question about "${question}".`;

  return {
    system: systemPrompt,
    user: userPrompt
  };
}

export function generateFollowUpPrompt(context: FollowUpContext): PromptTemplate {
  const personality = getRandomPersonality();
  
  const systemPrompt = `${personality}

You are continuing a tarot reading conversation. Reference the previous reading naturally while providing new insights. Be conversational and intuitive, as if you're a trusted spiritual advisor who remembers the seeker's story.`;

  const userPrompt = `Continue our tarot conversation. Here's the context:

ORIGINAL QUESTION: "${context.originalQuestion}"
CARD DRAWN: ${context.cardName} (${context.cardMeaning})
PREVIOUS READING: "${context.previousInterpretation}"

NEW QUESTION: "${context.followUpQuestion}"

Respond naturally as if continuing our conversation. Reference the ${context.cardName} card and their original question about "${context.originalQuestion}" while addressing their new question. 

Provide 2-4 sentences of personalized insight that builds on what was already revealed. Be conversational, intuitive, and helpful - like a wise friend who truly understands their journey.`;

  return {
    system: systemPrompt,
    user: userPrompt
  };
}

// Generate varied chat responses for better personalization
export function generateChatVariants(): string[] {
  return [
    "I sense the energy of {cardName} continuing to work in your life. What aspect of this reading resonates most strongly with you?",
    "The wisdom of {cardName} has many layers. What part of your question about '{question}' would you like to explore more deeply?", 
    "I feel there's more the cards want to reveal about your path. What's stirring in your heart as you reflect on this reading?",
    "The mystical energies around {cardName} are still speaking. Is there a particular aspect of '{question}' you'd like to delve into further?",
    "Your {cardName} reading holds deeper mysteries. What would you like to understand better about this guidance?",
    "I can sense the {cardName} energy resonating with your soul. What questions arise as you contemplate this message?",
    "The universe rarely speaks in simple terms. What part of this {cardName} reading calls for deeper exploration?"
  ];
} 