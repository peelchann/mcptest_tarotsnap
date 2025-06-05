'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { MysticalParticles } from '@/app/components/ui/MysticalParticles';
import { CardReveal } from '@/app/components/reading/CardReveal';
import { ReadingInterpretation } from '@/app/components/reading/ReadingInterpretation';
import { TarotReading } from '@/lib/openrouter';
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

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ReadingStep = 'question' | 'draw' | 'cardReveal' | 'reading' | 'chat';

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

  useEffect(() => {
    // Get question from session storage
    const storedQuestion = sessionStorage.getItem('tarot-question');
    if (storedQuestion) {
      setQuestion(storedQuestion);
      setCurrentStep('draw');
    }
  }, []);

  const drawCard = async () => {
    if (!question.trim()) {
      setError('Please enter a question before drawing your card.');
      return;
    }

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
        } else {
          setError(data.error || 'Failed to generate reading. Please try again.');
        }
        setIsDrawing(false);
        return;
      }

      // Successfully got reading
      setReading(data.reading);
      setIsDrawing(false);
      setCurrentStep('cardReveal');
      
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
      
      // Transition to chat after showing reading
      setTimeout(() => setCurrentStep('chat'), 2000);
      
    } catch (error) {
      console.error('Error drawing card:', error);
      setError('Unable to connect to reading service. Please check your connection and try again.');
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
        // Handle API errors gracefully
        const errorMessage = data.error || 'Unable to get response. Please try again.';
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I apologize, but I'm having trouble responding right now. ${errorMessage}`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        // Use the follow-up response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
        
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
            <Card className="border-red-500/50 bg-red-50/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
                {rateLimited && (
                  <p className="text-sm text-muted-foreground mt-2">
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
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What question would you like the cards to answer?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[100px] bg-white/90 border-white/30 text-gray-800 placeholder:text-gray-500"
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-white/70">
                      {question.length}/500 characters
                    </div>
                    <Button 
                      onClick={() => setCurrentStep('draw')}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      size="lg"
                      disabled={question.trim().length < 5}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Continue to Card Draw
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Card Drawing */}
          {currentStep === 'draw' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {question && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8"
                >
                  <Card className="max-w-2xl mx-auto border-white/20 bg-white/10 backdrop-blur-md">
                    <CardContent className="p-6">
                      <p className="text-lg font-medium mb-2 text-white">Your Question:</p>
                      <p className="text-white/80 italic">"{question}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="max-w-md mx-auto">
                <motion.div
                  className="relative mb-8"
                  animate={isDrawing ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isDrawing ? Infinity : 0 }}
                >
                  <div className="w-48 h-72 mx-auto bg-gradient-to-b from-purple-900/20 to-indigo-900/20 rounded-lg border-2 border-gold-400/50 flex items-center justify-center">
                    {isDrawing ? (
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gold-400">Consulting the cosmos...</p>
                      </div>
                    ) : (
                      <Sparkles className="w-16 h-16 text-gold-400" />
                    )}
                  </div>
                </motion.div>

                <Button 
                  onClick={drawCard}
                  disabled={isDrawing}
                  className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-semibold px-8 py-3 text-lg"
                  size="lg"
                >
                  {isDrawing ? 'Drawing...' : 'Draw Your Card'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Card Reveal Step - NEW */}
          {currentStep === 'cardReveal' && reading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CardReveal 
                reading={reading} 
                onContinue={() => setCurrentStep('reading')} 
              />
            </motion.div>
          )}

          {/* Reading Interpretation Step */}
          {currentStep === 'reading' && reading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReadingInterpretation 
                reading={reading} 
                question={question} 
              />
              
              {/* Continue to Chat Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-center mt-8"
              >
                <Button
                  onClick={() => {
                    setCurrentStep('chat');
                    // Add initial AI message to chat if not already present
                    if (chatMessages.length === 0) {
                      // Generate varied initial message using the templates
                      const variants = [
                        `I sense the energy of ${reading.card} continuing to work in your life. What aspect of this reading resonates most strongly with you?`,
                        `The wisdom of ${reading.card} has many layers. What part of your question about '${question}' would you like to explore more deeply?`,
                        `I feel there's more the cards want to reveal about your path. What's stirring in your heart as you reflect on this reading?`,
                        `The mystical energies around ${reading.card} are still speaking. Is there a particular aspect of '${question}' you'd like to delve into further?`,
                        `Your ${reading.card} reading holds deeper mysteries. What would you like to understand better about this guidance?`
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
                  }}
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
                  <Card className="border-accent/20 bg-card/50">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium mb-2">Your Question:</p>
                      <p className="text-muted-foreground italic">"{question}"</p>
                    </CardContent>
                  </Card>
                )}

                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-center"
                >
                  <Card className="border-primary/30 bg-card/70 backdrop-blur-md">
                    <CardContent className="p-6">
                      <div className="relative w-64 h-96 mx-auto mb-6 rounded-lg border-2 border-primary/30 overflow-hidden">
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
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-accent/20 flex items-center justify-center text-center text-primary" style={{ display: reading.imagePath ? 'none' : 'flex' }}>
                          <div>
                            <Sparkles className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-lg font-medium">{reading.card}</p>
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-accent">{reading.card}</h2>
                      <p className="text-muted-foreground">{reading.meaning}</p>
                      
                      {/* Reading Details */}
                      <div className="mt-6 space-y-4 text-left">
                        <div>
                          <h3 className="font-semibold text-accent mb-2">Interpretation</h3>
                          <p className="text-sm text-muted-foreground">{reading.interpretation}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-accent mb-2">Guidance</h3>
                          <p className="text-sm text-muted-foreground">{reading.guidance}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-accent mb-2">Energy</h3>
                          <p className="text-sm text-muted-foreground">{reading.energy}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-accent mb-2">Timeframe</h3>
                          <p className="text-sm text-muted-foreground">{reading.timeframe}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Chat Interface */}
              <div className="space-y-6">
                <Card className="border-primary/30 bg-card/70 backdrop-blur-md h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-accent" />
                      AI Oracle Chat
                    </CardTitle>
                    <CardDescription>
                      Discuss your reading with our mystical AI guide
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' ? 'bg-primary' : 'bg-accent'
                            }`}>
                              {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`rounded-lg p-3 ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
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
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
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
                          className="min-h-[60px] resize-none"
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