'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { MysticalParticles } from '@/app/components/ui/MysticalParticles';
import { 
  User, 
  Settings, 
  History, 
  Star, 
  LogOut, 
  Sparkles, 
  Crown,
  Calendar,
  ArrowLeft
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/');
    }
  }, [user, loading, router, mounted]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="opacity-30">
          <MysticalParticles />
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/80">Loading your mystical realm...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="opacity-30">
        <MysticalParticles />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white hover:text-gold-300 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Readings
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white">Mystical Dashboard</h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-white hover:text-red-300 hover:bg-white/10 border-white/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-white/30 bg-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">
                    Welcome back, {profile?.full_name || user.email?.split('@')[0]}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Your spiritual journey continues...
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {profile?.subscription_tier === 'premium' ? (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/50">
                      <Crown className="w-4 h-4 text-gold-400" />
                      <span className="text-gold-400 text-sm font-medium">Premium</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-500/20 border border-gray-400/50">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">Free</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="border-white/30 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Daily Readings Used
              </CardTitle>
              <Calendar className="h-4 w-4 text-gold-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {profile?.daily_readings_used || 0}
                <span className="text-lg text-white/60">
                  /{profile?.subscription_tier === 'premium' ? '∞' : '3'}
                </span>
              </div>
              <p className="text-xs text-white/60">
                {profile?.subscription_tier === 'premium' 
                  ? 'Unlimited readings' 
                  : `${3 - (profile?.daily_readings_used || 0)} remaining today`
                }
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/30 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Readings
              </CardTitle>
              <History className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-white/60">
                Lifetime readings recorded
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/30 bg-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Account Status
              </CardTitle>
              <Settings className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Active</div>
              <p className="text-xs text-white/60">
                Member since {new Date(profile?.created_at || '').toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-200 cursor-pointer"
                onClick={() => router.push('/reading/single')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-gold-400" />
                Get a New Reading
              </CardTitle>
              <CardDescription className="text-white/70">
                Connect with the mystical energies and receive guidance for your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Draw Your Cards
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <History className="w-5 h-5 text-purple-400" />
                Reading History
              </CardTitle>
              <CardDescription className="text-white/70">
                Review your past readings and track your spiritual growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                View History (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upgrade Banner for Free Users */}
        {profile?.subscription_tier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="border-gold-400/50 bg-gradient-to-r from-gold-900/20 to-amber-900/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold-400">
                  <Crown className="w-5 h-5" />
                  Unlock Your Full Mystical Potential
                </CardTitle>
                <CardDescription className="text-white/80">
                  Upgrade to Premium for unlimited readings, detailed history tracking, and personalized AI insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-semibold">
                  Upgrade to Premium (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
} 