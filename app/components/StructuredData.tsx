'use client'

import Script from 'next/script'

interface StructuredDataProps {
  type?: 'homepage' | 'reading' | 'about'
  data?: any
}

export default function StructuredData({ type = 'homepage', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000'

    switch (type) {
      case 'homepage':
        return {
          "@context": "https://schema.org",
          "@type": ["WebSite", "Service"],
          "name": "TarotSnap",
          "alternateName": ["AI Tarot Readings", "TarotSnap AI"],
          "url": baseUrl,
          "description": "AI-powered tarot reading service providing personalized spiritual guidance through advanced artificial intelligence and ancient tarot wisdom.",
          "serviceType": "Tarot Reading Service",
          "provider": {
            "@type": "Organization",
            "name": "TarotSnap",
            "url": baseUrl,
            "logo": `${baseUrl}/tarot-og-image.jpg`,
            "sameAs": [
              "https://twitter.com/tarotsnap",
              "https://instagram.com/tarotsnap",
              "https://tiktok.com/@tarotsnap"
            ]
          },
          "offers": {
            "@type": "Offer",
            "name": "Free AI Tarot Reading",
            "description": "Get 3 free AI-powered tarot readings daily with personalized spiritual guidance",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString(),
            "category": "Spiritual Services"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Spiritual Seekers, Tarot Enthusiasts"
          },
          "keywords": [
            "tarot reading", "AI tarot", "spiritual guidance", "divination", 
            "free tarot reading", "online tarot", "mystical guidance"
          ],
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/reading/single?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }

      case 'reading':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "AI Tarot Reading",
          "url": `${baseUrl}/reading/single`,
          "description": "Get personalized AI tarot card reading with spiritual insights and guidance",
          "mainEntity": {
            "@type": "Service",
            "name": "AI Tarot Card Reading",
            "description": "Personalized tarot reading powered by artificial intelligence",
            "serviceType": "Spiritual Consultation",
            "category": "Divination Service"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tarot Reading",
                "item": `${baseUrl}/reading/single`
              }
            ]
          }
        }

      case 'about':
        return {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About TarotSnap",
          "url": `${baseUrl}/about`,
          "description": "Learn about TarotSnap's AI-powered tarot reading service and our mission to provide accessible spiritual guidance",
          "mainEntity": {
            "@type": "Organization",
            "name": "TarotSnap",
            "description": "AI-powered tarot reading platform combining ancient wisdom with modern technology",
            "foundingDate": "2024",
            "specialty": "AI Tarot Readings",
            "knowsAbout": [
              "Tarot Card Reading",
              "Spiritual Guidance", 
              "Artificial Intelligence",
              "Divination"
            ]
          }
        }

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      strategy="beforeInteractive"
    />
  )
} 