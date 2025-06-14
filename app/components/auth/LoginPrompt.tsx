'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { AuthModal } from './AuthModal';
import { 
  MessageCircle, 
  Heart, 
  Sparkles, 
  Shield,
  Cloud,
  Smartphone
} from 'lucide-react';

interface LoginPromptProps {
  onContinueWithoutLogin: () => void;
  onLoginSuccess: () => void;
  cardName?: string;
  context?: 'chat' | 'reading' | 'general';
}

export function LoginPrompt({ 
  onContinueWithoutLogin, 
  onLoginSuccess, 
  cardName,
  context = 'chat'
}: LoginPromptProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onLoginSuccess();
  };

  const getContextualMessage = () => {
    switch (context) {
      case 'chat':
        return {
          title: "Continue Your Spiritual Journey",
          description: `Ready to dive deeper into your ${cardName || 'reading'}? Create an account to unlock the full power of our remembering reader.`,
          icon: MessageCircle
        };
      case 'reading':
        return {
          title: "Save Your Reading Forever",
          description: "Create an account to build your personal tarot journey and receive insights that grow with you over time.",
          icon: Heart
        };
      default:
        return {
          title: "Unlock Your Personal Tarot Journey",
          description: "Create an account to access memory features and personalized guidance.",
          icon: Sparkles
        };
    }
  };

  const contextInfo = getContextualMessage();
  const Icon = contextInfo.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-gold/20 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="text-xl text-gold font-cinzel">
              {contextInfo.title}
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm leading-relaxed">
              {contextInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Cloud className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Save your readings and chat history forever</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Smartphone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Access your journey from any device</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Heart className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Receive personalized insights that grow with you</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Shield className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Your data is private and secure</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-slate-900 font-medium transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Account & Continue
              </Button>
              
              <Button
                onClick={onContinueWithoutLogin}
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 text-sm"
              >
                Continue without saving
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              We respect your privacy. Your readings and conversations are encrypted and only accessible to you.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
} 