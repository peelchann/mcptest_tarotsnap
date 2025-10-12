'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/app/providers/AuthProvider';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.fullName
    );

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="border-green-400/50 bg-green-900/20 backdrop-blur-md">
          <CardContent className="p-8 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            </motion.div>
            <h3 className="text-xl font-bold text-white">Welcome to the Mystical Realm!</h3>
            <p className="text-white/80">
              Please check your email to verify your account before continuing your tarot journey.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-white/30 bg-white/10 backdrop-blur-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-black" />
            </div>
          </motion.div>
          
          <CardTitle className="text-2xl font-bold text-white">
            Begin Your Mystical Journey
          </CardTitle>
          <CardDescription className="text-white/80">
            Create an account to unlock unlimited readings and personalized insights
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-400/50"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-purple-200 font-medium">
                Display Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/70" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your mystical name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10 bg-purple-900/80 border-purple-400/50 text-purple-100 placeholder:text-purple-300/70 focus:bg-purple-900/90 focus:border-purple-300 transition-all duration-200 min-h-[48px] touch-manipulation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-purple-900/80 border-purple-400/50 text-purple-100 placeholder:text-purple-300/70 focus:bg-purple-900/90 focus:border-purple-300 transition-all duration-200 min-h-[48px] touch-manipulation"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/70" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong mystical password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-12 bg-purple-900/80 border-purple-400/50 text-purple-100 placeholder:text-purple-300/70 focus:bg-purple-900/90 focus:border-purple-300 transition-all duration-200 min-h-[48px] touch-manipulation"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/70 hover:text-purple-200 w-6 h-6 flex items-center justify-center touch-manipulation"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/90 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your mystical password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-slate-800/90 border-white/30 text-slate-200 placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.fullName || !formData.email || !formData.password || !formData.confirmPassword}
              className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating your mystical account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </div>
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70">Already have an account?</span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={onSwitchToLogin}
              className="w-full text-purple-400 hover:text-purple-300 hover:bg-white/10 border border-purple-400/30 hover:border-purple-300/50 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sign In to Your Account
            </Button>

            <p className="text-xs text-white/50 leading-relaxed">
              By creating an account, you agree to our mystical terms of service and privacy policy.
              Your spiritual journey and data are sacred to us.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 