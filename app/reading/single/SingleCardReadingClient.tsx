'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Send,
  Bot,
  User,
  AlertTriangle,
  BookmarkPlus,
  MessageCircle,
} from 'lucide-react';

import { LoginPrompt } from '@/app/components/auth/LoginPrompt';
import { TarotReading } from '@/lib/openrouter';
import { useAuth } from '@/app/providers/AuthProvider';
import { chatStorage } from '@/lib/services/chatStorage';
import { analytics, categorizeQuestion } from '@/lib/analytics';
import { getAnonId } from '@/lib/anon-id';
import { cards as ALL_CARDS, type TarotCard } from '@/app/data/cards';

import RitualButton from '@/app/components/coven/RitualButton';
import GhostButton from '@/app/components/coven/GhostButton';
import QuestionTextarea from '@/app/components/coven/QuestionTextarea';
import LoadingSigil from '@/app/components/coven/LoadingSigil';
import CardReveal from '@/app/components/coven/CardReveal';
import TarotCardBack from '@/app/components/coven/TarotCardBack';
import TarotCardFront from '@/app/components/coven/TarotCardFront';
import QuotaPill from '@/app/components/coven/QuotaPill';
import DecorativeDivider from '@/app/components/coven/DecorativeDivider';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ReadingStep = 'question' | 'draw' | 'cardReveal' | 'reading' | 'chat' | 'loginPrompt';

// Cycling messages for the draw step
const DRAW_MESSAGES = [
  'The cards are listening…',
  'A pattern is forming…',
  'One card steps forward…',
];

/**
 * Resolve the API-returned card name to a structured TarotCard for visual rendering.
 * Falls back to a stylized default if no exact match exists.
 */
function resolveCard(name: string): Pick<TarotCard, 'name' | 'number' | 'arcana' | 'suit'> {
  const direct = ALL_CARDS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  if (direct) return direct;
  // Loose match — strip "of"/"the" etc
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const loose = ALL_CARDS.find(
    (c) => c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm,
  );
  if (loose) return loose;
  return { name, number: 0, arcana: 'major' };
}

