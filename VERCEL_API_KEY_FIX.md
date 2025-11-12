# ❌ Vercel Error: API Key Not Valid

## Error Message
```
Error [AI_APICallError]: API key not valid. Please pass a valid API key.
```

## 🔍 Root Cause
The Google Generative AI API key is either:
1. **Not set** in Vercel environment variables
2. **Invalid or expired**
3. **Incorrectly configured**

## ✅ Solution: Fix API Key in Vercel

### Step 1: Get a New Valid API Key

1. Go to **Google AI Studio**: https://makersuite.google.com/app/apikey
2. Click **"Create API Key"** or **"Get API Key"**
3. Select or create a Google Cloud project
4. Copy the generated API key (starts with `AIza...`)

### Step 2: Add Environment Variable to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard:
   - URL: https://vercel.com/praveena1012s-projects/dishcover

2. Navigate to **Settings** → **Environment Variables**

3. Click **"Add New"** button

4. Fill in the details:
   - **Name**: `GOOGLE_GENERATIVE_AI_API_KEY`
   - **Value**: Paste your API key from Step 1
   - **Environment**: Check **ALL three**:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

5. Click **"Save"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add GOOGLE_GENERATIVE_AI_API_KEY

# When prompted:
# - Select: Production, Preview, Development (all)
# - Paste your API key
```

### Step 3: Redeploy Your Application

The environment variable won't take effect until you redeploy.

#### Option A: Automatic Redeploy (Push to Git)

```bash
# Make a small change and push
cd /Users/praveen/Desktop/dishcover_app/dishcover
git commit --allow-empty -m "Trigger redeploy for API key update"
git push origin main
```

#### Option B: Manual Redeploy via Dashboard

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **three dots (⋮)** menu
4. Select **"Redeploy"**
5. Click **"Redeploy"** button

### Step 4: Verify the Fix

1. Wait for deployment to complete (~1-3 minutes)
2. Visit your production site
3. Try using the **"Generate Recipe"** feature
4. ✅ Should work without errors now!

---

## 🧪 Test Locally First

Before deploying, test the new API key locally:

### 1. Update `.env.local`

```bash
# Update your local environment file
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_new_api_key_here" > .env.local
```

### 2. Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 3. Test Recipe Generation

- Go to http://localhost:3000/recipes
- Fill in the recipe form
- Click "Generate Recipe"
- ✅ Should work without errors

---

## 🔧 Alternative: Check Current Environment Variables

### View All Environment Variables in Vercel

```bash
vercel env ls
```

### Pull Environment Variables Locally

```bash
vercel env pull .env.local
```

---

## ⚠️ Important Notes

### API Key Security
- ✅ **DO**: Store API keys in environment variables
- ❌ **DON'T**: Commit API keys to Git
- ✅ **DO**: Use different keys for dev/prod if possible
- ❌ **DON'T**: Share API keys publicly

### API Key Limits
- Free tier has usage limits
- Monitor usage at: https://console.cloud.google.com/apis/dashboard
- Consider upgrading if you hit limits

### Troubleshooting

If the error persists after adding the key:

1. **Verify the key is correct**:
   ```bash
   # Test the API key directly
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY"
   ```

2. **Check key restrictions**:
   - Go to Google Cloud Console
   - API & Services → Credentials
   - Check if the API key has restrictions
   - Ensure "Generative Language API" is allowed

3. **Enable the API**:
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click **"Enable"** if not already enabled

4. **Check Vercel logs**:
   ```bash
   vercel logs
   ```
   Look for specific error messages

---

## 📝 Summary Checklist

- [ ] Get new API key from Google AI Studio
- [ ] Add `GOOGLE_GENERATIVE_AI_API_KEY` to Vercel environment variables
- [ ] Select all environments (Production, Preview, Development)
- [ ] Save the environment variable
- [ ] Redeploy the application (push to Git or manual redeploy)
- [ ] Wait for deployment to complete
- [ ] Test the "Generate Recipe" feature
- [ ] Verify no more "API key not valid" errors

---

## 🆘 Still Having Issues?

If you still see the error after following all steps:

1. **Double-check** the environment variable name: `GOOGLE_GENERATIVE_AI_API_KEY` (exact match)
2. **Verify** the API key is correct (no extra spaces)
3. **Confirm** you redeployed after adding the variable
4. **Test** the API key manually using curl (see Troubleshooting section)
5. **Contact** Vercel support or Google Cloud support if the issue persists

Good luck! 🚀
