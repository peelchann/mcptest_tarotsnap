// Unit tests for ChatStorageService
// Tests all CRUD operations and authentication handling

// Mock the createBrowserSupabaseClient function
jest.mock('../../supabase', () => ({
  createBrowserSupabaseClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  })),
}));

import { ChatStorageService } from '../chatStorage';
import { createBrowserSupabaseClient } from '../../supabase';

describe('ChatStorageService', () => {
  let chatStorage: ChatStorageService;
  let mockSupabaseClient: any;
  const mockUser = { id: 'test-user-123' };
  const mockSession = {
    id: 'session-123',
    user_id: 'test-user-123',
    title: 'Test Session',
    created_at: '2025-01-09T12:00:00Z',
    updated_at: '2025-01-09T12:00:00Z',
  };
  const mockMessage = {
    id: 'message-123',
    user_id: 'test-user-123',
    session_id: 'session-123',
    role: 'user' as const,
    content: 'Test message',
    created_at: '2025-01-09T12:00:00Z',
    metadata: { test: 'data' },
  };

  beforeEach(() => {
    mockSupabaseClient = (createBrowserSupabaseClient as jest.Mock)();
    chatStorage = new ChatStorageService();
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await chatStorage.createChatSession({ title: 'Test' });

      expect(result.error).toEqual({ message: 'User not authenticated' });
      expect(result.data).toBeNull();
    });

    it('should proceed when user is authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
        }),
      });
      mockSupabaseClient.from.mockReturnValue({ insert: mockInsert });

      const result = await chatStorage.createChatSession({ title: 'Test Session' });

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockSession);
    });
  });

  describe('createChatSession', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    });

    it('should create a chat session with provided title', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
        }),
      });
      mockSupabaseClient.from.mockReturnValue({ insert: mockInsert });

      const result = await chatStorage.createChatSession({
        title: 'Custom Title',
        readingId: 'reading-123',
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_sessions');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        reading_id: 'reading-123',
        title: 'Custom Title',
      });
      expect(result.data).toEqual(mockSession);
    });

    it('should create a chat session with default title when none provided', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockSession, error: null }),
        }),
      });
      mockSupabaseClient.from.mockReturnValue({ insert: mockInsert });

      await chatStorage.createChatSession({});

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUser.id,
          title: expect.stringContaining('Chat Session'),
        })
      );
    });
  });

  describe('storeChatMessage', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    });

    it('should store a chat message with all metadata', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockMessage, error: null }),
        }),
      });
      mockSupabaseClient.from.mockReturnValue({ insert: mockInsert });

      const messageData = {
        role: 'user' as const,
        content: 'Test message content',
        sessionId: 'session-123',
        readingId: 'reading-123',
        metadata: { card_name: 'The Fool', context: 'test' },
      };

      const result = await chatStorage.storeChatMessage(messageData);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_messages');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        role: 'user',
        content: 'Test message content',
        session_id: 'session-123',
        reading_id: 'reading-123',
        metadata: { card_name: 'The Fool', context: 'test' },
      });
      expect(result.data).toEqual(mockMessage);
    });

    it('should handle AI messages correctly', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { ...mockMessage, role: 'ai' }, error: null }),
        }),
      });
      mockSupabaseClient.from.mockReturnValue({ insert: mockInsert });

      const result = await chatStorage.storeChatMessage({
        role: 'ai',
        content: 'AI response',
        metadata: { response_type: 'interpretation' },
      });

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'ai',
          content: 'AI response',
          metadata: { response_type: 'interpretation' },
        })
      );
    });
  });

  describe('getChatHistory', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    });

    it('should retrieve chat history for authenticated user', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: [mockMessage], error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await chatStorage.getChatHistory({
        sessionId: 'session-123',
        limit: 10,
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_messages');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUser.id);
      expect(mockQuery.eq).toHaveBeenCalledWith('session_id', 'session-123');
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: true });
      expect(result.data).toEqual([mockMessage]);
    });

    it('should handle query options correctly', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await chatStorage.getChatHistory({
        readingId: 'reading-123',
        limit: 20,
        offset: 10,
      });

      expect(mockQuery.eq).toHaveBeenCalledWith('reading_id', 'reading-123');
      expect(mockQuery.limit).toHaveBeenCalledWith(20);
      expect(mockQuery.range).toHaveBeenCalledWith(10, 29);
    });
  });

  describe('deleteChatMessage', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    });

    it('should delete a specific message for authenticated user', async () => {
      const mockDelete = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };
      mockDelete.eq.mockResolvedValue({ error: null });
      mockSupabaseClient.from.mockReturnValue(mockDelete);

      const result = await chatStorage.deleteChatMessage('message-123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('chat_messages');
      expect(mockDelete.delete).toHaveBeenCalled();
      expect(mockDelete.eq).toHaveBeenCalledWith('id', 'message-123');
      expect(mockDelete.eq).toHaveBeenCalledWith('user_id', mockUser.id);
      expect(result.error).toBeNull();
    });
  });

  describe('analyzeChatContent', () => {
    it('should analyze chat content and return metadata', async () => {
      const content = 'I drew The Fool card and feel excited about new beginnings';
      const context = {
        readingId: 'reading-123',
        cardDrawn: 'The Fool',
        userQuestion: 'What should I focus on?',
      };

      const result = await chatStorage.analyzeChatContent(content, context);

      expect(result).toEqual(
        expect.objectContaining({
          content_length: content.length,
          reading_id: context.readingId,
          card_mentioned: context.cardDrawn,
          user_question: context.userQuestion,
          timestamp: expect.any(String),
        })
      );
    });

    it('should handle content without context', async () => {
      const content = 'This is a simple message';

      const result = await chatStorage.analyzeChatContent(content);

      expect(result).toEqual(
        expect.objectContaining({
          content_length: content.length,
          timestamp: expect.any(String),
        })
      );
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    });

    it('should handle database errors gracefully', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        }),
      });
      mockSupabaseClient.from.mockReturnValue({ insert: mockInsert });

      const result = await chatStorage.createChatSession({ title: 'Test' });

      expect(result.error).toEqual({ message: 'Database error' });
      expect(result.data).toBeNull();
    });
  });
}); 