/** Pull short tag chips from reading.meaning + first sentence of interpretation. */
function deriveTags(reading: TarotReading): string[] {
  const rawTags = new Set<string>();
  if (reading.meaning) {
    reading.meaning
      .split(/[,;.]/)
      .map((s) => s.trim())
      .filter((s) => s && s.length <= 22 && s.length >= 3)
      .slice(0, 3)
      .forEach((t) => rawTags.add(capitalize(t)));
  }
  // try to also pick up keywords from card data
  const c = ALL_CARDS.find(
    (cc) => cc.name.toLowerCase() === reading.card.toLowerCase(),
  );
  if (c) c.keywords.slice(0, 2).forEach((k) => rawTags.add(capitalize(k)));
  return Array.from(rawTags).slice(0, 5);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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
  const [drawMsgIdx, setDrawMsgIdx] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { supabase, user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    analytics.trackPageView('Single Card Reading', {
      reading_type: 'single_card',
    });
    const savedQuestion = sessionStorage.getItem('tarot-question');
    if (savedQuestion) setQuestion(savedQuestion);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoadingAuth(authLoading);
      return;
    }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setUser(session?.user ?? null);
        setIsLoadingAuth(false);
      },
    );
    return () => subscription.unsubscribe();
  }, [supabase, authLoading]);

  useEffect(() => {
    if (question) sessionStorage.setItem('tarot-question', question);
  }, [question]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Cycle through DRAW_MESSAGES while drawing
  useEffect(() => {
    if (!isDrawing) return;
    const interval = setInterval(() => {
      setDrawMsgIdx((i) => (i + 1) % DRAW_MESSAGES.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [isDrawing]);

  const drawCard = async () => {
    if (!question.trim()) {
      setError('Please write your question before drawing your card.');
      analytics.trackError('user_error', 'Empty question submitted', 'low');
      return;
    }

    analytics.trackReadingStarted(question.length);

    setIsDrawing(true);
    setCurrentStep('draw');
    setError(null);

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Anon-Id': getAnonId(),
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setRateLimited(true);
          setError(data.error || 'Daily reading limit reached. Please return tomorrow.');
          analytics.trackRateLimitHit('readings', data.remainingReadings || 0);
          analytics.trackPremiumInterest('rate_limit', analytics.calculateEngagementScore());
        } else {
          setError(data.error || 'The deck did not respond. Please try again.');
          analytics.trackError('api_failure', data.error || 'Unknown API error', 'high');
        }
        setIsDrawing(false);
        setCurrentStep('question');
        return;
      }

      setReading(data.reading);
      setIsDrawing(false);
      setCurrentStep('cardReveal');

      const questionCategory = categorizeQuestion(question);
      analytics.trackReadingCompleted(data.reading.card, questionCategory);

      if (data.remainingReadings !== undefined) {
        setRemainingReadings(data.remainingReadings);
      }

      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reading.interpretation,
        timestamp: new Date(),
      };
      setChatMessages([initialMessage]);

      if (user) {
        try {
          const { data: session, error: sessionError } = await chatStorage.createChatSession({
            title: `Reading: ${data.reading.card}`,
          });
          if (session && !sessionError) {
            setCurrentSessionId(session.id);
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
                timeframe: data.reading.timeframe,
              },
            });
          }
        } catch (error) {
          console.error('Error creating chat session or storing initial reading:', error);
        }
      }

      // Move from cardReveal → reading after the flip animation
      setTimeout(() => setCurrentStep('reading'), 2200);
    } catch (error) {
      console.error('Error drawing card:', error);
      setError('Unable to reach the deck. Please check your connection and try again.');
      analytics.trackError('network', 'Failed to connect to reading service', 'high');
      setIsDrawing(false);
      setCurrentStep('question');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !reading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsThinking(true);

    if (user) {
      try {
        if (!currentSessionId) {
          const { data: session, error: sessionError } = await chatStorage.createChatSession({
            title: `Reading: ${reading.card}`,
          });
          if (session && !sessionError) setCurrentSessionId(session.id);
        }
        await chatStorage.storeChatMessage({
          role: 'user',
          content: userMessage.content,
          sessionId: currentSessionId || undefined,
          metadata: {
            card_name: reading.card,
            original_question: question,
            message_context: 'follow_up_question',
          },
        });
      } catch (error) {
        console.error('Error storing user message:', error);
      }
    }

    analytics.trackChatMessage(chatMessages.length + 1);

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Anon-Id': getAnonId(),
        },
        body: JSON.stringify({
          question: userMessage.content,
          followUp: {
            originalQuestion: question,
            cardName: reading.card,
            cardMeaning: reading.meaning,
            previousInterpretation: reading.interpretation,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          analytics.trackRateLimitHit('followup_questions', data.remainingFollowUps || 0);
        }
        const errorMessage = data.error || 'Unable to get a response. Please try again.';
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `The deck pauses. ${errorMessage}`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, assistantMessage]);
        analytics.trackError('api_failure', data.error || 'Chat API error', 'medium');
      } else {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, assistantMessage]);

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
                response_type: 'follow_up',
              },
            });
          } catch (error) {
            console.error('Error storing AI response:', error);
          }
        }

        if (data.remainingFollowUps !== undefined) {
          setRemainingFollowUps(data.remainingFollowUps);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'The deck has gone quiet. Please try again in a moment.',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
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
    setRemainingFollowUps(10);
    sessionStorage.removeItem('tarot-question');
    analytics.trackPageView('Single Card Reading - New Reading', {
      reading_type: 'single_card_new',
    });
  };

  const handleChatStart = (cardName: string) => {
    analytics.trackChatStarted(cardName);
    setCurrentStep('chat');
    if (chatMessages.length === 0) {
      const variants = [
        `I sense the energy of ${cardName} continuing to work in your life. What aspect of this reading resonates most strongly?`,
        `The wisdom of ${cardName} has many layers. What part of your question about '${question}' would you like to explore more deeply?`,
        `I feel there's more the cards want to reveal. What is stirring as you reflect on this?`,
        `The mystical energies around ${cardName} are still speaking. Which thread shall we follow?`,
        `Your ${cardName} reading holds deeper mysteries. What would you like to understand better?`,
      ];
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomVariant,
        timestamp: new Date(),
      };
      setChatMessages([initialMessage]);
    }
  };

  return (
    <div className="relative min-h-[80vh]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14">
        {/* Top action bar */}
        <div className="flex items-center justify-between mb-10">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-coven-fog hover:text-coven-soft-gold text-[0.72rem] tracking-[0.2em] uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </button>

          <div className="hidden md:flex items-center gap-4">
            <QuotaPill remaining={remainingReadings} total={3} label="Readings today" />
            {currentStep === 'chat' && (
              <QuotaPill remaining={remainingFollowUps} total={10} label="Follow-ups" />
            )}
          </div>

          <button
            type="button"
            onClick={startNewReading}
            className="inline-flex items-center gap-2 text-coven-fog hover:text-coven-soft-gold text-[0.72rem] tracking-[0.2em] uppercase transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New reading
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-start gap-3 p-4 rounded-[3px] border border-[rgba(142,42,67,0.55)] bg-[rgba(142,42,67,0.18)]">
              <AlertTriangle className="w-4 h-4 text-coven-danger mt-0.5 shrink-0" />
              <div className="text-sm text-coven-bone leading-relaxed">
                <p>{error}</p>
                {rateLimited && (
                  <p className="mt-2 text-xs text-coven-fog/85">
                    You may draw three free cards each day. Sign in for unlimited continuity.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ───────────── QUESTION STEP ───────────── */}
          {currentStep === 'question' && (
            <motion.section
              key="question"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <span className="coven-kicker">The ritual</span>
              <h1 className="font-serif text-coven-bone leading-[1.05] tracking-tight mt-3 text-[clamp(2.2rem,5vw,3.4rem)]">
                What guidance do you{' '}
                <span className="italic text-coven-soft-gold">seek</span>?
              </h1>
              <p className="mt-4 max-w-xl mx-auto text-coven-fog font-light leading-relaxed">
                Focus your intention. Specific is better than safe. The deck
                hears questions, not summaries.
              </p>

              {/* Breathing card behind the textarea */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 0.6, 0, -0.6, 0] }}
                transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
                className="mx-auto mt-10 mb-8 w-[160px]"
              >
                <TarotCardBack />
              </motion.div>

              <div className="max-w-xl mx-auto">
                <QuestionTextarea
                  value={question}
                  onChange={setQuestion}
                  placeholder="Ask the cards something true… (e.g., What is this restlessness asking of me?)"
                  maxLength={500}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && question.trim()) {
                      e.preventDefault();
                      drawCard();
                    }
                  }}
                />

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <RitualButton
                    size="lg"
                    onClick={drawCard}
                    disabled={!question.trim() || isDrawing}
                  >
                    Draw Your Card
                  </RitualButton>
                  <span className="text-coven-fog/65 text-[0.7rem] tracking-[0.2em] uppercase hidden sm:inline">
                    or press Enter
                  </span>
                </div>

                {question.length > 0 && question.length < 10 && (
                  <p className="mt-5 text-coven-fog/75 text-[0.78rem] italic">
                    A more specific question opens a deeper reading.
                  </p>
                )}
              </div>

              <div className="mt-10 md:hidden">
                <QuotaPill remaining={remainingReadings} total={3} label="Readings today" />
              </div>
            </motion.section>
          )}

          {/* ───────────── DRAW STEP ───────────── */}
          {currentStep === 'draw' && (
            <motion.section
              key="draw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <LoadingSigil size={140} />
              <AnimatePresence mode="wait">
                <motion.p
                  key={drawMsgIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 font-serif italic text-coven-bone text-xl md:text-2xl tracking-wide text-center"
                >
                  {DRAW_MESSAGES[drawMsgIdx]}
                </motion.p>
              </AnimatePresence>
              <p className="mt-3 max-w-md text-center text-coven-fog/70 text-sm font-light">
                Hold your question lightly. The card knows the way.
              </p>
            </motion.section>
          )}

          {/* ───────────── CARD REVEAL STEP ───────────── */}
          {currentStep === 'cardReveal' && reading && (
            <motion.section
              key="cardReveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <span className="coven-kicker mb-6">A card steps forward</span>
              <CardReveal card={resolveCard(reading.card)} width={260} />
            </motion.section>
          )}

          {/* ───────────── READING STEP ───────────── */}
          {currentStep === 'reading' && reading && (
            <motion.section
              key="reading"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mx-auto max-w-3xl"
            >
              {question && (
                <div className="text-center mb-10">
                  <span className="coven-kicker">Your question</span>
                  <p className="mt-3 font-serif italic text-coven-bone text-lg md:text-xl leading-relaxed">
                    &ldquo;{question}&rdquo;
                  </p>
                </div>
              )}

              <DecorativeDivider symbol="diamond" className="my-8" />

              <div className="flex flex-col items-center">
                <span className="coven-kicker mb-5">Your card</span>
                <div className="relative w-[240px] md:w-[280px]">
                  <div className="absolute inset-0 -m-10 rounded-full bg-[radial-gradient(circle,rgba(122,69,165,0.45)_0%,transparent_70%)] blur-2xl pointer-events-none" />
                  <TarotCardFront card={resolveCard(reading.card)} />
                </div>
                <h2 className="mt-7 font-serif text-coven-bone text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-tight text-center">
                  {reading.card}
                </h2>

                {(() => {
                  const tags = deriveTags(reading);
                  return (
                    tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 text-[0.65rem] tracking-[0.22em] uppercase border border-[rgba(176,138,73,0.4)] text-coven-fog rounded-[1px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )
                  );
                })()}

                <p className="mt-6 max-w-xl text-center font-serif italic text-coven-fog text-base md:text-lg">
                  {reading.meaning}
                </p>
              </div>

              <DecorativeDivider symbol="star" className="my-12" />

              <div className="space-y-7">
                <ReadingBlock label="Interpretation" body={reading.interpretation} />
                {reading.guidance && <ReadingBlock label="Guidance" body={reading.guidance} />}
                <div className="grid sm:grid-cols-2 gap-4">
                  {reading.energy && (
                    <div className="rounded-[3px] border border-[rgba(176,138,73,0.35)] bg-coven-ink/65 p-5">
                      <div className="coven-kicker text-[0.6rem] mb-2">Energy</div>
                      <p className="text-sm text-coven-fog font-sans leading-relaxed">
                        {reading.energy}
                      </p>
                    </div>
                  )}
                  {reading.timeframe && (
                    <div className="rounded-[3px] border border-[rgba(176,138,73,0.35)] bg-coven-ink/65 p-5">
                      <div className="coven-kicker text-[0.6rem] mb-2">Timeframe</div>
                      <p className="text-sm text-coven-fog font-sans leading-relaxed">
                        {reading.timeframe}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <RitualButton
                  size="md"
                  onClick={() => handleChatStart(reading.card)}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Ask a Follow-up
                </RitualButton>
                <GhostButton onClick={startNewReading} iconLeft={<BookmarkPlus className="w-3.5 h-3.5" />}>
                  Save &amp; New Reading
                </GhostButton>
              </div>
            </motion.section>
          )}

          {/* ───────────── CHAT STEP ───────────── */}
          {currentStep === 'chat' && reading && (
            <motion.section
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-[420px_1fr] gap-8 items-start"
            >
              {/* Card column */}
              <div className="space-y-5 lg:sticky lg:top-24 self-start">
                {question && (
                  <div className="rounded-[3px] border border-[rgba(176,138,73,0.32)] bg-coven-ink/65 p-5">
                    <span className="coven-kicker text-[0.62rem]">Your question</span>
                    <p className="mt-2 font-serif italic text-coven-bone text-base md:text-lg leading-relaxed">
                      &ldquo;{question}&rdquo;
                    </p>
                  </div>
                )}
                <div className="relative mx-auto w-[220px]">
                  <div className="absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle,rgba(122,69,165,0.35)_0%,transparent_70%)] blur-2xl pointer-events-none" />
                  <TarotCardFront card={resolveCard(reading.card)} />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-coven-bone text-2xl">{reading.card}</h3>
                  <p className="mt-2 text-coven-fog text-sm italic">{reading.meaning}</p>
                </div>
              </div>

              {/* Chat column */}
              <div className="flex flex-col">
                {!user && !isLoadingAuth && (
                  <div className="mb-5">
                    <LoginPrompt
                      cardName={reading.card}
                      context="chat"
                      onContinueWithoutLogin={() => {}}
                      onLoginSuccess={() => {}}
                    />
                  </div>
                )}

                <div className="flex flex-col rounded-[3px] border border-[rgba(176,138,73,0.35)] bg-coven-ink/70 backdrop-blur-md min-h-[640px] max-h-[80vh]">
                  <header className="flex items-center justify-between gap-3 px-6 py-5 border-b border-[rgba(176,138,73,0.22)]">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-coven-soft-gold" />
                      <span className="font-serif text-coven-bone text-lg italic">
                        The Oracle
                      </span>
                      {user && (
                        <span className="ml-2 px-2 py-0.5 text-[0.62rem] tracking-[0.22em] uppercase border border-[rgba(216,182,106,0.4)] text-coven-soft-gold rounded-[1px]">
                          Memory on
                        </span>
                      )}
                    </div>
                    <span className="text-[0.66rem] tracking-[0.2em] uppercase text-coven-fog/65">
                      {remainingFollowUps}/10 questions
                    </span>
                  </header>

                  <div className="flex-1 overflow-y-auto p-6 space-y-5 mystical-scrollbar">
                    {chatMessages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[85%] ${
                            m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                              m.role === 'user'
                                ? 'border-[rgba(191,174,220,0.45)] bg-coven-violet/30 text-coven-fog'
                                : 'border-[rgba(216,182,106,0.55)] bg-[radial-gradient(circle,rgba(122,69,165,0.4)_0%,rgba(11,8,16,0.95)_75%)] text-coven-soft-gold'
                            }`}
                          >
                            {m.role === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div
                            className={`rounded-[3px] px-4 py-3 border ${
                              m.role === 'user'
                                ? 'border-[rgba(191,174,220,0.32)] bg-coven-plum/40 text-coven-bone'
                                : 'border-[rgba(176,138,73,0.4)] bg-coven-ink/85 text-coven-bone'
                            }`}
                          >
                            <p className="whitespace-pre-wrap font-sans text-[0.92rem] leading-relaxed">
                              {m.content}
                            </p>
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
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[rgba(216,182,106,0.55)] bg-coven-ink/80 text-coven-soft-gold">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="rounded-[3px] px-4 py-3 border border-[rgba(176,138,73,0.4)] bg-coven-ink/85">
                          <div className="flex gap-1.5 items-center">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="block w-1.5 h-1.5 rounded-full bg-coven-soft-gold/85 animate-coven-pulse"
                                style={{ animationDelay: `${i * 0.18}s` }}
                              />
                            ))}
                            <span className="ml-2 text-[0.78rem] italic text-coven-fog font-serif">
                              listening…
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="border-t border-[rgba(176,138,73,0.22)] p-4"
                  >
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Ask the deck more…"
                          maxLength={1000}
                          className="block w-full min-h-[58px] resize-none bg-coven-ink/65 border border-[rgba(176,138,73,0.4)] rounded-[2px] px-4 py-3 text-coven-bone font-sans text-sm placeholder:text-coven-fog/55 focus:outline-none focus:border-[rgba(216,182,106,0.7)] focus:ring-0 transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <div className="flex justify-between items-center mt-1.5 px-1 text-[0.65rem] tracking-[0.16em] uppercase text-coven-fog/55">
                          <span>Shift+Enter for new line</span>
                          <span>{newMessage.length}/1000</span>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isThinking}
                        className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-[2px] border border-[rgba(216,182,106,0.55)] bg-gradient-to-b from-[#2A1638] to-[#160A1F] text-coven-soft-gold hover:border-[rgba(216,182,106,0.85)] hover:shadow-coven-aura disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-5 text-center">
                  <Link
                    href="/journal"
                    className="text-[0.7rem] tracking-[0.22em] uppercase text-coven-fog/75 hover:text-coven-soft-gold transition-colors"
                  >
                    Save this thread to your grimoire →
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReadingBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="relative">
      <div className="coven-kicker mb-3">{label}</div>
      <p className="font-serif text-[1.1rem] md:text-[1.18rem] text-coven-bone leading-[1.85] tracking-wide whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}
