'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { MysticalParticles } from './components/ui/MysticalParticles';
import { 
  Sparkles, 
  Moon, 
  Stars, 
  Eye, 
  Heart, 
  ArrowRight,
  MessageCircle,
  Zap,
  Crown
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

const features = [
  {
    icon: Eye,
    title: "Divine Insights",
    description: "Gain profound insights into your life's path through ancient tarot wisdom"
  },
  {
    icon: MessageCircle,
    title: "AI Guidance",
    description: "Chat with our mystical AI oracle for personalized interpretations"
  },
  {
    icon: Zap,
    title: "Instant Readings",
    description: "Get immediate, accurate readings whenever you need guidance"
  }
];

export default function HomePage() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MysticalParticles />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16 relative z-10"
      >
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Crown className="w-8 h-8 text-accent" />
            <span className="text-accent font-semibold text-lg">TarotSnap</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gold-400 drop-shadow-[0_2px_8px_rgba(200,173,127,0.5)]">
            Unlock the Mysteries
            <br />
            <span className="text-4xl md:text-6xl text-gold-400">of Your Future</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience the ancient art of tarot reading reimagined for the digital age. 
            Get instant insights, divine guidance, and chat with our mystical AI oracle.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Authentic Readings</span>
            </div>
            <div className="flex items-center gap-1">
              <Moon className="w-4 h-4 text-accent" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1">
              <Stars className="w-4 h-4 text-accent" />
              <span>Instant Guidance</span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card key={index} className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </motion.div>

        {/* Question Form */}
        <motion.div 
          variants={itemVariants}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-primary/30 bg-card/70 backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-accent" />
                Ask Your Question
              </CardTitle>
              <CardDescription className="text-base">
                Focus your intention and ask the universe for guidance. 
                What wisdom do you seek today?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartReading} className="space-y-6">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium mb-2">
                    Your Question (Optional)
                  </label>
                  <Textarea
                    id="question"
                    placeholder="What guidance do I need for my path ahead? What should I focus on today? How can I overcome my current challenges?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave blank for a general reading about your current energy
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  variant="mystical" 
                  size="xl"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Preparing Your Reading...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Draw Your Card
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-12">How TarotSnap Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold">Ask Your Question</h3>
              <p className="text-muted-foreground">
                Focus your intention and ask what guidance you seek from the universe
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold">Draw Your Card</h3>
              <p className="text-muted-foreground">
                Let intuition guide you as you select a card from our mystical deck
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold">Receive Insights</h3>
              <p className="text-muted-foreground">
                Get your reading and chat with our AI oracle for deeper understanding
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonial/Quote */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <Card className="max-w-3xl mx-auto border-accent/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <blockquote className="text-lg italic text-foreground/90 mb-4">
                "The future belongs to those who believe in the beauty of their dreams. 
                Let the ancient wisdom of tarot illuminate your path forward."
              </blockquote>
              <div className="flex items-center justify-center gap-1 text-accent">
                <Stars className="w-4 h-4" />
                <Stars className="w-4 h-4" />
                <Stars className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
