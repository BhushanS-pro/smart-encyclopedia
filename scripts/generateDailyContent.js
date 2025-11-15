/**
 * Daily Content Generator Script
 * 
 * This script should run daily (via cron job, Cloud Functions, etc.)
 * to generate and store fresh content in Firebase.
 * 
 * Usage:
 *   node scripts/generateDailyContent.js
 * 
 * Or set up as a scheduled Cloud Function:
 *   - Firebase Cloud Functions with scheduled trigger
 *   - AWS Lambda with EventBridge
 *   - GitHub Actions with cron schedule
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get today's date key
function getTodayDateKey() {
  return new Date().toISOString().split('T')[0];
}

// Generate topics using AI (OpenAI example)
async function generateTopicsWithAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }

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

  // Parse JSON from response
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

  // Add historical events
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

  // Add notable people
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

  // Add popular topics
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

// Save topics to Firebase
async function saveTopics(topics) {
  const dateKey = getTodayDateKey();
  const docRef = doc(db, 'dailyContent', dateKey);

  const cacheData = {
    date: dateKey,
    topics,
    lastUpdated: Timestamp.now(),
  };

  await setDoc(docRef, cacheData);
  console.log(`✅ Saved ${topics.length} topics for ${dateKey}`);
}

// Main function
async function main() {
  try {
    console.log('🚀 Generating daily content...');
    console.log(`📅 Date: ${getTodayDateKey()}`);

    let topics;

    // Try AI generation first
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('🤖 Using AI to generate topics...');
        topics = await generateTopicsWithAI();
        console.log(`✅ Generated ${topics.length} topics using AI`);
      } catch (error) {
        console.warn('⚠️  AI generation failed, falling back to Wikipedia:', error.message);
        topics = await generateTopicsFromWikipedia();
      }
    } else {
      console.log('📚 Using Wikipedia to generate topics...');
      topics = await generateTopicsFromWikipedia();
    }

    // Validate topics
    if (!topics || topics.length === 0) {
      throw new Error('No topics generated');
    }

    // Save to Firebase
    await saveTopics(topics);

    console.log('✨ Daily content generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating daily content:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, generateTopicsWithAI, generateTopicsFromWikipedia };

