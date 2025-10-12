import React from 'react';
import { render, screen } from '@testing-library/react';
import TarotCard from '../TarotCard';
import { TarotCard as TarotCardType } from '../../data/cards';

// Mock the hooks that use canvas and animations
jest.mock('../CardUtils', () => ({
  useStarEffect: jest.fn(() => []),
  useMouseMoveEffect: jest.fn(() => ({
    cardRef: { current: null },
    handleMouseMove: jest.fn(),
    handleMouseLeave: jest.fn(),
  })),
  useSpotlightEffect: jest.fn(() => ({
    spotlightRef: { current: null },
    handleMouseMove: jest.fn(),
    spotlightStyle: {},
  })),
  CardImage: ({ card }: { card: TarotCardType }) => (
    <div data-testid="card-image">{card.name}</div>
  ),
}));


describe('TarotCard Component', () => {
  const mockCard: TarotCardType = {
    id: 'the-fool',
    name: 'The Fool',
    number: 0,
    arcana: 'major',
    keywords: ['beginnings', 'innocence', 'adventure'],
    meaning: {
      upright: 'New beginnings, innocence, spontaneity',
      reversed: 'Recklessness, taken advantage of',
    },
    imagePath: '/images/tarot/the-fool.jpg',
  };

  it('renders without crashing', () => {
    render(<TarotCard card={mockCard} />);
    
    // Basic smoke test - just verify the card name is in the document
    expect(screen.getByTestId('card-image')).toBeInTheDocument();
  });

  it('displays the card name', () => {
    render(<TarotCard card={mockCard} />);
    expect(screen.getAllByText('The Fool').length).toBeGreaterThan(0);
  });

  it('handles reversed state correctly', () => {
    render(<TarotCard card={mockCard} isReversed={true} />);
    // In a full test, we would check for rotation classes
    expect(document.querySelector('.rotate-180')).toBeTruthy();
  });

  it('handles flipped state correctly', () => {
    render(<TarotCard card={mockCard} isFlipped={true} />);
    expect(screen.getByTestId('card-image')).toBeInTheDocument();
  });
}); 