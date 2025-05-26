'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { MysticalParticles } from '@/app/components/ui/MysticalParticles';
import { cards, TarotCard } from '@/app/data/cards';
import { 
  Sparkles, 
  MessageCircle, 
  ArrowLeft, 
  RefreshCw,
  Send,
  Bot,
  User,
  Heart
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SingleCardReading() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentStep, setCurrentStep] = useState<'question' | 'draw' | 'reading' | 'chat'>('question');

  useEffect(() => {
    // Get question from session storage
    const storedQuestion = sessionStorage.getItem('tarot-question');
    if (storedQuestion) {
      setQuestion(storedQuestion);
      setCurrentStep('draw');
    }
  }, []);

  const drawCard = async () => {
    setIsDrawing(true);
    
    // Simulate card drawing with mystical delay
    setTimeout(() => {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      setSelectedCard(randomCard);
      setIsDrawing(false);
      setShowReading(true);
      setCurrentStep('reading');
      
      // Add initial AI interpretation
      const initialReading = generateCardReading(randomCard, question);
      setChatMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: initialReading,
        timestamp: new Date()
      }]);
      
      setTimeout(() => setCurrentStep('chat'), 2000);
    }, 2000);
  };

  const generateCardReading = (card: TarotCard, userQuestion: string) => {
    const questionContext = userQuestion ? 
      `Regarding your question: "${userQuestion}"` : 
      "For your general guidance today";
    
    return `${questionContext}

**${card.name}** has appeared to guide you.

${card.meaning.upright}

**Key Insights:**
• This card suggests ${card.name.toLowerCase()} energy is present in your situation
• Pay attention to themes of ${card.keywords.join(', ')}
• The universe is encouraging you to embrace this card's wisdom

**For deeper understanding, feel free to ask me specific questions about:**
- How this card relates to your current situation
- What actions you should take based on this guidance
- Specific aspects of the card's symbolism
- Follow-up questions about your path forward

What would you like to explore further about this reading?`;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCard) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage, selectedCard, question);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string, card: TarotCard, originalQuestion: string) => {
    // This would be replaced with actual AI integration
    const responses = [
      `Great question! In the context of **${card.name}**, this suggests that you should focus on ${card.meaning.upright.toLowerCase()}. The card's energy encourages you to trust your intuition and move forward with confidence.`,
      
      `The **${card.name}** speaks directly to your concern. This card often appears when ${card.meaning.upright.toLowerCase()}. Consider how this applies to your current situation and what steps you can take to align with this energy.`,
      
      `Interesting perspective! **${card.name}** in your reading indicates that ${card.meaning.upright.toLowerCase()}. The universe is guiding you to pay attention to the themes of ${card.keywords.join(', ')} that this card represents.`,
      
      `Thank you for sharing that. **${card.name}** is a powerful card that suggests ${card.meaning.upright.toLowerCase()}. In relation to your original question${originalQuestion ? ` about "${originalQuestion}"` : ''}, this card encourages you to embrace change and trust the process.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startNewReading = () => {
    setSelectedCard(null);
    setShowReading(false);
    setChatMessages([]);
    setQuestion('');
    setCurrentStep('question');
    sessionStorage.removeItem('tarot-question');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MysticalParticles />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold">Single Card Reading</h1>
          </div>
          
          <Button 
            variant="outline" 
            onClick={startNewReading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Reading
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* Question Display/Input */}
          {currentStep === 'question' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-primary/30 bg-card/70 backdrop-blur-md">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Heart className="w-6 h-6 text-accent" />
                    What guidance do you seek?
                  </CardTitle>
                  <CardDescription>
                    Focus your intention and ask the universe for guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What question would you like the cards to answer?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[100px] bg-background/50 border-primary/20"
                    />
                    <Button 
                      onClick={() => setCurrentStep('draw')}
                      variant="mystical" 
                      size="lg"
                      className="w-full"
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
                  <Card className="max-w-2xl mx-auto border-accent/20 bg-card/50">
                    <CardContent className="p-6">
                      <p className="text-lg font-medium mb-2">Your Question:</p>
                      <p className="text-muted-foreground italic">"{question}"</p>
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
                  <div className="w-48 h-72 mx-auto bg-gradient-to-b from-primary/20 to-accent/20 rounded-lg border-2 border-primary/30 flex items-center justify-center cosmic-pulse">
                    {isDrawing ? (
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-accent">Drawing your card...</p>
                      </div>
                    ) : (
                      <Sparkles className="w-16 h-16 text-primary" />
                    )}
                  </div>
                </motion.div>

                <Button 
                  onClick={drawCard}
                  disabled={isDrawing}
                  variant="mystical"
                  size="xl"
                  className="cosmic-pulse"
                >
                  {isDrawing ? 'Drawing...' : 'Draw Your Card'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Card Reading */}
          {(currentStep === 'reading' || currentStep === 'chat') && selectedCard && (
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
                      <div className="relative w-64 h-96 mx-auto mb-6">
                        <img
                          src={selectedCard.imagePath}
                          alt={selectedCard.name}
                          className="w-full h-full object-cover rounded-lg shadow-lg cosmic-pulse"
                        />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-accent">{selectedCard.name}</h2>
                      <p className="text-muted-foreground">{selectedCard.meaning.upright}</p>
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