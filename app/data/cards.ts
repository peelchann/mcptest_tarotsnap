export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number | string;
  image: string;
  keywords: string[];
  meaning: {
    upright: string;
    reversed: string;
  };
}

// Initial set of Major Arcana cards for our MVP
export const majorArcana: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    image: '/images/fool.jpg', // Placeholder - we'll add actual images later
    keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
    meaning: {
      upright: 'New beginnings, innocence, adventure, and potential',
      reversed: 'Recklessness, risk-taking, and inconsideration'
    }
  },
  {
    id: 'magician',
    name: 'The Magician',
    arcana: 'major',
    number: 1,
    image: '/images/magician.jpg',
    keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
    meaning: {
      upright: 'Manifestation, resourcefulness, and inspired action',
      reversed: 'Manipulation, poor planning, and untapped talents'
    }
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    arcana: 'major',
    number: 2,
    image: '/images/high-priestess.jpg',
    keywords: ['intuition', 'unconscious', 'divine feminine', 'inner voice'],
    meaning: {
      upright: 'Intuition, sacred knowledge, divine feminine, and inner wisdom',
      reversed: 'Secrets, disconnection from intuition, and withdrawal'
    }
  },
  {
    id: 'empress',
    name: 'The Empress',
    arcana: 'major',
    number: 3,
    image: '/images/empress.jpg',
    keywords: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
    meaning: {
      upright: 'Femininity, beauty, nature, nurturing, and abundance',
      reversed: 'Creative block, dependence on others, and emptiness'
    }
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    arcana: 'major',
    number: 4,
    image: '/images/emperor.jpg',
    keywords: ['authority', 'establishment', 'structure', 'father figure'],
    meaning: {
      upright: 'Authority, establishment, structure, and a father figure',
      reversed: 'Domination, excessive control, and lack of discipline'
    }
  },
  {
    id: 'hierophant',
    name: 'The Hierophant',
    arcana: 'major',
    number: 5,
    image: '/images/hierophant.jpg',
    keywords: ['spiritual wisdom', 'religious beliefs', 'conformity', 'tradition'],
    meaning: {
      upright: 'Spiritual wisdom, religious beliefs, conformity, and tradition',
      reversed: 'Personal beliefs, freedom, and challenging the status quo'
    }
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    arcana: 'major',
    number: 6,
    image: '/images/lovers.jpg',
    keywords: ['love', 'harmony', 'relationships', 'values alignment', 'choices'],
    meaning: {
      upright: 'Love, harmony, relationships, values alignment, and choices',
      reversed: 'Disharmony, imbalance, and misalignment of values'
    }
  },
  {
    id: 'chariot',
    name: 'The Chariot',
    arcana: 'major',
    number: 7,
    image: '/images/chariot.jpg',
    keywords: ['control', 'willpower', 'success', 'action', 'determination'],
    meaning: {
      upright: 'Control, willpower, success, action, and determination',
      reversed: 'Lack of control and direction, aggression, and defeat'
    }
  }
];

// Function to get a random card
export const getRandomCard = (): TarotCard => {
  const randomIndex = Math.floor(Math.random() * majorArcana.length);
  return majorArcana[randomIndex];
};

// Function to get multiple random cards without duplicates
export const getRandomCards = (count: number): TarotCard[] => {
  const cards = [...majorArcana];
  const result: TarotCard[] = [];
  
  // Shuffle array using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  // Return the requested number of cards
  return cards.slice(0, count);
}; 