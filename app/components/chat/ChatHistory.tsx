'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { chatStorage } from '@/lib/services/chatStorage';
import type { ChatSession, ChatMessage } from '@/lib/services/chatStorage';
import { 
  MessageCircle, 
  Clock, 
  Sparkles, 
  ChevronRight,
  History,
  Calendar,
  User,
  Bot
} from 'lucide-react';

interface ChatHistoryProps {
  onSessionSelect?: (sessionId: string) => void;
  className?: string;
}

export function ChatHistory({ onSessionSelect, className = '' }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionPreviews, setSessionPreviews] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get chat sessions
      const { data: sessionsData, error: sessionsError } = await chatStorage.getChatSessions({
        limit: 10
      });

      if (sessionsError) {
        setError('Failed to load chat history');
        return;
      }

      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        return;
      }

      setSessions(sessionsData);

      // Get preview messages for each session
      const previews: Record<string, ChatMessage[]> = {};
      
      for (const session of sessionsData) {
        const { data: messages } = await chatStorage.getChatHistory({
          sessionId: session.id,
          limit: 3
        });
        
        if (messages) {
          previews[session.id] = messages;
        }
      }

      setSessionPreviews(previews);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Unable to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getSessionPreview = (sessionId: string) => {
    const messages = sessionPreviews[sessionId];
    if (!messages || messages.length === 0) return 'No messages yet';
    
    // Get the first user message or AI message
    const firstMessage = messages.find(m => m.role === 'user') || messages[0];
    return firstMessage.content.length > 60 
      ? firstMessage.content.substring(0, 60) + '...'
      : firstMessage.content;
  };

  const getMessageCount = (sessionId: string) => {
    const messages = sessionPreviews[sessionId];
    return messages ? messages.length : 0;
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 text-white/80">
          <History className="w-5 h-5" />
          <span className="text-sm">Loading chat history...</span>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-white/20 bg-white/5 backdrop-blur-md animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <Card className="border-red-400/50 bg-red-900/20 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-300">
              <MessageCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
            <Button 
              onClick={loadChatHistory}
              variant="ghost"
              size="sm"
              className="mt-2 text-red-300 hover:text-red-200"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={`${className}`}>
        <Card className="border-white/20 bg-white/5 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Chat History Yet</h3>
            <p className="text-white/70 text-sm">
              Your conversations with the AI Oracle will appear here after you start chatting during readings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-white/80 mb-4">
        <History className="w-5 h-5 text-gold-400" />
        <span className="text-sm font-medium">Recent Conversations</span>
        <span className="text-xs text-white/60">({sessions.length})</span>
      </div>

      <AnimatePresence>
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              onClick={() => onSessionSelect?.(session.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <h4 className="text-sm font-medium text-white truncate">
                        {session.title || 'Untitled Session'}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-white/70 mb-2 line-clamp-2">
                      {getSessionPreview(session.id)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(session.updated_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{getMessageCount(session.id)} messages</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {sessions.length >= 10 && (
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-white/70 hover:text-white/90 hover:bg-white/5"
          onClick={() => {
            // TODO: Implement pagination or "load more"
            console.log('Load more sessions');
          }}
        >
          <Clock className="w-4 h-4 mr-2" />
          Load More History
        </Button>
      )}
    </div>
  );
} 