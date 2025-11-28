# Rice Transaction App - Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Option 1: Railway (Easiest)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Create new project
   - Wait for database to initialize (~2 min)

2. **Run Database Schema**
   - Open SQL Editor in Supabase
   - Copy content from `database/schema.sql`
   - Paste and run

3. **Get Supabase Credentials**
   - Go to Settings > API
   - Copy: Project URL, anon public key, service_role key
   - Go to Settings > Database
   - Copy: Connection string

4. **Deploy to Railway**
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project" > "Deploy from GitHub"
   - Select your repo
   - Add environment variables:
     ```
     SUPABASE_URL=your_url
     SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_KEY=your_service_key
     DATABASE_URL=your_connection_string
     JWT_SECRET=generate_random_string_here
     PORT=3000
     NODE_ENV=production
     ```
   - Generate JWT_SECRET: https://generate-random.org/api-token-generator

5. **Done!**
   - Railway will auto-deploy
   - Visit your URL
   - Register and start using!

### Option 2: Render

1. Complete steps 1-3 from above
2. Go to https://render.com
3. New > Web Service
4. Connect GitHub repo
5. Settings:
   - Build: `npm install && npm run build`
   - Start: `npm start`
6. Add environment variables (same as Railway)
7. Create!

## 📱 Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials

# Run in development mode
npm run dev

# Open http://localhost:3000
```

## 🔑 Generate JWT Secret

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Online:**
- https://generate-random.org/api-token-generator
- Use 32-64 character random string

## 🎯 First Use

1. Open your deployed URL
2. Click "Register"
3. Fill in your details
4. Login
5. Add your first rice transaction!

## 💡 Tips

- **Free limits:**
  - Supabase: 500MB database, 1GB file storage
  - Railway: $5 credit/month (~550 hours)
  - Render: 750 hours/month

- **Database:** Supabase includes PostgreSQL + file storage
- **Images:** Stored locally or in Supabase storage
- **Security:** All passwords hashed, JWT authentication

## ❓ Common Issues

**Can't connect to database:**
- Check DATABASE_URL format
- Ensure project is active on Supabase

**Upload fails:**
- Create `transaction-proofs` bucket in Supabase Storage
- Set bucket to Public

**Login doesn't work:**
- Check JWT_SECRET is set
- Clear browser cache/localStorage

## 📊 Database Schema Applied?

Run this in Supabase SQL Editor to verify:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show: `users`, `transactions`

---

Need help? Check README.md for detailed instructions.
