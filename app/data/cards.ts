export interface TarotCard {
  id: string;
  name: string;
  number: number | string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
  };
  isReversed?: boolean;
  imagePath?: string; // Path to the card image
}

// Sample of major arcana cards
export const cards: TarotCard[] = [
  {
    id: 'the-fool',
    name: 'The Fool',
    number: 0,
    arcana: 'major',
    keywords: ['beginnings', 'innocence', 'adventure'],
    meaning: {
      upright: 'New beginnings, innocence, spontaneity, free spirit',
      reversed: 'Recklessness, taken advantage of, inconsideration'
    },
    imagePath: '/images/tarot/the-fool.jpg'
  },
  {
    id: 'the-magician',
    name: 'The Magician',
    number: 1,
    arcana: 'major',
    keywords: ['manifestation', 'power', 'action'],
    meaning: {
      upright: 'Manifestation, resourcefulness, power, inspired action',
      reversed: 'Manipulation, poor planning, untapped talents'
    },
    imagePath: '/images/tarot/the-magician.jpg'
  },
  {
    id: 'the-high-priestess',
    name: 'The High Priestess',
    number: 2,
    arcana: 'major',
    keywords: ['intuition', 'unconscious', 'inner voice'],
    meaning: {
      upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind',
      reversed: 'Secrets, disconnected from intuition, withdrawal and silence'
    },
    imagePath: '/images/tarot/the-high-priestess.jpg'
  },
  {
    id: 'the-empress',
    name: 'The Empress',
    number: 3,
    arcana: 'major',
    keywords: ['femininity', 'beauty', 'nature'],
    meaning: {
      upright: 'Femininity, beauty, nature, nurturing, abundance',
      reversed: 'Creative block, dependence on others, emptiness'
    },
    imagePath: '/images/tarot/the-empress.jpg'
  },
  {
    id: 'the-emperor',
    name: 'The Emperor',
    number: 4,
    arcana: 'major',
    keywords: ['authority', 'structure', 'control'],
    meaning: {
      upright: 'Authority, establishment, structure, paternal figure',
      reversed: 'Domination, excessive control, rigidity, stubbornness'
    },
    imagePath: '/images/tarot/the-emperor.jpg'
  },
  {
    id: 'the-hierophant',
    name: 'The Hierophant',
    number: 5,
    arcana: 'major',
    keywords: ['tradition', 'conformity', 'morality'],
    meaning: {
      upright: 'Spiritual wisdom, tradition, conformity, morality',
      reversed: 'Personal beliefs, freedom, challenging the status quo'
    },
    imagePath: '/images/tarot/the-hierophant.jpg'
  },
  {
    id: 'the-lovers',
    name: 'The Lovers',
    number: 6,
    arcana: 'major',
    keywords: ['love', 'harmony', 'partnerships'],
    meaning: {
      upright: 'Love, harmony, relationships, value alignment, choices',
      reversed: 'Self-love, disharmony, imbalance, misalignment of values'
    },
    imagePath: '/images/tarot/the-lovers.jpg'
  },
  {
    id: 'the-chariot',
    name: 'The Chariot',
    number: 7,
    arcana: 'major',
    keywords: ['control', 'willpower', 'success'],
    meaning: {
      upright: 'Control, willpower, success, action, determination',
      reversed: 'Self-discipline, opposition, lack of direction'
    },
    imagePath: '/images/tarot/the-chariot.jpg'
  },
  {
    id: 'strength',
    name: 'Strength',
    number: 8,
    arcana: 'major',
    keywords: ['courage', 'patience', 'compassion'],
    meaning: {
      upright: 'Courage, persuasion, influence, compassion, inner strength',
      reversed: 'Self-doubt, weakness, insecurity, low energy'
    }
  },
  {
    id: 'the-hermit',
    name: 'The Hermit',
    number: 9,
    arcana: 'major',
    keywords: ['introspection', 'solitude', 'wisdom'],
    meaning: {
      upright: 'Soul-searching, introspection, solitude, inner guidance',
      reversed: 'Isolation, withdrawal, lost your way, rejection'
    }
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    number: 10,
    arcana: 'major',
    keywords: ['change', 'cycles', 'fate'],
    meaning: {
      upright: 'Good luck, karma, life cycles, destiny, turning point',
      reversed: 'Bad luck, resistance to change, breaking cycles'
    }
  },
  {
    id: 'justice',
    name: 'Justice',
    number: 11,
    arcana: 'major',
    keywords: ['fairness', 'truth', 'law'],
    meaning: {
      upright: 'Justice, fairness, truth, cause and effect, law',
      reversed: 'Unfairness, lack of accountability, dishonesty'
    }
  },
  {
    id: 'the-hanged-man',
    name: 'The Hanged Man',
    number: 12,
    arcana: 'major',
    keywords: ['surrender', 'suspension', 'perspective'],
    meaning: {
      upright: 'Pause, surrender, letting go, new perspectives',
      reversed: 'Delays, resistance, stalling, indecision'
    }
  },
  {
    id: 'death',
    name: 'Death',
    number: 13,
    arcana: 'major',
    keywords: ['transformation', 'endings', 'change'],
    meaning: {
      upright: 'End of cycle, beginnings, change, metamorphosis',
      reversed: 'Fear of change, holding on, stagnation, decay'
    }
  },
  {
    id: 'temperance',
    name: 'Temperance',
    number: 14,
    arcana: 'major',
    keywords: ['balance', 'moderation', 'patience'],
    meaning: {
      upright: 'Balance, moderation, patience, purpose',
      reversed: 'Imbalance, excess, self-healing, realignment'
    }
  },
  {
    id: 'the-devil',
    name: 'The Devil',
    number: 15,
    arcana: 'major',
    keywords: ['bondage', 'addiction', 'materialism'],
    meaning: {
      upright: 'Shadow self, attachment, addiction, restriction',
      reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment'
    }
  },
  {
    id: 'the-tower',
    name: 'The Tower',
    number: 16,
    arcana: 'major',
    keywords: ['sudden change', 'upheaval', 'chaos'],
    meaning: {
      upright: 'Sudden change, upheaval, chaos, revelation, awakening',
      reversed: 'Fear of change, avoiding disaster, a narrow escape'
    }
  },
  {
    id: 'the-star',
    name: 'The Star',
    number: 17,
    arcana: 'major',
    keywords: ['hope', 'faith', 'renewal'],
    meaning: {
      upright: 'Hope, faith, purpose, renewal, spirituality',
      reversed: 'Lack of faith, despair, discouragement, insecurity'
    }
  },
  {
    id: 'the-moon',
    name: 'The Moon',
    number: 18,
    arcana: 'major',
    keywords: ['illusion', 'intuition', 'subconscious'],
    meaning: {
      upright: 'Illusion, fear, anxiety, subconscious, intuition',
      reversed: 'Release of fear, repressed emotions, inner confusion'
    }
  },
  {
    id: 'the-sun',
    name: 'The Sun',
    number: 19,
    arcana: 'major',
    keywords: ['joy', 'success', 'celebration'],
    meaning: {
      upright: 'Joy, success, celebration, positivity, vitality',
      reversed: 'Inner child, feeling down, overly optimistic'
    }
  },
  {
    id: 'judgement',
    name: 'Judgement',
    number: 20,
    arcana: 'major',
    keywords: ['rebirth', 'inner calling', 'absolution'],
    meaning: {
      upright: 'Judgment, rebirth, inner calling, absolution',
      reversed: 'Self-doubt, refusal of self-examination, self-loathing'
    }
  },
  {
    id: 'the-world',
    name: 'The World',
    number: 21,
    arcana: 'major',
    keywords: ['completion', 'achievement', 'travel'],
    meaning: {
      upright: 'Completion, integration, accomplishment, travel',
      reversed: 'Seeking personal closure, short-cuts, delays'
    }
  }
];

// Function to get a random card
export const getRandomCard = (): TarotCard => {
  const cardIndex = Math.floor(Math.random() * cards.length);
  const card = { ...cards[cardIndex] };
  card.isReversed = Math.random() > 0.7;
  
  // Ensure there's always an image path
  if (!card.imagePath) {
    card.imagePath = `/images/tarot/${card.id}.jpg`;
  }
  
  return card;
};

// Function to get multiple random cards without duplicates
export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  const result: TarotCard[] = [];
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const card = { ...shuffled[i] };
    card.isReversed = Math.random() > 0.7;
    
    // Ensure there's always an image path
    if (!card.imagePath) {
      card.imagePath = `/images/tarot/${card.id}.jpg`;
    }
    
    result.push(card);
  }
  
  return result;
}; 