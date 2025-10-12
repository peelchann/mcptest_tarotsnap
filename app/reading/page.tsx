import type { Metadata } from 'next'
import ReadingPageClient from './ReadingPageClient'

export const metadata: Metadata = {
  title: 'Tarot Reading Options',
  description: 'Choose your preferred tarot spread with AI-powered insights from TarotSnap.',
  keywords: ['tarot spreads', 'ai tarot reading', 'single card', 'celtic cross'],
  openGraph: {
    title: 'Tarot Reading Options | TarotSnap',
    description: 'Select a tarot spread and begin your AI-powered reading.',
    url: '/reading'
  }
}

export default function ReadingPage() {
  return <ReadingPageClient />
}
