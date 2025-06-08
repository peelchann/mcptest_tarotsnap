'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { MysticalParticles } from './components/ui/MysticalParticles';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './providers/AuthProvider';
import { 
  Sparkles, 
  Moon, 
  Stars, 
  Eye, 
  Heart, 
  ArrowRight,
  MessageCircle,
  Zap,
  Crown,
  User,
  LogIn,
  Settings
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const floatingCardVariants = {
  float: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const features = [
  {
    icon: Eye,
    title: "Divine Insights",
    description: "Gain profound insights into your life's path through ancient tarot wisdom"
  },
  {
    icon: MessageCircle,
    title: "Memory-Powered AI",
    description: "Our AI remembers your journey and provides increasingly personalized guidance"
  },
  {
    icon: Zap,
    title: "Instant Wisdom",
    description: "Get immediate, contextual readings that build upon your spiritual evolution"
  }
];

// Component that uses useSearchParams - needs to be wrapped in Suspense
function AuthChecker({ 
  setAuthMode, 
  setAuthModalOpen, 
  user, 
  loading 
}: {
  setAuthMode: (mode: 'login' | 'signup') => void;
  setAuthModalOpen: (open: boolean) => void;
  user: any;
  loading: boolean;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const authRequired = searchParams.get('auth') === 'required';
    if (authRequired && !user && !loading) {
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  }, [searchParams, user, loading, setAuthMode, setAuthModalOpen]);

  return null;
}

// Floating Tarot Cards Component
function FloatingTarotCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Card 1 */}
      <motion.div
        variants={floatingCardVariants}
        animate="float"
        className="absolute top-20 left-10 w-16 h-24 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-2xl border border-gold-500/30"
        style={{ transform: 'perspective(1000px) rotateY(15deg)' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <Stars className="w-6 h-6 text-gold-400" />
        </div>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        variants={floatingCardVariants}
        animate="float"
        className="absolute top-32 right-16 w-16 h-24 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg shadow-2xl border border-gold-500/30"
        style={{ transform: 'perspective(1000px) rotateY(-15deg)', animationDelay: '2s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <Moon className="w-6 h-6 text-gold-400" />
        </div>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        variants={floatingCardVariants}
        animate="float"
        className="absolute bottom-32 left-20 w-16 h-24 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-2xl border border-gold-500/30"
        style={{ transform: 'perspective(1000px) rotateY(10deg)', animationDelay: '4s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <Eye className="w-6 h-6 text-gold-400" />
        </div>
      </motion.div>

      {/* Card 4 */}
      <motion.div
        variants={floatingCardVariants}
        animate="float"
        className="absolute bottom-20 right-24 w-16 h-24 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg shadow-2xl border border-gold-500/30"
        style={{ transform: 'perspective(1000px) rotateY(-10deg)', animationDelay: '1s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-gold-400" />
        </div>
      </motion.div>

      {/* Card 5 */}
      <motion.div
        variants={floatingCardVariants}
        animate="float"
        className="absolute top-1/2 left-4 w-16 h-24 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-2xl border border-gold-500/30"
        style={{ transform: 'perspective(1000px) rotateY(20deg)', animationDelay: '3s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-gold-400" />
        </div>
      </motion.div>

      {/* Card 6 */}
      <motion.div
        variants={floatingCardVariants}
        animate="float"
        className="absolute top-1/2 right-4 w-16 h-24 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg shadow-2xl border border-gold-500/30"
        style={{ transform: 'perspective(1000px) rotateY(-20deg)', animationDelay: '5s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <Crown className="w-6 h-6 text-gold-400" />
        </div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const handleStartReading = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Store the question in session storage
    if (question.trim()) {
      sessionStorage.setItem('tarot-question', question.trim());
    }
    
    // Navigate to single card reading
    setTimeout(() => {
      router.push('/reading/single');
    }, 1000);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    // If user just signed up/logged in, redirect to dashboard
    router.push('/dashboard');
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingTarotCards />
      <MysticalParticles />
      
      {/* Header */}
      <div className="relative z-20 container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-accent" />
            <span className="text-accent font-semibold text-lg">TarotSnap</span>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-white/80 text-sm">
                  Welcome, {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="text-white hover:text-gold-300 hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal('signup')}
                  className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Centered Hero Section */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 text-center"
        >
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.div 
              className="inline-flex items-center gap-3 mb-8 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-gold-500/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Crown className="w-8 h-8 text-gold-500 animate-pulse" />
              <span className="text-gold-500 font-semibold text-xl">TarotSnap</span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-br from-gold-400 via-gold-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(200,173,127,0.7)]"
              variants={itemVariants}
            >
              Your Spiritual Advisor
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Who Remembers Your Journey
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Experience tarot readings that build upon your past, understand your growth, 
              and guide your future with AI-powered memory that evolves with you.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
              variants={itemVariants}
            >
              <Button 
                size="xl"
                className="bg-gradient-to-r from-gold-500 via-amber-500 to-orange-500 hover:from-gold-600 hover:via-amber-600 hover:to-orange-600 text-black font-bold px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-gold-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Begin Your Spiritual Journey
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">1,247 souls guided today</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center gap-8 text-gray-400"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Eye className="w-5 h-5 text-gold-500" />
                <span className="text-sm">Remembers Your Path</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart className="w-5 h-5 text-purple-400" />
                <span className="text-sm">Builds Relationships</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Stars className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Evolving Wisdom</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16 relative z-10"
      >

        {/* Memory Features Showcase */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gold-400 to-amber-400 bg-clip-text text-transparent">
            Your Spiritual Journey, Remembered
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Unlike one-off readings, TarotSnap builds a deep understanding of your unique path, 
            offering increasingly personalized guidance as your relationship grows.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="group"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-gold-500/20 rounded-2xl p-8 h-full hover:border-gold-500/40 transition-all duration-300">
                  <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-br from-gold-500/20 to-amber-500/20 w-fit group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gold-400">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div 
          variants={itemVariants}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-xl border border-gold-500/30 rounded-3xl p-12 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gold-400 to-amber-400 bg-clip-text text-transparent">
                Ready to Begin?
              </h3>
              <p className="text-gray-400 text-lg">
                Start your first reading and let TarotSnap begin learning your unique spiritual signature.
              </p>
            </div>
            
            <form onSubmit={handleStartReading} className="space-y-6">
              <Textarea
                placeholder="What guidance do you seek? (Optional - leave blank for a general reading)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px] bg-black/30 border-gold-500/30 focus:border-gold-500/60 text-white placeholder-gray-500 rounded-xl"
              />
              
              <Button 
                type="submit" 
                size="xl"
                className="w-full bg-gradient-to-r from-gold-500 via-amber-500 to-orange-500 hover:from-gold-600 hover:via-amber-600 hover:to-orange-600 text-black font-bold py-4 text-lg rounded-xl shadow-2xl hover:shadow-gold-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Preparing Your Reading...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Draw Your First Card
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 mb-8">Trusted by spiritual seekers worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">15K+</div>
                <div className="text-sm text-gray-400">Souls Guided</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">89%</div>
                <div className="text-sm text-gray-400">Return Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">4.9★</div>
                <div className="text-sm text-gray-400">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={handleAuthSuccess}
      />
      
      {/* Auth checker with Suspense boundary */}
      <Suspense fallback={null}>
        <AuthChecker
          setAuthMode={setAuthMode}
          setAuthModalOpen={setAuthModalOpen}
          user={user}
          loading={loading}
        />
      </Suspense>
    </div>
  );
}
