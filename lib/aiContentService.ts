/**
 * AI Content Service
 * 
 * This service can generate daily curated topics using AI APIs.
 * You can use OpenAI, Anthropic, or any other AI service.
 * 
 * For production, this should run as a backend service (Cloud Functions, etc.)
 * that runs daily to generate and store content in Firebase.
 */

import { CuratedTopic } from './firebase';
import { EncyclopediaCategory } from '@/constants/topics';

// AI Service Configuration
interface AIConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

// Example: OpenAI integration
export async function generateDailyTopicsWithOpenAI(
  config: AIConfig,
  count: number = 12
): Promise<CuratedTopic[]> {
  const { apiKey, model = 'gpt-4', baseUrl = 'https://api.openai.com/v1' } = config;

  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const categories: EncyclopediaCategory[] = [
    'Concepts',
    'People',
    'Places',
    'Events',
    'Science & Nature',
  ];

  const prompt = `You are a curator for an educational encyclopedia app. Generate ${count} diverse, engaging topics for today (${dateStr}).

Requirements:
- Mix of categories: ${categories.join(', ')}
- Include topics related to today's date (historical events, birthdays, etc.)
- Include trending educational topics
- Each topic should have:
  - title: Clear, engaging title
  - subtitle: Brief, intriguing subtitle
  - image: A Wikipedia Commons image URL (must be valid)
  - summary: 1-2 sentence educational summary
  - category: One of ${categories.join(', ')}

Return ONLY a valid JSON array of topics, no other text. Format:
[
  {
    "title": "Topic Title",
    "subtitle": "Brief subtitle",
    "image": "https://upload.wikimedia.org/...",
    "summary": "Educational summary",
    "category": "Concepts"
  }
]`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful educational content curator. Always return valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON format in AI response');
    }

    const topics: CuratedTopic[] = JSON.parse(jsonMatch[0]);

    // Validate and ensure all required fields
    return topics.map((topic) => ({
      title: topic.title || 'Untitled',
      subtitle: topic.subtitle || '',
      image: topic.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
      summary: topic.summary || '',
      category: topic.category || 'Concepts',
    }));
  } catch (error) {
    console.error('Error generating topics with OpenAI:', error);
    throw error;
  }
}

// Example: Anthropic Claude integration
export async function generateDailyTopicsWithClaude(
  config: AIConfig,
  count: number = 12
): Promise<CuratedTopic[]> {
  const { apiKey, model = 'claude-3-sonnet-20240229', baseUrl = 'https://api.anthropic.com/v1' } = config;

  if (!apiKey) {
    throw new Error('Anthropic API key is required');
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const categories: EncyclopediaCategory[] = [
    'Concepts',
    'People',
    'Places',
    'Events',
    'Science & Nature',
  ];

  const prompt = `You are a curator for an educational encyclopedia app. Generate ${count} diverse, engaging topics for today (${dateStr}).

Requirements:
- Mix of categories: ${categories.join(', ')}
- Include topics related to today's date (historical events, birthdays, etc.)
- Include trending educational topics
- Each topic should have:
  - title: Clear, engaging title
  - subtitle: Brief, intriguing subtitle
  - image: A Wikipedia Commons image URL (must be valid)
  - summary: 1-2 sentence educational summary
  - category: One of ${categories.join(', ')}

Return ONLY a valid JSON array of topics, no other text.`;

  try {
    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('No content returned from Anthropic');
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON format in AI response');
    }

    const topics: CuratedTopic[] = JSON.parse(jsonMatch[0]);

    // Validate and ensure all required fields
    return topics.map((topic) => ({
      title: topic.title || 'Untitled',
      subtitle: topic.subtitle || '',
      image: topic.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
      summary: topic.summary || '',
      category: topic.category || 'Concepts',
    }));
  } catch (error) {
    console.error('Error generating topics with Claude:', error);
    throw error;
  }
}

// Fallback: Generate topics based on Wikipedia trending/popular pages
export async function generateDailyTopicsFromWikipedia(count: number = 12): Promise<CuratedTopic[]> {
  try {
    // Get today's date for historical events
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Wikipedia API for "On this day" events
    const onThisDayUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;
    
    const response = await fetch(onThisDayUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Wikipedia data');
    }

    const data = await response.json();
    const events = data.events || [];
    const births = data.births || [];
    const deaths = data.deaths || [];

    // Combine and select diverse topics
    const allTopics: any[] = [];
    
    // Add historical events
    events.slice(0, 4).forEach((event: any) => {
      allTopics.push({
        title: event.text,
        subtitle: `Historical event from ${event.year}`,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
        summary: `Learn about this significant event that occurred on this day in ${event.year}.`,
        category: 'Events',
      });
    });

    // Add notable people
    [...births, ...deaths].slice(0, 4).forEach((person: any) => {
      allTopics.push({
        title: person.text,
        subtitle: person.pages?.[0]?.description || 'Notable figure',
        image: person.thumbnail?.source || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
        summary: `Discover the life and contributions of ${person.text}.`,
        category: 'People',
      });
    });

    // Fill remaining with popular/trending topics
    const popularTopics = [
      { title: 'Quantum Computing', category: 'Concepts' },
      { title: 'Climate Change', category: 'Science & Nature' },
      { title: 'Artificial Intelligence', category: 'Concepts' },
      { title: 'Mount Everest', category: 'Places' },
    ];

    popularTopics.slice(0, count - allTopics.length).forEach((topic) => {
      allTopics.push({
        title: topic.title,
        subtitle: 'Explore this fascinating topic',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
        summary: `Learn more about ${topic.title} and its significance.`,
        category: topic.category,
      });
    });

    return allTopics.slice(0, count) as CuratedTopic[];
  } catch (error) {
    console.error('Error generating topics from Wikipedia:', error);
    // Return fallback topics
    return getFallbackTopics();
  }
}

// Fallback topics if all else fails
function getFallbackTopics(): CuratedTopic[] {
  return [
    {
      title: 'Quantum Mechanics',
      subtitle: 'How the smallest particles behave',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/QM_Planck_scale_graph-crop.svg',
      summary: 'Dive into the counterintuitive world that powers lasers, semiconductors, and modern physics.',
      category: 'Concepts',
    },
    {
      title: 'Photosynthesis',
      subtitle: 'Sunlight into chemical energy',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Photosynthesis.png',
      summary: 'Understand the process that sustains life on Earth by turning light into fuel.',
      category: 'Science & Nature',
    },
  ];
}

