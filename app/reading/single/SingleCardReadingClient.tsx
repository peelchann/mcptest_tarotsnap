'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { MysticalParticles } from '@/app/components/ui/MysticalParticles';
import { CardReveal } from '@/app/components/reading/CardReveal';
import { ReadingInterpretation } from '@/app/components/reading/ReadingInterpretation';
import { LoginPrompt } from '@/app/components/auth/LoginPrompt';
import { TarotReading } from '@/lib/openrouter';
import { createBrowserSupabaseClient } from '@/lib/supabase';
import { chatStorage } from '@/lib/services/chatStorage';
import Image from 'next/image';
import { 
  Sparkles, 
  MessageCircle, 
  ArrowLeft, 
  RefreshCw,
  Send,
  Bot,
  User,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { analytics, categorizeQuestion } from '@/lib/analytics';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ReadingStep = 'question' | 'draw' | 'cardReveal' | 'reading' | 'chat' | 'loginPrompt';

export default function SingleCardReading() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentStep, setCurrentStep] = useState<ReadingStep>('question');
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [remainingReadings, setRemainingReadings] = useState<number>(3);
  const [remainingFollowUps, setRemainingFollowUps] = useState<number>(10);
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    // Track page view on component mount
    analytics.trackPageView('Single Card Reading', {
      reading_type: 'single_card'
    });
    
    // Restore question from session storage
    const savedQuestion = sessionStorage.getItem('tarot-question');
    if (savedQuestion) {
      setQuestion(savedQuestion);
    }

    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsLoadingAuth(false);
      } catch (error) {
        console.error('Error getting user:', error);
        setIsLoadingAuth(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoadingAuth(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (question) {
      sessionStorage.setItem('tarot-question', question);
    }
  }, [question]);

  // Auto-scroll chat container when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const drawCard = async () => {
    if (!question.trim()) {
      setError('Please enter a question before drawing your card.');
      analytics.trackError('user_error', 'Empty question submitted', 'low');
      return;
    }

    // Track reading started
    analytics.trackReadingStarted(question.length);
    
    setIsDrawing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setRateLimited(true);
          setError(data.error || 'Daily reading limit reached. Please try again tomorrow.');
          
          // Track rate limit hit
          analytics.trackRateLimitHit('readings', data.remainingReadings || 0);
          analytics.trackPremiumInterest('rate_limit', analytics.calculateEngagementScore());
        } else {
          setError(data.error || 'Failed to generate reading. Please try again.');
          analytics.trackError('api_failure', data.error || 'Unknown API error', 'high');
        }
        setIsDrawing(false);
        return;
      }

      // Successfully got reading
      setReading(data.reading);
      setIsDrawing(false);
      setCurrentStep('cardReveal');
      
      // Track reading completed
      const questionCategory = categorizeQuestion(question);
      analytics.trackReadingCompleted(data.reading.card, questionCategory);
      
      // Update remaining readings counter
      if (data.remainingReadings !== undefined) {
        setRemainingReadings(data.remainingReadings);
      }
      
      // Add initial AI interpretation to chat
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reading.interpretation,
        timestamp: new Date()
      };
      
      setChatMessages([initialMessage]);

      // Create chat session and store initial interpretation for logged-in users
      if (user) {
        try {
          const { data: session, error: sessionError } = await chatStorage.createChatSession({
            title: `Reading: ${data.reading.card}`,
          });
          
          if (session && !sessionError) {
            setCurrentSessionId(session.id);
            
            // Store the initial interpretation
            await chatStorage.storeChatMessage({
              role: 'ai',
              content: data.reading.interpretation,
              sessionId: session.id,
              metadata: {
                card_name: data.reading.card,
                original_question: question,
                message_context: 'initial_reading',
                reading_type: 'single_card',
                card_meaning: data.reading.meaning,
                guidance: data.reading.guidance,
                energy: data.reading.energy,
                timeframe: data.reading.timeframe
              }
            });
          }
        } catch (error) {
          console.error('Error creating chat session or storing initial reading:', error);
        }
      }
      
      // Transition to chat after showing reading
      setTimeout(() => setCurrentStep('chat'), 5000);
      
    } catch (error) {
      console.error('Error drawing card:', error);
      setError('Unable to connect to reading service. Please check your connection and try again.');
      analytics.trackError('network', 'Failed to connect to reading service', 'high');
      setIsDrawing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !reading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsThinking(true);

    // Store user message for logged-in users
    if (user) {
      try {
                 // Create session if it doesn't exist
         if (!currentSessionId) {
           const { data: session, error: sessionError } = await chatStorage.createChatSession({
             title: `Reading: ${reading.card}`,
           });
           
           if (session && !sessionError) {
             setCurrentSessionId(session.id);
           }
         }

         // Store the message
         await chatStorage.storeChatMessage({
           role: 'user',
           content: userMessage.content,
           sessionId: currentSessionId || undefined,
           metadata: {
             card_name: reading.card,
             original_question: question,
             message_context: 'follow_up_question'
           }
         });
      } catch (error) {
        console.error('Error storing user message:', error);
      }
    }

    // Track chat message
    analytics.trackChatMessage(chatMessages.length + 1);

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          followUp: {
            originalQuestion: question,
            cardName: reading.card,
            cardMeaning: reading.meaning,
            previousInterpretation: reading.interpretation
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          analytics.trackRateLimitHit('followup_questions', data.remainingFollowUps || 0);
        }
        
        // Handle API errors gracefully
        const errorMessage = data.error || 'Unable to get response. Please try again.';
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I apologize, but I'm having trouble responding right now. ${errorMessage}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
        
        analytics.trackError('api_failure', data.error || 'Chat API error', 'medium');
      } else {
        // Use the follow-up response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
        
        // Store AI response for logged-in users
        if (user) {
          try {
            await chatStorage.storeChatMessage({
              role: 'ai',
              content: data.response,
              sessionId: currentSessionId || undefined,
              metadata: {
                card_name: reading.card,
                original_question: question,
                message_context: 'ai_response',
                response_type: 'follow_up'
              }
            });
          } catch (error) {
            console.error('Error storing AI response:', error);
          }
        }
        
        // Update remaining follow-ups counter
        if (data.remainingFollowUps !== undefined) {
          setRemainingFollowUps(data.remainingFollowUps);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try your question again in a moment.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      analytics.trackError('network', 'Chat message failed to send', 'medium');
    } finally {
      setIsThinking(false);
    }
  };

  const startNewReading = () => {
    setReading(null);
    setChatMessages([]);
    setQuestion('');
    setCurrentStep('question');
    setError(null);
    setRateLimited(false);
    setRemainingFollowUps(10); // Reset follow-up counter for new reading
    sessionStorage.removeItem('tarot-question');
    
    // Track new reading started
    analytics.trackPageView('Single Card Reading - New Reading', {
      reading_type: 'single_card_new'
    });
  };

  // Track when user starts chatting
  const handleChatStart = (cardName: string) => {
    analytics.trackChatStarted(cardName);
    setCurrentStep('chat');
    
    // Add initial AI message to chat if not already present
    if (chatMessages.length === 0) {
      // Generate varied initial message using the templates
      const variants = [
        `I sense the energy of ${cardName} continuing to work in your life. What aspect of this reading resonates most strongly with you?`,
        `The wisdom of ${cardName} has many layers. What part of your question about '${question}' would you like to explore more deeply?`,
        `I feel there's more the cards want to reveal about your path. What's stirring in your heart as you reflect on this reading?`,
        `The mystical energies around ${cardName} are still speaking. Is there a particular aspect of '${question}' you'd like to delve into further?`,
        `Your ${cardName} reading holds deeper mysteries. What would you like to understand better about this guidance?`
      ];
      
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomVariant,
        timestamp: new Date()
      };
      setChatMessages([initialMessage]);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Reduce particle opacity for better readability */}
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
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl font-bold text-white">Single Card Reading</h1>
          </div>
          
          {/* Usage Counters */}
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <span>Readings: {remainingReadings}/3</span>
            </div>
            {currentStep === 'chat' && (
              <div className="flex items-center gap-1">
                <span>Questions: {remainingFollowUps}/10</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={startNewReading}
            className="flex items-center gap-2 text-white hover:text-gold-300 hover:bg-white/10 border-white/30"
          >
            <RefreshCw className="w-4 h-4" />
            New Reading
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <Card className="border-red-400/50 bg-red-900/20 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
                {rateLimited && (
                  <p className="text-sm text-white/70 mt-2">
                    You can have 3 free readings per day. Consider signing up for unlimited access.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Question Display/Input */}
          {currentStep === 'question' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-white/30 bg-white/10 backdrop-blur-md">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2 text-white">
                    <Heart className="w-6 h-6 text-gold-400" />
                    What guidance do you seek?
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Focus your intention and ask the universe for guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Ask your question to the cards... (e.g., 'What should I focus on in my career?')"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[120px] bg-white/90 border-white/30 text-gray-800 placeholder:text-gray-500 resize-none"
                      maxLength={500}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && question.trim()) {
                          e.preventDefault();
                          drawCard();
                        }
                      }}
                    />
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Press Enter to draw your card</span>
                      <span>{question.length}/500</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={drawCard}
                    disabled={!question.trim() || isDrawing}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                  >
                    {isDrawing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Channeling mystical energies...
                      </div>
                    ) : (
                      'Draw Your Card'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Card Reveal Phase */}
          {currentStep === 'cardReveal' && reading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                className="max-w-sm mx-auto mb-8"
              >
                <Card className="border-white/30 bg-white/10 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="relative w-64 h-96 mx-auto mb-6 rounded-lg border-2 border-gold-400/50 overflow-hidden">
                      {reading.imagePath ? (
                        <Image
                          src={reading.imagePath}
                          alt={reading.card}
                          fill
                          className="object-cover object-center"
                          priority
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-indigo-900/20 flex items-center justify-center text-center text-gold-400" style={{ display: reading.imagePath ? 'none' : 'flex' }}>
                        <div>
                          <Sparkles className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg font-medium">{reading.card}</p>
                        </div>
                      </div>
                    </div>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                      className="text-3xl font-bold mb-2 text-gold-400"
                    >
                      {reading.card}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-white/80 text-lg"
                    >
                      {reading.meaning}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-center mt-8"
              >
                <Button
                  onClick={() => handleChatStart(reading.card)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Continue with AI Oracle
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Original Card Reading (for chat) */}
          {currentStep === 'chat' && reading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Card Display */}
              <div className="space-y-6">
                {question && (
                  <Card className="border-white/20 bg-white/10 backdrop-blur-md">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium mb-2 text-white">Your Question:</p>
                        <p className="text-white/80 italic">&quot;{question}&quot;</p>
                    </CardContent>
                  </Card>
                )}

                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-center"
                >
                  <Card className="border-white/30 bg-white/10 backdrop-blur-md">
                    <CardContent className="p-6">
                      <div className="relative w-64 h-96 mx-auto mb-6 rounded-lg border-2 border-gold-400/50 overflow-hidden">
                        {reading.imagePath ? (
                          <Image
                            src={reading.imagePath}
                            alt={reading.card}
                            fill
                            className="object-cover object-center"
                            priority
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-indigo-900/20 flex items-center justify-center text-center text-gold-400" style={{ display: reading.imagePath ? 'none' : 'flex' }}>
                          <div>
                            <Sparkles className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-lg font-medium">{reading.card}</p>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-gold-400">{reading.card}</h2>
                      <p className="text-white/80">{reading.meaning}</p>
                      
                      {/* Reading Details */}
                      <div className="mt-6 space-y-4 text-left">
                        <div>
                          <h3 className="font-semibold text-gold-400 mb-2">Interpretation</h3>
                          <p className="text-sm text-white/70">{reading.interpretation}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gold-400 mb-2">Guidance</h3>
                          <p className="text-sm text-white/70">{reading.guidance}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gold-400 mb-2">Energy</h3>
                          <p className="text-sm text-white/70">{reading.energy}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gold-400 mb-2">Timeframe</h3>
                          <p className="text-sm text-white/70">{reading.timeframe}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Chat Interface */}
              <div className="space-y-6">
                {/* Login Prompt for Anonymous Users */}
                {!user && !isLoadingAuth && (
                  <LoginPrompt 
                    cardName={reading.card}
                    context="chat"
                    onContinueWithoutLogin={() => {
                      // User chooses to continue without login - no action needed
                      // Chat will work but won't be saved
                    }}
                    onLoginSuccess={() => {
                      // User successfully logged in - auth state will update automatically
                      // Chat messages will now be saved
                    }}
                  />
                )}
                
                <Card className="border-white/30 bg-white/10 backdrop-blur-md h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MessageCircle className="w-5 h-5 text-gold-400" />
                      AI Oracle Chat
                      {user && (
                        <span className="text-xs bg-gold-500/20 text-gold-300 px-2 py-1 rounded-full ml-2">
                          Memory Enabled
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {user 
                        ? "Your conversations are saved and remembered across sessions"
                        : "Discuss your reading with our mystical AI guide"
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="h-96 max-h-96 overflow-y-auto p-6 space-y-4 scroll-smooth mystical-scrollbar">
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' ? 'bg-blue-600' : 'bg-gold-500'
                            }`}>
                              {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-black" />}
                            </div>
                            <div className={`rounded-lg p-3 ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/90 text-gray-800'
                            }`}>
                              <pre className="whitespace-pre-wrap font-sans text-sm">{message.content}</pre>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isThinking && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 justify-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-black" />
                          </div>
                          <div className="bg-white/90 rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    
                    {/* Message Input */}
                    <div className="border-t border p-4">
                      <form 
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        className="flex gap-2"
                      >
                        <Textarea
                          placeholder="Ask about your reading..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none bg-white/90 border-white/30 text-gray-800 placeholder:text-gray-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          type="submit" 
                          size="icon"
                          disabled={!newMessage.trim() || isThinking}
                          className="self-end"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
