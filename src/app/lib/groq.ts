/**
 * Groq AI Mentor Integration - Backend Proxy
 * Fast, unlimited inference for educational assistance
 * 
 * 🔒 SECURITY NOTE: API calls now go through backend (Lernova_API)
 * Frontend no longer handles Groq API keys directly
 * All actual Groq API interactions happen server-side in Lernova_API/main.py
 */

import { AppError, ERROR_CODES } from '@/errors';

// Backend endpoint for AI mentor chat - uses VITE_API_URL environment variable
// Falls back to relative path for same-domain deployments
const getBackendEndpoint = (path: string): string => {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return apiUrl ? `${apiUrl}${path}` : path;
};

const BACKEND_AI_MENTOR_ENDPOINT = () => getBackendEndpoint('/api/ai-mentor/chat');

type MessageRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * Send message to AI mentor through backend
 */
export async function getAiMentorResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const response = await fetch(BACKEND_AI_MENTOR_ENDPOINT(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AppError(
        ERROR_CODES.API_ERROR,
        error.detail || `AI mentor service error: ${response.status}`,
        response.status,
        { endpoint: 'ai-mentor/chat', status: response.status }
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    throw new AppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to get AI response. Please check your connection and try again.',
      undefined,
      { originalError: error.message }
    );
  }
}

/**
 * Get AI tutoring explanation (with structured learning steps)
 */
export async function getAiTutoringExplanation(
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_AI_MENTOR_ENDPOINT()}?type=explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        level
      })
    });

    if (!response.ok) {
      throw new AppError(
        ERROR_CODES.API_ERROR,
        `Failed to generate explanation for "${topic}". Please try again.`,
        response.status,
        { endpoint: 'ai-mentor/chat?type=explanation', topic, level }
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    throw new AppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to get explanation. Please check your connection and try again.',
      undefined,
      { originalError: error.message }
    );
  }
}

/**
 * Stream response from backend (for real-time typing effect)
 */
export async function *streamAiMentorResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${BACKEND_AI_MENTOR_ENDPOINT()}?stream=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      throw new AppError(
        ERROR_CODES.API_ERROR,
        'Failed to stream AI response. Please try again.',
        response.status,
        { endpoint: 'ai-mentor/chat?stream=true', status: response.status }
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new AppError(
        ERROR_CODES.NETWORK_ERROR,
        'No response body from AI mentor service.',
        undefined,
        { endpoint: 'ai-mentor/chat?stream=true' }
      );
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield chunk;
    }
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    throw new AppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to stream AI response. Please check your connection and try again.',
      undefined,
      { originalError: error.message }
    );
  }
}

/**
 * Format conversation history for API
 */
export function formatChatHistory(messages: Array<{ role: 'user' | 'ai'; text: string }>): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : 'user',
    content: msg.text,
  }));
}

/**
 * Get mood check-in support response from backend
 */
export async function getMoodCheckInResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_AI_MENTOR_ENDPOINT()}?type=mood-checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      throw new AppError(
        ERROR_CODES.API_ERROR,
        'Failed to get mood check-in support. Please try again.',
        response.status,
        { endpoint: 'ai-mentor/chat?type=mood-checkin', status: response.status }
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    throw new AppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to get mood check-in response. Please check your connection and try again.',
      undefined,
      { originalError: error.message }
    );
  }
}

/**
 * Stream mood check-in response from backend (for real-time typing effect)
 */
export async function *streamMoodCheckInResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${BACKEND_AI_MENTOR_ENDPOINT()}?type=mood-checkin&stream=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      throw new AppError(
        ERROR_CODES.API_ERROR,
        'Failed to stream mood check-in response. Please try again.',
        response.status,
        { endpoint: 'ai-mentor/chat?type=mood-checkin&stream=true', status: response.status }
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new AppError(
        ERROR_CODES.NETWORK_ERROR,
        'No response body from mood check-in service.',
        undefined,
        { endpoint: 'ai-mentor/chat?type=mood-checkin&stream=true' }
      );
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield chunk;
    }
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    
    throw new AppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to stream mood check-in response. Please check your connection and try again.',
      undefined,
      { originalError: error.message }
    );
  }
}
