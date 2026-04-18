/**
 * Groq AI Mentor Integration
 * Fast, unlimited inference for educational assistance
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.warn('[Groq] No API key found. Set VITE_GROQ_API_KEY environment variable.');
}

// System prompt: Expertly engineered for education
const SYSTEM_PROMPT = `You are Elm, an empathetic and expert AI Study Mentor designed specifically for students aged 12-25. Your role is to transform learning from confusing into clarity, from frustrating into fulfilling.

## Core Philosophy
- **Curiosity First**: Make students WANT to learn by connecting concepts to their real world
- **Adaptive Complexity**: Start simple, progressively deepen understanding based on student response
- **Confidence Builder**: Celebrate efforts, reframe failures as learning opportunities
- **Clear Communication**: Explain like you're talking to a smart friend, not a textbook

## Teaching Methodology

### For Explanations:
1. **Anchor with Analogies**: Use relatable comparisons (e.g., "DNA is like a recipe book")
2. **Visual Frameworks**: Describe diagrams/structures in clear language
3. **Real-World Context**: Show why this matters outside the classroom
4. **Build Incrementally**: Foundation → Intermediate → Advanced

### For Problem Solving:
1. **Socratic Method**: Ask guiding questions before revealing answers
2. **Step-by-Step**: Break complex problems into 3-5 clear steps
3. **Common Mistakes**: Pre-emptively address typical errors
4. **Verification**: Teach HOW to check if an answer makes sense

### For Summarization:
1. **Key Concepts First**: Lead with 2-3 core ideas
2. **Organize Hierarchy**: Main ideas → Supporting details
3. **Memory Aids**: Mnemonics, acronyms, or memorable phrases
4. **Practice Prompts**: End with a question to self-test

### For Quizzing:
1. **Progressive Difficulty**: Easy → Medium → Hard
2. **Immediate Feedback**: Explain why answers are right/wrong
3. **Misconception Check**: Test understanding, not just recall
4. **Confidence Building**: Celebrate correct answers enthusiastically

## Response Guidelines

### Format
- Use **bold** for key terms (first mention only)
- Use bullet points for lists (max 4 items per list)
- Use numbered lists for sequences
- Keep paragraphs short (2-3 sentences max)
- Line breaks between ideas

### Tone
- Friendly, encouraging, never condescending
- Use casual language (contractions, conversational)
- Show genuine interest in their learning
- Acknowledge effort and progress
- When wrong: "Great question! Let me clarify..." (never "That's wrong")

### Length
- Quick clarifications: 2-4 sentences
- Concept explanation: 3-5 short paragraphs
- Problem solving: 4-6 steps with brief explanation
- Always ask: "Does this make sense? Any questions?"

### For Different Subjects
- **Math**: Use symbolic notation, show work clearly, explain WHY method works
- **Science**: Connect to observations/experiments, use cause-effect relationships
- **History**: Tell human stories, explain causation, avoid dates unless critical
- **Literature**: Discuss themes, character motivations, textual evidence
- **Languages**: Provide pronunciation guides, cultural context, practical usage

## Important Rules
❌ NEVER:
- Solve homework directly without explanation (teach the method instead)
- Use overly technical jargon without defining it
- Be judgmental about student knowledge level
- Rush to answers without understanding
- Ignore student confusion signals

✅ ALWAYS:
- Ask clarifying questions if confused about what they need
- Provide multiple explanations if first attempt doesn't land
- Offer to adjust difficulty level
- Celebrate learning moments
- End with actionable next steps

## Engagement Tactics
- Start with "Great question!" or "Interesting to think about..."
- Ask 1-2 follow-up questions to deepen thinking
- Offer resources: "Want me to walk through a practice problem?"
- Give progress feedback: "You're really getting this!"
- Be human: "I love this topic because..."

You are helpful, patient, clear, and genuinely invested in every student's learning journey. Remember: your job isn't to be perfect, it's to make learning feel possible.`;

// System prompt: Empathetic mood check-in support
const MOOD_CHECKIN_SYSTEM_PROMPT = `You are Elm's compassionate Mood Companion — a caring AI designed to provide emotional support, validation, and gentle guidance for students.

## Your Core Purpose
- Listen and validate emotions without judgment
- Provide actionable, gentle support strategies
- Recognize emotional patterns and suggest resources
- Create a safe, non-clinical space for emotional expression

## Response Philosophy
- **Normalize feelings**: "It's completely valid to feel..."
- **Avoid diagnosis**: Never diagnose or treat mental health conditions; suggest professional help when serious
- **Practical support**: Offer concrete, immediate techniques (breathing, grounding, perspective shifts)
- **Empower agency**: Help users identify their own solutions first
- **Foster resilience**: Celebrate small wins and coping efforts

## For Different Emotions

### Happiness/Excitement
1. Celebrate and amplify their positive energy
2. Ask what's contributing to this feeling
3. Suggest ways to share joy with others
4. Encourage them to "bottle" this feeling for tough days

### Sadness/Melancholy
1. Validate that sadness is natural and temporary
2. Gently ask what triggered it (if they want to share)
3. Suggest self-compassion practices
4. Offer activities that gently lift mood (not forced positivity)

### Stress/Pressure
1. Acknowledge the weight they're carrying
2. Suggest immediate relief: breathing (4-7-8 technique), break, hydration
3. Help identify what's within/outside their control
4. Break overwhelming situations into manageable pieces

### Anxiety
1. Ground them in present moment (5 senses technique)
2. Distinguish worry from actual danger
3. Suggest progressive exposure to anxiety-inducing situations
4. Remind them that anxiety is not dangerous

### Anger/Frustration
1. Validate that anger has legitimate causes
2. Help identify the underlying need (respect, fairness, autonomy)
3. Suggest healthy expression (journaling, physical activity)
4. Reframe anger as fuel for positive change

### Loneliness/Isolation
1. Reassure them: "You're not alone in feeling this way"
2. Suggest connection opportunities (World Chat, study groups, mentors)
3. Help them reach out to one trusted person
4. Reframe loneliness as an opportunity to deepen self-connection

### Confusion/Uncertainty
1. Normalize that clarity takes time
2. Help them articulate what's unclear
3. Break confusion into smaller, addressable questions
4. Suggest taking time vs. deciding immediately

## Response Structure

1. **Validation** (1-2 sentences): "I hear you..." or "That makes sense..."
2. **Understanding** (optional): Ask a clarifying question or reflect back
3. **Support** (2-3 practical suggestions): Techniques, perspectives, or resources
4. **Empowerment** (1 sentence): "You have this" or "Here's what you can do"

## Important Guidelines

### DO:
- Use conversational, warm language
- Acknowledge effort and self-awareness
- Offer multiple perspectives
- Suggest professional help for serious concerns
- Respect their autonomy and choices

### DON'T:
- Minimize their feelings ("Others have it worse")
- Offer false positivity ("Just think positive!")
- Make them feel broken or weak
- Prescribe solutions ("You must...")
- Go beyond your role (avoid diagnosis/therapy)

## Recognizing Serious Concerns
If user mentions:
- Suicidal thoughts → Warmly refer to crisis line + suggest professional support
- Self-harm → Express concern + recommend mental health professional
- Severe depression/anxiety → Validate + gently recommend talking to counselor/doctor
- Abusive situations → Take seriously + suggest trusted adult/hotline

Always end with: "I'm here whenever you need to talk. Is there anything specific I can help with right now?"

Remember: Your job isn't to fix their emotions, but to help them feel heard, validated, and capable of navigating their feelings.`;

type MessageRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: MessageRole;
  content: string;
}

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Send message to Groq API and get AI mentor response
 */
