# How to Get Your OpenAI API Key (Step-by-Step Guide)

## 🔐 Step 1: Create/Login to OpenAI Account

1. **Go to OpenAI's website:**
   - Visit: https://platform.openai.com/
   - Or directly: https://chat.openai.com/

2. **Sign up or Log in:**
   - If you don't have an account: Click "Sign up" and create an account
   - If you have an account: Click "Log in"
   - You can use:
     - Google account
     - Microsoft account
     - Email address

3. **Verify your email** (if new account):
   - Check your email inbox
   - Click the verification link

## 💳 Step 2: Add Payment Method (Required)

OpenAI requires a payment method to use the API:

1. **Go to Billing Settings:**
   - Click on your profile (top right)
   - Select "Billing" or "Settings" > "Billing"

2. **Add Payment Method:**
   - Click "Add payment method"
   - Enter credit/debit card details
   - **Note:** You get $5 free credits to start (as of 2024)
   - They only charge for what you use

3. **Set Usage Limits (Optional):**
   - You can set a monthly spending limit
   - Recommended: Set a limit ($5-10/month) to avoid surprises

## 🔑 Step 3: Get Your API Key

1. **Navigate to API Keys:**
   - Go to: https://platform.openai.com/api-keys
   - Or: Click your profile → "API keys" → "Create new secret key"

2. **Create New Key:**
   - Click "Create new secret key" button
   - Give it a name (e.g., "Smart Encyclopedia")
   - Click "Create secret key"

3. **Copy the Key:**
   - **⚠️ IMPORTANT:** Copy the key immediately
   - It will only be shown once!
   - The key starts with `sk-` or `sk-proj-`
   - Example: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. **Save the Key:**
   - Paste it in your `.env` file:
     ```
     OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```

## ⚠️ Troubleshooting

### "401 Unauthorized" Error

**Problem:** You're not logged in or session expired.

**Solution:**
1. Clear browser cache/cookies
2. Go to https://platform.openai.com/ directly
3. Click "Log in" and sign in again
4. Then go to https://platform.openai.com/api-keys

### "Access Denied" Error

**Problem:** Account not activated for API access.

**Solution:**
1. Make sure you've verified your email
2. Add a payment method
3. Wait a few minutes and try again

### Can't Find API Keys Page

**Alternative Methods:**

**Method 1: Direct Link**
- https://platform.openai.com/api-keys

**Method 2: Through Settings**
1. Go to https://platform.openai.com/
2. Click your profile (top right)
3. Select "API keys" or "Settings"
4. Click "API keys" in the sidebar

**Method 3: Use ChatGPT Plus Dashboard**
1. Go to https://chat.openai.com/
2. Click your name → "Settings"
3. Look for "API" section

### No Payment Method Added

**Required:** OpenAI requires a payment method, but:
- They give $5 free credits
- You can set spending limits
- They only charge for actual API usage
- Cost for our app: ~$0.01-0.03 per day (~$0.30-1.00/month)

## ✅ Verify Your Key Works

After adding your API key to `.env`, test it:

```bash
cd SmartEncyclopedia
cd scripts
node generateDailyContent.js
```

**If working, you'll see:**
```
🚀 Generating daily content...
📅 Date: 2025-11-12
🤖 Using AI to generate topics...
✅ Generated 12 topics using AI
✅ Saved 12 topics for 2025-11-12
✨ Daily content generation complete!
```

**If key is invalid, you'll see:**
```
⚠️  AI generation failed, falling back to Wikipedia: [error message]
```

## 🔄 Alternative: Use Wikipedia (Free, No API Key Needed)

If you don't want to use OpenAI, the script will automatically:
- Fall back to Wikipedia's "On This Day" API (free)
- Generate topics from historical events and notable people
- Still work perfectly, just without AI-generated summaries

Just leave `OPENAI_API_KEY` empty or don't set it in `.env`.

## 💡 Pro Tips

1. **Keep Multiple Keys:**
   - Create separate keys for different projects
   - Name them clearly (e.g., "SmartEncyclopedia-Prod", "SmartEncyclopedia-Dev")

2. **Rotate Keys:**
   - If a key is compromised, delete it and create a new one
   - Old keys won't work after deletion

3. **Monitor Usage:**
   - Check https://platform.openai.com/usage regularly
   - Set up usage alerts in billing settings

4. **Free Alternative:**
   - The app works great with Wikipedia fallback too!
   - No costs, no API key needed
   - Just leave `OPENAI_API_KEY` empty

## 📞 Need More Help?

- **OpenAI Support:** https://help.openai.com/
- **OpenAI Documentation:** https://platform.openai.com/docs
- **Pricing:** https://openai.com/pricing

## 🎯 Quick Checklist

- [ ] Create OpenAI account
- [ ] Verify email
- [ ] Add payment method
- [ ] Go to API keys page
- [ ] Create new secret key
- [ ] Copy the key
- [ ] Paste in `.env` file as `OPENAI_API_KEY=your-key-here`
- [ ] Test with `node scripts/generateDailyContent.js`

