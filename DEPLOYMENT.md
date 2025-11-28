# Deployment Guide

## Deploy to Vercel (Free)

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Rice Transaction App"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `rice-transaction-app` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```env
DB_PATH=/tmp/rice_app.db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
PORT=3000
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg
```

**Important Notes for Vercel:**
- SQLite database will be ephemeral (resets on each deployment)
- For persistent storage, use:
  - **Vercel Postgres** (recommended for production)
  - **Turso** (serverless SQLite)
  - **PlanetScale** (MySQL)
  - **Supabase** (PostgreSQL)

### Step 4: Using Vercel Postgres (Recommended)

1. In Vercel Dashboard → Storage → Create Database → Postgres
2. Copy the connection string
3. Update `src/config/database.ts` to use Vercel Postgres:

```typescript
import { sql } from '@vercel/postgres';
```

4. Add environment variables from Vercel Postgres to your project

### Alternative: Deploy to Other Platforms

#### Railway (Free $5/month)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Add environment variables
5. Deploy!

#### Render (Free tier)
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add environment variables
7. Create!

### File Upload Considerations

For production, consider using:
- **Vercel Blob Storage** (for Vercel deployments)
- **Cloudinary** (image hosting)
- **AWS S3** (object storage)
- **Supabase Storage** (free tier available)

Since local file uploads don't work well in serverless, update `.env`:

```env
# Use cloud storage for production
STORAGE_TYPE=vercel-blob
# or
STORAGE_TYPE=cloudinary
```

## Testing Your Deployment

After deployment:
1. Visit your Vercel URL (e.g., `https://rice-transaction-app.vercel.app`)
2. Register a new account
3. Add a transaction
4. Check the queue

## Troubleshooting

**Database resets on each deployment:**
- Use Vercel Postgres or external database
- SQLite in `/tmp` is ephemeral on serverless

**File uploads fail:**
- Implement Vercel Blob Storage
- Or use Cloudinary/S3

**Cold starts:**
- First request may be slow (serverless limitation)
- Subsequent requests are fast

## Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Monitoring

- View logs: Vercel Dashboard → Your Project → Deployments → View Logs
- Analytics: Vercel Dashboard → Your Project → Analytics

---

**Your app is now live! 🎉**
