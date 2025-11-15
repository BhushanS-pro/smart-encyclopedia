# Quick Start Guide: Dynamic Content Setup

## 🚀 Fast Setup (5 minutes)

### Step 1: Choose Your Approach

**Option A: AI-Powered (Recommended)**
- Fully automated daily content
- Requires OpenAI API key (~$1/month)
- Best for hands-off operation

**Option B: Manual Curation**
- Full control over content
- No API costs
- Requires manual updates

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**
4. Go to Project Settings > General
5. Add a **Web app** and copy the config

### Step 3: Configure Environment

**For Expo (app.json):**
```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "your-api-key",
      "firebaseAuthDomain": "your-project.firebaseapp.com",
      "firebaseProjectId": "your-project-id",
      "firebaseStorageBucket": "your-project.appspot.com",
      "firebaseMessagingSenderId": "your-sender-id",
      "firebaseAppId": "your-app-id"
    }
  }
}
```

**For Backend Script (.env):**
```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
OPENAI_API_KEY=your-openai-key  # Optional
```

### Step 4: Generate Content

**Option A: Run Script Manually**
```bash
cd scripts
npm install dotenv
node generateDailyContent.js
```

**Option B: Set Up Cloud Function**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init functions`
4. Copy `scripts/cloudFunction.js` to `functions/index.js`
5. Deploy: `firebase deploy --only functions`

**Option C: Manual Upload**
Use Firebase Console to add content to `dailyContent/{YYYY-MM-DD}` collection.

### Step 5: Test the App

```bash
npm start
# Press 'w' for web, 'a' for Android, 'i' for iOS
```

The app will automatically:
- ✅ Fetch daily topics from Firebase
- ✅ Cache locally for offline access
- ✅ Fall back to static content if Firebase unavailable

## 📋 What Happens Next?

1. **Daily Content Generation**: Your backend service runs daily and generates fresh topics
2. **App Fetches Content**: App checks Firebase for today's content on launch
3. **Local Caching**: Content is cached for offline access
4. **Automatic Updates**: New content appears daily without app updates

## 🎯 Content Structure

Each topic in Firebase should have:
```json
{
  "title": "Topic Title",
  "subtitle": "Brief subtitle",
  "image": "https://upload.wikimedia.org/...",
  "summary": "Educational summary",
  "category": "Concepts" | "People" | "Places" | "Events" | "Science & Nature"
}
```

## 🔧 Troubleshooting

**App shows static content?**
- Check Firebase config in app.json
- Verify Firestore has content for today
- Check console for errors

**Content not generating?**
- Verify API keys are set correctly
- Check backend service logs
- Ensure Firestore rules allow reads

**Need help?**
- See `README_DYNAMIC_CONTENT.md` for detailed docs
- Check code comments in `lib/firebase.ts` and `lib/dailyContentService.ts`

## 💡 Pro Tips

1. **Start Simple**: Use Wikipedia fallback first, add AI later
2. **Monitor Costs**: Firebase free tier is generous, OpenAI is ~$1/month
3. **Test Locally**: Run the script manually before automating
4. **Content Quality**: Review AI-generated topics and adjust prompts as needed

