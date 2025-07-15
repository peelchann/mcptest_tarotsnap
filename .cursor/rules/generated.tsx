// It's recommended to add this to your index.html head for the custom fonts:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
// SCRIPT-MARKER:START:IMPORTS
import React from 'react';
// SCRIPT-MARKER:END:IMPORTS

// SCRIPT-MARKER:START:HandIcon
const HandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 mr-2"
  >
    <path d="M18 15V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1.17a2 2 0 0 1 1.42.59l2.82 2.82a2 2 0 0 0 2.83 0l2.82-2.82a2 2 0 0 1 1.42-.59H18Z" />
    <path d="M12 12V6" />
    <path d="M12 18v-2" />
  </svg>
);
// SCRIPT-MARKER:END:HandIcon

// SCRIPT-MARKER:START:HomePage
export default function HomePage() {
  // --- Asset URLs ---
  const assets = {
    planet1: 'https://i.imgur.com/9CIsncs.png',
    planet2: 'https://i.imgur.com/b5i6m3C.png',
    phoneMockup1: 'https://i.imgur.com/8aCmC6j.png',
    phoneMockup2: 'https://i.imgur.com/Oq1q6mZ.png',
    phoneMockup3: 'https://i.imgur.com/kS5A4XE.png',
    moonIllustration: 'https://i.imgur.com/gSDBa5M.png',
    stardustTexture: 'https://www.transparenttextures.com/patterns/stardust.png',
  };

  // --- Style Objects ---
  const customStyles = {
    fontLora: { fontFamily: "'Lora', serif" },
    fontPoppins: { fontFamily: "'Poppins', sans-serif" },
    stardustBackground: {
      backgroundImage: `url(${assets.stardustTexture})`,
    },
  };

  return (
    <div
      style={customStyles.fontPoppins}
      className="relative min-h-screen bg-gradient-to-b from-[#2a1a4c] to-[#1a0f2a] text-white overflow-x-hidden"
    >
      {/* Stardust background overlay */}
      <div
        style={customStyles.stardustBackground}
        className="absolute inset-0 w-full h-full opacity-30 z-0"
      ></div>

      {/* Floating Planets */}
      <img src={assets.planet1} alt="Planet" className="absolute top-[5%] left-[5%] w-10 md:w-16 z-10 animate-pulse" />
      <img src={assets.planet2} alt="Planet" className="absolute top-[10%] right-[8%] w-14 md:w-20 z-10 animate-pulse" />

      {/* Main content container */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Status Bar */}
        <div className="w-full px-5 py-2 text-sm font-medium text-gray-300 flex justify-between items-center">
          <span>9:41</span>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 4h3v16h-3V4zM5 14h3v6H5v-6zm6-5h3v11h-3V9z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.903 3.097a.999.999 0 0 0-1.413 0L3.097 18.49a.999.999 0 1 0 1.413 1.413L19.903 4.51a.999.999 0 0 0 0-1.413zM21 19V5h-2v14h2z"/></svg>
          </div>
        </div>

        {/* Header */}
        <header className="py-5">
          <h1 style={customStyles.fontLora} className="text-2xl font-bold tracking-[0.2em] text-[#f0e68c]">
            TAROTOO
          </h1>
        </header>

        {/* Main Content */}
        <main className="px-8 pb-40 text-center">
          {/* Hero Section */}
          <section className="mt-5 mb-20 flex flex-col items-center">
            <img src={assets.phoneMockup1} alt="App on phone showing The Sun tarot card" className="w-full max-w-xs mb-10" />
            <h2 style={customStyles.fontLora} className="text-3xl md:text-4xl leading-tight mb-4">
              Discover Yourself,<br />Find Your Own Path
            </h2>
            <p className="text-base font-light text-gray-300 max-w-sm">
              Unlock the secrets of your life with our AI-powered tarot readings.
            </p>
          </section>

          {/* Feature 1: Daily Guidance */}
          <section className="mb-20 flex flex-col items-center">
            <img src={assets.phoneMockup2} alt="App showing daily guidance" className="w-full max-w-[280px] mb-8" />
            <h3 style={customStyles.fontLora} className="text-2xl font-bold mb-3">
              Daily Guidance
            </h3>
            <p className="text-sm font-light text-gray-300 max-w-xs">
              Start your day with a personalized tarot card reading for insight and clarity.
            </p>
          </section>

          {/* Feature 2: Personalized Readings */}
          <section className="mb-20 flex flex-col items-center">
            <img src={assets.moonIllustration} alt="Illustration of person on the a moon" className="w-full max-w-[250px] mb-8" />
            <h3 style={customStyles.fontLora} className="text-2xl font-bold mb-3">
              Personalized Readings
            </h3>
            <p className="text-sm font-light text-gray-300 max-w-xs">
              Get in-depth answers to your questions about love, career, and more.
            </p>
          </section>

          {/* Feature 3: Mockup Only */}
          <section className="mb-20 flex flex-col items-center">
            <img src={assets.phoneMockup3} alt="App showing reading types" className="w-full max-w-[280px]" />
          </section>
        </main>
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 pt-20 pb-8 px-8 bg-gradient-to-t from-[#1a0f2a] via-[#1a0f2a] to-transparent">
        <div className="flex flex-col items-center">
          <button className="flex items-center justify-center w-52 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-300 text-white text-lg font-medium shadow-[0_4px_15px_rgba(138,43,226,0.4)] transition-transform hover:scale-105">
            <HandIcon />
            Try for Free
          </button>
          <div className="mt-4 text-xs text-gray-400">
            <a href="#terms" className="underline">Terms of Service</a> & <a href="#privacy" className="underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
// SCRIPT-MARKER:END:HomePage
