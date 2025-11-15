/**
 * Firebase Cloud Function for Daily Content Generation
 * 
 * Deploy this as a scheduled Cloud Function:
 * 
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize: firebase init functions
 * 4. Copy this file to functions/index.js
 * 5. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Get today's date key
function getTodayDateKey() {
  return new Date().toISOString().split('T')[0];
}

// Generate topics using OpenAI
async function generateTopicsWithAI(apiKey) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const categories = ['Concepts', 'People', 'Places', 'Events', 'Science & Nature'];
  const prompt = `You are a curator for an educational encyclopedia app. Generate 12 diverse, engaging topics for today (${dateStr}).

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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
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

  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Invalid JSON format in AI response');
  }

  return JSON.parse(jsonMatch[0]);
}

// Generate topics from Wikipedia (fallback)
async function generateTopicsFromWikipedia() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const response = await fetch(
    `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Wikipedia data');
  }

  const data = await response.json();
  const events = data.events || [];
  const births = data.births || [];

  const topics = [];

  events.slice(0, 4).forEach((event) => {
    topics.push({
      title: event.text,
      subtitle: `Historical event from ${event.year}`,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
      summary: `Learn about this significant event that occurred on this day in ${event.year}.`,
      category: 'Events',
    });
  });

  [...births].slice(0, 4).forEach((person) => {
    topics.push({
      title: person.text,
      subtitle: person.pages?.[0]?.description || 'Notable figure',
      image:
        person.thumbnail?.source ||
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
      summary: `Discover the life and contributions of ${person.text}.`,
      category: 'People',
    });
  });

  const popularTopics = [
    { title: 'Quantum Computing', category: 'Concepts' },
    { title: 'Climate Change', category: 'Science & Nature' },
    { title: 'Artificial Intelligence', category: 'Concepts' },
    { title: 'Mount Everest', category: 'Places' },
  ];

  popularTopics.forEach((topic) => {
    topics.push({
      title: topic.title,
      subtitle: 'Explore this fascinating topic',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png',
      summary: `Learn more about ${topic.title} and its significance.`,
      category: topic.category,
    });
  });

  return topics.slice(0, 12);
}

// Scheduled function - runs daily at 2 AM EST
exports.generateDailyContent = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      console.log('🚀 Generating daily content...');
      const dateKey = getTodayDateKey();
      console.log(`📅 Date: ${dateKey}`);

      // Get OpenAI API key from environment
      const openaiKey = functions.config().openai?.key;

      let topics;

      if (openaiKey) {
        try {
          console.log('🤖 Using AI to generate topics...');
          topics = await generateTopicsWithAI(openaiKey);
          console.log(`✅ Generated ${topics.length} topics using AI`);
        } catch (error) {
          console.warn('⚠️  AI generation failed, falling back to Wikipedia:', error.message);
          topics = await generateTopicsFromWikipedia();
        }
      } else {
        console.log('📚 Using Wikipedia to generate topics...');
        topics = await generateTopicsFromWikipedia();
      }

      if (!topics || topics.length === 0) {
        throw new Error('No topics generated');
      }

      // Save to Firestore
      const docRef = db.collection('dailyContent').doc(dateKey);
      await docRef.set({
        date: dateKey,
        topics,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Saved ${topics.length} topics for ${dateKey}`);
      console.log('✨ Daily content generation complete!');

      return null;
    } catch (error) {
      console.error('❌ Error generating daily content:', error);
      throw error;
    }
  });

// To set the OpenAI API key:
// firebase functions:config:set openai.key="your-api-key-here"

