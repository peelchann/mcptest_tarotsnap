'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Heart, MessageCircle, TrendingUp, Lightbulb } from 'lucide-react'

interface PostReadingReflectionProps {
  sessionId: string
  onComplete: (feedback: {
    helpful: boolean
    accuracy_rating: number
    notes: string
    resonance_level: number
    emotional_state: {
      mood: string
      energy: string
      openness: string
      stress_level: number
    }
  }) => void
  onSkip: () => void
}

const moodOptions = [
  { value: 'peaceful', label: 'Peaceful', emoji: '😌' },
  { value: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { value: 'curious', label: 'Curious', emoji: '🤔' },
  { value: 'contemplative', label: 'Contemplative', emoji: '🧘‍♀️' },
  { value: 'anxious', label: 'Anxious', emoji: '😟' },
  { value: 'confused', label: 'Confused', emoji: '😕' },
  { value: 'excited', label: 'Excited', emoji: '✨' },
  { value: 'troubled', label: 'Troubled', emoji: '😔' }
]

const energyOptions = [
  { value: 'high', label: 'High Energy', emoji: '⚡' },
  { value: 'medium', label: 'Balanced', emoji: '🔄' },
  { value: 'low', label: 'Gentle', emoji: '🌙' }
]

const opennessOptions = [
  { value: 'very_open', label: 'Very Open', emoji: '🌸' },
  { value: 'open', label: 'Open', emoji: '🌿' },
  { value: 'neutral', label: 'Neutral', emoji: '🍃' },
  { value: 'guarded', label: 'Cautious', emoji: '🛡️' },
  { value: 'closed', label: 'Private', emoji: '🔒' }
]

export default function PostReadingReflection({ sessionId, onComplete, onSkip }: PostReadingReflectionProps) {
  const [step, setStep] = useState(1)
  const [feedback, setFeedback] = useState({
    helpful: true,
    accuracy_rating: 4,
    notes: '',
    resonance_level: 4,
    emotional_state: {
      mood: 'peaceful',
      energy: 'medium',
      openness: 'open',
      stress_level: 3
    }
  })

  const handleSubmit = () => {
    onComplete(feedback)
  }

  const updateEmotionalState = (key: string, value: string | number) => {
    setFeedback(prev => ({
      ...prev,
      emotional_state: {
        ...prev.emotional_state,
        [key]: value
      }
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-purple-900/20 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <h3 className="text-xl font-semibold text-white">Reading Reflection</h3>
        </div>
        <p className="text-purple-200 text-sm">
          Help me remember your journey by sharing how this reading felt
        </p>
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-pink-400' : 'bg-purple-500/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="flex items-center gap-2 text-white font-medium mb-4">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                How are you feeling right now?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => updateEmotionalState('mood', mood.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      feedback.emotional_state.mood === mood.value
                        ? 'border-pink-400 bg-pink-400/20 text-white'
                        : 'border-purple-500/30 hover:border-purple-400 text-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3">
                Your current stress level: {feedback.emotional_state.stress_level}/10
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedback.emotional_state.stress_level}
                  onChange={(e) => updateEmotionalState('stress_level', parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${feedback.emotional_state.stress_level * 10}%, rgba(168, 85, 247, 0.3) ${feedback.emotional_state.stress_level * 10}%, rgba(168, 85, 247, 0.3) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-purple-300 mt-1">
                  <span>Calm</span>
                  <span>Stressed</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onSkip}
                className="flex-1 py-3 px-4 rounded-xl border border-purple-500/30 text-purple-200 hover:border-purple-400 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-white font-medium mb-4">
                Your energy level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {energyOptions.map((energy) => (
                  <button
                    key={energy.value}
                    onClick={() => updateEmotionalState('energy', energy.value)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      feedback.emotional_state.energy === energy.value
                        ? 'border-pink-400 bg-pink-400/20 text-white'
                        : 'border-purple-500/30 hover:border-purple-400 text-purple-200'
                    }`}
                  >
                    <div className="text-lg mb-1">{energy.emoji}</div>
                    <div className="text-sm font-medium">{energy.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                How open do you feel to spiritual guidance?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {opennessOptions.map((openness) => (
                  <button
                    key={openness.value}
                    onClick={() => updateEmotionalState('openness', openness.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      feedback.emotional_state.openness === openness.value
                        ? 'border-pink-400 bg-pink-400/20 text-white'
                        : 'border-purple-500/30 hover:border-purple-400 text-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{openness.emoji}</span>
                      <span className="text-sm font-medium">{openness.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-purple-500/30 text-purple-200 hover:border-purple-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="flex items-center gap-2 text-white font-medium mb-4">
                <Star className="w-4 h-4 text-pink-400" />
                How accurate did this reading feel?
              </label>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback(prev => ({ ...prev, accuracy_rating: star }))}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= feedback.accuracy_rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-purple-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-purple-200 text-sm">
                {feedback.accuracy_rating}/5 stars
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-medium mb-4">
                <Lightbulb className="w-4 h-4 text-pink-400" />
                How much did this reading resonate with you?
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={feedback.resonance_level}
                  onChange={(e) => setFeedback(prev => ({ ...prev, resonance_level: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${feedback.resonance_level * 20}%, rgba(168, 85, 247, 0.3) ${feedback.resonance_level * 20}%, rgba(168, 85, 247, 0.3) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-purple-300 mt-1">
                  <span>Not much</span>
                  <span>Deeply</span>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-medium mb-3">
                <MessageCircle className="w-4 h-4 text-pink-400" />
                Any additional thoughts? (Optional)
              </label>
              <textarea
                value={feedback.notes}
                onChange={(e) => setFeedback(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Share any insights, questions, or feelings about this reading..."
                className="w-full p-3 rounded-xl bg-purple-900/30 border border-purple-500/30 text-white placeholder-purple-300 focus:border-pink-400 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl border border-purple-500/30 text-purple-200 hover:border-purple-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Complete Reflection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </motion.div>
  )
} 