import type { Metadata } from 'next'
import SingleCardReadingClient from './SingleCardReadingClient'

export const metadata: Metadata = {
  title: 'Single Card Tarot Reading',
  description: 'Get a quick single card reading for insight into your day or a specific question.',
  keywords: ['single card tarot', 'daily tarot', 'ai tarot reading'],
  openGraph: {
    title: 'Single Card Tarot Reading | TarotSnap',
    description: 'Receive personalized guidance from a single tarot card powered by AI.',
    url: '/reading/single'
  }
}

export default function SingleCardReadingPage() {
  return <SingleCardReadingClient />
}