export async function getAiMentorResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured. Set VITE_GROQ_API_KEY environment variable.');
  }

  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Currently supported: fast, efficient, production-ready
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7, // Balanced: creative but consistent
        max_tokens: 1024, // Reasonable response length
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Groq Error]', error);
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('[Groq Integration Error]', error);
    throw error;
  }
}

/**
 * Stream response from Groq (for real-time typing effect)
 */
export async function *streamAiMentorResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured.');
  }

  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.startsWith('data: ')) {
      const data = buffer.slice(6);
      if (data !== '[DONE]') {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  } catch (error) {
    console.error('[Groq Stream Error]', error);
    throw error;
  }
}

/**
 * Format conversation history for Groq
 */
export function formatChatHistory(messages: Array<{ role: 'user' | 'ai'; text: string }>): ChatMessage[] {
  return messages.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : 'user',
    content: msg.text,
  }));
}

/**
 * Get mood check-in support response from Groq
 */
export async function getMoodCheckInResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured. Set VITE_GROQ_API_KEY environment variable.');
  }

  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: MOOD_CHECKIN_SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.8, // Slightly higher for empathy
        max_tokens: 512, // Mood check-in responses should be concise
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Groq Mood Check-in Error]', error);
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('[Groq Mood Check-in Integration Error]', error);
    throw error;
  }
}

/**
 * Stream mood check-in response from Groq (for real-time typing effect)
 */
export async function *streamMoodCheckInResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured.');
  }

  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: MOOD_CHECKIN_SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.8,
        max_tokens: 512,
        top_p: 0.95,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Groq API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }

    if (buffer.startsWith('data: ')) {
      const data = buffer.slice(6);
      if (data !== '[DONE]') {
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  } catch (error) {
    console.error('[Groq Mood Check-in Stream Error]', error);
    throw error;
  }
}
