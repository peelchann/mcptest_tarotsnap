import { motion } from 'framer-motion';
import { TarotReading } from '@/lib/openrouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Sparkles, Heart, Clock, Compass } from 'lucide-react';

interface ReadingInterpretationProps {
  reading: TarotReading;
  question: string;
}

export function ReadingInterpretation({ reading, question }: ReadingInterpretationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Question Context */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Your Question
        </h3>
        <p className="text-gray-700 text-lg italic">&quot;{question}&quot;</p>
      </motion.div>

      {/* Main Interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-lg border-purple-400/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Your Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed text-lg">
              {reading.interpretation || "The cards speak of transformation and new beginnings. Trust in the journey ahead and embrace the changes that are coming your way."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guidance Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-lg border-indigo-400/30 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-indigo-300 flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">
                {reading.guidance || "Trust your intuition and let your inner wisdom guide you forward. The path ahead is illuminated by your authentic choices."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Energy & Timing */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm shadow-lg border-emerald-400/30 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-emerald-300 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Timing & Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed">
                {reading.timeframe || "The energies surrounding this guidance are building momentum. Remain open to opportunities that align with your highest good."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 