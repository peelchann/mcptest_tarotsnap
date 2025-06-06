'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogOverlay } from '@/app/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { MysticalParticles } from '@/app/components/ui/MysticalParticles';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background particles for mystical effect */}
        <div className="absolute inset-0 opacity-30">
          <MysticalParticles />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md mx-auto z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm 
                  onSuccess={handleSuccess}
                  onSwitchToSignup={handleSwitchMode}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupForm 
                  onSuccess={handleSuccess}
                  onSwitchToLogin={handleSwitchMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 