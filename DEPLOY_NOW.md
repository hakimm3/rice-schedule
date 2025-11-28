# Quick Deploy to Vercel

## Option 1: One Command Deploy (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

## Option 2: GitHub + Vercel Dashboard

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Rice Transaction App"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Click Deploy!

## Environment Variables (Add in Vercel Dashboard)

```
DB_PATH=/tmp/rice_app.db
JWT_SECRET=57f22e71c70c5e7de1a3f7fecb5d9869bf1b3bef1d037234c75469f376175e81
NODE_ENV=production
```

## ⚠️ Important Notes

**SQLite Limitation on Vercel:**
- Database resets on each deployment (ephemeral storage)
- For production, switch to:
  - **Vercel Postgres** (recommended)
  - **Supabase** (PostgreSQL)
  - **Turso** (serverless SQLite)

**File Uploads:**
- Local uploads won't persist on Vercel
- Use Vercel Blob Storage for production

## Alternative: Deploy to Railway (Persistent Storage)

Railway supports persistent SQLite:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize and deploy
railway init
railway up
```

Railway advantages:
- Persistent file system
- SQLite works perfectly
- Free $5/month credit

## Your app is ready to deploy! 🚀

Choose your platform and deploy in minutes!
