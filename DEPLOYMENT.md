# Deployment Guide for Meal Planning App

## Quick Deploy to Vercel (Recommended)

### Step 1: Prepare Your Database

Since Vercel doesn't support SQLite, you need a PostgreSQL database:

**Option A: Use Vercel Postgres (Easiest)**
1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string

**Option B: Use Neon (Free PostgreSQL)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a free database
3. Copy the connection string

**Option C: Use Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Get your PostgreSQL connection string

### Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/meal.git
git branch -M master
git push -u origin master
```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com/signup)
2. Sign up with your GitHub account
3. Click "Add New..." → "Project"
4. Import your `meal` repository
5. Vercel will auto-detect Next.js

### Step 4: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secure-random-string-here
OPENAI_API_KEY=your-openai-key (if using OpenAI)
ANTHROPIC_API_KEY=your-anthropic-key (if using Anthropic)
GOOGLE_AI_API_KEY=your-google-key (if using Google AI)
```

To generate a secure JWT_SECRET:
```bash
openssl rand -base64 32
```

### Step 5: Deploy!

Click "Deploy" and Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to production

### Step 6: Run Database Migrations

After first deployment, run migrations:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link to your project:
```bash
vercel link
```

3. Run migrations:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel dashboard to run a deployment command:
- Go to Settings → General → Build & Development Settings
- Add to "Install Command": `npm install && npx prisma generate && npx prisma migrate deploy`

## Alternative: Deploy to Other Platforms

### Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repo
4. Add environment variables
5. Deploy

### Railway
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database (Railway provides this)
4. Set environment variables
5. Deploy

### DigitalOcean App Platform
1. Push to GitHub
2. Go to [digitalocean.com](https://digitalocean.com)
3. Create new app
4. Add managed PostgreSQL database
5. Configure environment variables
6. Deploy

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Verify database connections
- [ ] Test recipe generation
- [ ] Check favorites functionality
- [ ] Test recommendations
- [ ] Verify all API routes work
- [ ] Check mobile responsiveness
- [ ] Test password reset (if implemented)

## Troubleshooting

**Build fails with Prisma error:**
```bash
# Make sure Prisma generates before build
npm install
npx prisma generate
npm run build
```

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check if database allows external connections
- Ensure SSL is configured if required

**Environment variables not working:**
- Make sure they're added in hosting platform dashboard
- Redeploy after adding new variables
- Use NEXT_PUBLIC_ prefix for client-side variables

## Need Help?

- Check Vercel logs in dashboard
- Review Prisma migration status
- Test locally first with production database

Happy deploying! 🚀
