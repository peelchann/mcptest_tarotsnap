'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/providers/AuthProvider';
import { AuthModal } from './auth/AuthModal';
import { User, LogOut, Sparkles } from 'lucide-react';

export function MysticalHeader() {
  const { user, profile, signOut, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileDropdownOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  // Don't render during loading to avoid flash
  if (loading) {
    return (
      <div className="fixed top-0 right-0 z-40 p-6">
        <div className="flex items-center gap-3">
          <div className="w-20 h-10 bg-white/5 rounded-full animate-pulse" />
          <div className="w-20 h-10 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="fixed top-0 right-0 z-40 p-6"
      >
        <div className="flex items-center gap-3">
          {user ? (
            // Authenticated User UI
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="group flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-md border border-amber-400/30 rounded-full text-amber-300 hover:border-amber-400/60 hover:bg-gradient-to-r hover:from-slate-900/90 hover:to-blue-900/90 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-900" />
                </div>
                <span className="text-sm font-medium">
                  {profile?.full_name?.split(' ')[0] || 'Mystic'}
                </span>
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </motion.button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-md border border-amber-400/30 rounded-xl shadow-2xl shadow-amber-500/10"
                >
                  <div className="p-4 space-y-3">
                    <div className="border-b border-amber-400/20 pb-3">
                      <p className="text-amber-300 font-medium text-sm">
                        {profile?.full_name || 'Welcome, Mystic'}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {user.email}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Anonymous User UI
            <>
              {/* Login Button */}
              <motion.button
                onClick={() => handleAuthClick('login')}
                className="group relative px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-amber-400/40 rounded-full text-amber-300 hover:border-amber-400/70 hover:bg-slate-900/80 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 text-sm font-medium">Log In</span>
                
                {/* Subtle shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </motion.button>

              {/* Signup Button */}
              <motion.button
                onClick={() => handleAuthClick('signup')}
                className="group relative px-4 py-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 rounded-full text-slate-900 font-medium hover:from-amber-500 hover:via-yellow-400 hover:to-orange-400 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 32px -8px rgba(245, 158, 11, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Sign Up
                </span>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </motion.button>
            </>
          )}
        </div>

        {/* Click away overlay for dropdown */}
        {isProfileDropdownOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsProfileDropdownOpen(false)}
          />
        )}
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
} 