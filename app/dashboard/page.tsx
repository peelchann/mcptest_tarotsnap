'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { MysticalParticles } from '@/app/components/ui/MysticalParticles';
import { ChatHistory } from '@/app/components/chat/ChatHistory';
import { ChatPrivacyControls } from '@/app/components/privacy/ChatPrivacyControls';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { chatStorage } from '@/lib/services/chatStorage';
import { 
  ArrowLeft, 
  User, 
  MessageCircle, 
  Sparkles, 
  Settings,
  History,
  Shield
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
         const initAuth = async () => {
       try {
         const { data: { user } } = await supabase.auth.getUser();
         setUser(user);
         
         if (!user) {
           router.push('/');
         } else {
           await loadMessageCount(); // Load message count for authenticated user
         }
       } catch (error) {
         console.error('Error getting user:', error);
         router.push('/');
       } finally {
         setIsLoading(false);
       }
     };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          router.push('/');
        } else {
          setUser(session.user);
          loadMessageCount(); // Load message count when user is authenticated
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleSessionSelect = (sessionId: string) => {
    // TODO: Navigate to a detailed chat view or restore the session in reading page
    console.log('Selected session:', sessionId);
    // For now, redirect to reading page
    router.push('/reading/single');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleExportChat = async () => {
    try {
      const { data, error } = await chatStorage.exportChatHistory();
      if (error) throw error;
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarotsnap-chat-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDeleteAllChat = async () => {
    try {
      const { error } = await chatStorage.deleteAllChatMessages();
      if (error) throw error;
      setMessageCount(0);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const loadMessageCount = async () => {
    try {
      const { data: sessions } = await chatStorage.getChatSessions({ limit: 100 });
      if (sessions) {
        let totalMessages = 0;
        for (const session of sessions) {
          const { data: messages } = await chatStorage.getChatHistory({ sessionId: session.id });
          if (messages) {
            totalMessages += messages.length;
          }
        }
        setMessageCount(totalMessages);
      }
    } catch (error) {
      console.error('Error loading message count:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="opacity-30">
          <MysticalParticles />
        </div>
        <div className="text-center text-white">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading your spiritual journey...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Reduce particle opacity for better readability */}
      <div className="opacity-20">
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
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white">Your Spiritual Dashboard</h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-white hover:text-gold-300 hover:bg-white/10 border-white/30"
          >
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
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-gold-400" />
                Welcome back, {user.email?.split('@')[0] || 'Seeker'}
              </CardTitle>
              <CardDescription className="text-white/80">
                Your personal space for spiritual insights and conversations with the AI Oracle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={() => router.push('/reading/single')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  New Reading
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/about')}
                  className="text-white hover:text-gold-300 hover:bg-white/10 border-white/30"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-white/30 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <History className="w-5 h-5 text-gold-400" />
                  Your Spiritual Journey
                </CardTitle>
                <CardDescription className="text-white/80">
                  Revisit your conversations with the AI Oracle and track your spiritual growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatHistory 
                  onSessionSelect={handleSessionSelect}
                  className="max-h-[600px] overflow-y-auto"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy & Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Account Info */}
            <Card className="border-white/30 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <User className="w-5 h-5 text-gold-400" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-white/70">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Member since</p>
                  <p className="text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Controls */}
            <Card className="border-white/30 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Shield className="w-5 h-5 text-gold-400" />
                  Privacy & Data
                </CardTitle>
                <CardDescription className="text-white/70">
                  Manage your conversation data and privacy settings
                </CardDescription>
              </CardHeader>
                             <CardContent>
                 <ChatPrivacyControls 
                   onExport={handleExportChat}
                   onDeleteAll={handleDeleteAllChat}
                   messageCount={messageCount}
                 />
               </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-white/30 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Settings className="w-5 h-5 text-gold-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => router.push('/reading/single')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start New Reading
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => router.push('/about')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  How It Works
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 