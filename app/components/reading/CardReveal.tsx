import { motion } from 'framer-motion';
import Image from 'next/image';
import { TarotReading } from '@/lib/openrouter';

interface CardRevealProps {
  reading: TarotReading;
  onContinue: () => void;
}

export function CardReveal({ reading, onContinue }: CardRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      {/* Card Image - Prominently Featured */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="relative w-64 h-96 mx-auto">
          {reading.imagePath ? (
            <Image
              src={reading.imagePath}
              alt={reading.card}
              fill
              className="object-cover rounded-xl shadow-2xl"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 rounded-xl flex items-center justify-center text-gold-400">
              <span className="text-6xl">🔮</span>
            </div>
          )}
          {/* Mystical glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-purple-900/20 via-transparent to-gold-400/20 shadow-2xl" />
        </div>
      </motion.div>

      {/* Card Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif"
      >
        {reading.card}
      </motion.h1>

      {/* Card Keywords */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-xl text-gold-300 mb-8 font-light tracking-wide"
      >
        {reading.meaning}
      </motion.p>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        onClick={onContinue}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        Reveal Your Reading
      </motion.button>
    </motion.div>
  );
} 