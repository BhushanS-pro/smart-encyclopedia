# Where to Add Your ChatGPT API Key

## 📍 Location: `.env` file in the project root

Your ChatGPT (OpenAI) API key should be added to the **`.env`** file in the root directory of your project.

## 🔑 Steps to Add Your API Key

1. **Open the `.env` file** in the project root:
   ```
   SmartEncyclopedia/.env
   ```

2. **Find this line:**
   ```env
   OPENAI_API_KEY=your-chatgpt-api-key-here
   ```

3. **Replace `your-chatgpt-api-key-here` with your actual API key:**
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Save the file**

## 🔐 Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste it in the `.env` file

## ⚠️ Important Notes

- **Never commit `.env` to Git** - It's already in `.gitignore`
- **The API key is only used by the backend script** (`scripts/generateDailyContent.js`)
- **The mobile app doesn't need the API key** - It only reads from Firebase
- **Keep your API key secret** - Don't share it publicly

## 🚀 How It's Used

The backend script (`scripts/generateDailyContent.js`) reads the API key from `.env`:

```javascript
// The script automatically loads .env
require('dotenv').config();

// Then uses it like this:
const apiKey = process.env.OPENAI_API_KEY;
```

## 📝 Example `.env` File

```env
# Firebase Configuration
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123

# ChatGPT/OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ✅ Testing

After adding your API key, test it by running:

```bash
cd scripts
node generateDailyContent.js
```

You should see:
```
🚀 Generating daily content...
📅 Date: 2025-11-12
🤖 Using AI to generate topics...
✅ Generated 12 topics using AI
✅ Saved 12 topics for 2025-11-12
✨ Daily content generation complete!
```

## 🔄 Alternative: Firebase Cloud Functions

If you're using Firebase Cloud Functions, set the API key using:

```bash
firebase functions:config:set openai.key="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Then deploy:
```bash
firebase deploy --only functions
```

## ❓ Troubleshooting

**Script says "Using Wikipedia" instead of AI?**
- Check that `OPENAI_API_KEY` is set correctly in `.env`
- Make sure there are no extra spaces or quotes
- Verify the API key is valid at https://platform.openai.com/api-keys

**Getting API errors?**
- Check your OpenAI account has credits
- Verify the API key has proper permissions
- Check rate limits on your OpenAI account

