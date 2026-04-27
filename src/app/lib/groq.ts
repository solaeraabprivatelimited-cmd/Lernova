/**
 * Groq AI Mentor Integration - Backend Proxy
 * Fast, unlimited inference for educational assistance
 * 
 * 🔒 SECURITY NOTE: API calls now go through backend (Lernova_API)
 * Frontend no longer handles Groq API keys directly
 * All actual Groq API interactions happen server-side in Lernova_API/main.py
 */

import { createAppError, ERROR_CODES, type AppError } from '@/errors';
import { BASE_URL } from './api';

const BACKEND_AI_MENTOR_ENDPOINT = `${BASE_URL}/api/ai-mentor/chat`;

type MessageRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: MessageRole;
  content: string;
}

function buildAiMentorUrl(options?: { type?: string; stream?: boolean }): string {
  const url = new URL(BACKEND_AI_MENTOR_ENDPOINT);
  if (options?.type) {
    url.searchParams.set('type', options.type);
  }
  if (options?.stream) {
    url.searchParams.set('stream', 'true');
  }
  return url.toString();
}

/**
 * Send message to AI mentor through backend
 */
export async function getAiMentorResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const response = await fetch(buildAiMentorUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        type: 'explanation',
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        error.detail || `AI mentor service error: ${response.status}`,
        { endpoint: 'ai-mentor/chat', status: response.status },
        response.status
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    // If already an AppError, rethrow it
    if (error.code) throw error;
    
    throw createAppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to get AI response. Please check your connection and try again.',
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
    const response = await fetch(buildAiMentorUrl({ type: 'explanation' }), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Explain ${topic} for a ${level} learner.`,
        history: [],
        type: 'explanation',
      })
    });

    if (!response.ok) {
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        `Failed to generate explanation for "${topic}". Please try again.`,
        { endpoint: 'ai-mentor/chat?type=explanation', topic, level },
        response.status
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    if (error.code) throw error;
    
    throw createAppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to get explanation. Please check your connection and try again.',
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
    const response = await fetch(buildAiMentorUrl({ stream: true }), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        type: 'explanation',
      })
    });

    if (!response.ok) {
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        'Failed to stream AI response. Please try again.',
        { endpoint: 'ai-mentor/chat?stream=true', status: response.status },
        response.status
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        'No response body from AI mentor service.',
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
    if (error.code) throw error;
    
    throw createAppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to stream AI response. Please check your connection and try again.',
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
    const response = await fetch(buildAiMentorUrl({ type: 'mood-checkin' }), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        type: 'mood-checkin',
      })
    });

    if (!response.ok) {
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        'Failed to get mood check-in support. Please try again.',
        { endpoint: 'ai-mentor/chat?type=mood-checkin', status: response.status },
        response.status
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    if (error.code) throw error;
    
    throw createAppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to get mood check-in response. Please check your connection and try again.',
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
    const response = await fetch(buildAiMentorUrl({ type: 'mood-checkin', stream: true }), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        type: 'mood-checkin',
      })
    });

    if (!response.ok) {
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        'Failed to stream mood check-in response. Please try again.',
        { endpoint: 'ai-mentor/chat?type=mood-checkin&stream=true', status: response.status },
        response.status
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw createAppError(
        ERROR_CODES.NETWORK_ERROR,
        'No response body from mood check-in service.',
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
    if (error.code) throw error;
    
    throw createAppError(
      ERROR_CODES.NETWORK_ERROR,
      'Failed to stream mood check-in response. Please check your connection and try again.',
      { originalError: error.message }
    );
  }
}
