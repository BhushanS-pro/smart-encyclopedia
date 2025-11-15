# Dynamic Content System

This app now supports **dynamic daily content** that updates automatically without repeating topics. You can use either AI-powered generation or manual curation with a database.

## 🎯 Architecture Overview

The system uses a **hybrid approach**:

1. **Backend Service** (runs daily) → Generates/curates content → Stores in Firebase
2. **Mobile/Web App** → Fetches from Firebase → Caches locally → Falls back to static content

## 📋 Setup Options

### Option 1: AI-Powered Daily Content (Recommended)

**Pros:**
- Fully automated
- Fresh content every day
- Can include trending topics and "on this day" events
- No manual work required

**Cons:**
- Requires AI API key (costs money)
- Less control over specific topics

#### Setup Steps:

1. **Get Firebase credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing
   - Go to Project Settings > General
   - Add a web app and copy the config

2. **Get OpenAI API key:**
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your account settings

3. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your credentials
   ```

4. **Set up daily content generation:**
   
   **Option A: Cloud Functions (Recommended)**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login
   firebase login
   
   # Initialize Functions
   firebase init functions
   
   # Deploy scheduled function (see scripts/cloudFunction.js)
   firebase deploy --only functions
   ```

   **Option B: Local Cron Job**
   ```bash
   # Install dependencies
   npm install dotenv
   
   # Run manually
   node scripts/generateDailyContent.js
   
   # Or set up cron (Linux/Mac)
   # Run daily at 2 AM
   0 2 * * * cd /path/to/SmartEncyclopedia && node scripts/generateDailyContent.js
   ```

   **Option C: GitHub Actions**
   - Create `.github/workflows/daily-content.yml`
   - Runs daily at scheduled time
   - See example in `scripts/githubActions.yml`

### Option 2: Manual Curation with Database

**Pros:**
- Full control over content
- No AI costs
- Can curate specific educational themes

**Cons:**
- Requires manual work
- Need to plan content in advance

#### Setup Steps:

1. **Set up Firebase** (same as above)

2. **Manually add content:**
   ```javascript
   // Use Firebase Console or create an admin script
   const topics = [
     {
       title: "Your Topic",
       subtitle: "Subtitle",
       image: "https://...",
       summary: "Summary",
       category: "Concepts"
     },
     // ... more topics
   ];
   
   // Save to Firebase
   await saveDailyTopics(topics);
   ```

3. **Create content schedule:**
   - Plan topics for each day
   - Use a spreadsheet or content management system
   - Upload to Firebase daily (or batch upload for the week)

## 🔧 Configuration

### Firebase Setup

1. Create a Firestore database in Firebase Console
2. Set up security rules (for production):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /dailyContent/{date} {
         // Allow read for everyone
         allow read: if true;
         // Only allow write with authentication (for admin)
         allow write: if request.auth != null;
       }
     }
   }
   ```

### Environment Variables

Create a `.env` file in the project root:

```env
FIREBASE_API_KEY=your-key
FIREBASE_AUTH_DOMAIN=your-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
OPENAI_API_KEY=your-openai-key  # Optional
```

For Expo, also add to `app.json`:

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "your-key",
      "firebaseAuthDomain": "your-domain",
      "firebaseProjectId": "your-project-id",
      "firebaseStorageBucket": "your-bucket",
      "firebaseMessagingSenderId": "your-sender-id",
      "firebaseAppId": "your-app-id"
    }
  }
}
```

## 📱 App Integration

The app automatically:
1. ✅ Fetches daily topics from Firebase on launch
2. ✅ Caches content locally for offline access
3. ✅ Falls back to static content if Firebase is unavailable
4. ✅ Refreshes content when needed

No code changes needed - it's already integrated!

## 🚀 Deployment Options

### Firebase Cloud Functions (Best for Production)

```javascript
// functions/index.js
const functions = require('firebase-functions');
const { main } = require('../scripts/generateDailyContent');

exports.generateDailyContent = functions.pubsub
  .schedule('0 2 * * *') // Daily at 2 AM
  .timeZone('America/New_York')
  .onRun(async (context) => {
    await main();
  });
```

### AWS Lambda + EventBridge

- Create Lambda function
- Set up EventBridge rule for daily trigger
- Deploy the script

### GitHub Actions

See `scripts/githubActions.yml` for example workflow.

## 💡 Content Strategy Tips

1. **Mix categories:** Include variety (People, Places, Events, Concepts, Science)
2. **Timely topics:** Use "on this day" events for relevance
3. **Educational value:** Focus on learning and discovery
4. **Visual appeal:** Use high-quality Wikipedia Commons images
5. **Diversity:** Cover different time periods, cultures, and fields

## 🔍 Monitoring

Check Firebase Console to verify:
- Content is being generated daily
- Topics are diverse and relevant
- Images are loading correctly

## 🆘 Troubleshooting

**Content not updating?**
- Check Firebase connection
- Verify environment variables
- Check Cloud Functions logs (if using)

**AI generation failing?**
- Verify API key is valid
- Check API quota/limits
- Falls back to Wikipedia automatically

**Images not loading?**
- Verify image URLs are valid Wikipedia Commons links
- Check network connectivity

## 📊 Cost Estimation

**Firebase (Firestore):**
- Free tier: 50K reads/day, 20K writes/day
- Should be sufficient for most apps

**OpenAI API:**
- ~$0.01-0.03 per daily generation (12 topics)
- ~$0.30-1.00/month

**Alternative:** Use Wikipedia API (free) as fallback

## 🎓 Next Steps

1. Set up Firebase project
2. Configure environment variables
3. Deploy content generation service
4. Test with the app
5. Monitor and adjust content strategy

For questions or issues, check the code comments in:
- `lib/firebase.ts` - Firebase integration
- `lib/aiContentService.ts` - AI content generation
- `lib/dailyContentService.ts` - Content fetching/caching
- `scripts/generateDailyContent.js` - Backend script

