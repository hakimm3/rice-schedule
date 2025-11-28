# Rice Transaction App 🌾

A simple rice transaction management application with user authentication, transaction tracking, and image upload functionality.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Add Rice Purchase Transactions
- ✅ Track weight (kg) and price
- ✅ Upload proof images
- ✅ View transaction history
- ✅ Delete transactions
- ✅ Last purchase date tracking

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Authentication**: JWT
- **File Storage**: Local + Supabase Storage

## Free Hosting Options

### Backend + Database
1. **Railway.app** (Recommended)
   - Deploy from GitHub
   - Free $5 credit monthly
   - PostgreSQL included

2. **Render.com**
   - Free web services
   - PostgreSQL free tier

3. **Fly.io**
   - Free tier available
   - Global deployment

### Database Only
- **Supabase** - Free PostgreSQL + file storage
- **Neon.tech** - Serverless PostgreSQL
- **ElephantSQL** - Free 20MB PostgreSQL

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API to get:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
4. Go to Project Settings > Database to get:
   - `DATABASE_URL` (Connection string)

### 3. Run Database Migration

1. Open Supabase SQL Editor
2. Copy and paste the SQL from `database/schema.sql`
3. Run the query to create tables

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
JWT_SECRET=your_random_secret_key_here
PORT=3000
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Set Up Supabase Storage (Optional)

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `transaction-proofs`
3. Set bucket to **Public**

### 6. Run the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Open browser: `http://localhost:3000`

## Deployment to Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables in Railway dashboard:
   - All variables from `.env`
5. Add PostgreSQL database:
   - Click "New" > "Database" > "PostgreSQL"
   - Copy `DATABASE_URL` to your environment variables
6. Deploy!

## Deployment to Render

1. Create account at [render.com](https://render.com)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Create PostgreSQL database (separate service)
7. Deploy!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Transactions
- `POST /api/transactions` - Create transaction (protected)
- `GET /api/transactions` - Get all user transactions (protected)
- `GET /api/transactions/:id` - Get single transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

## Project Structure

```
rice-transaction-app/
├── src/
│   ├── app.ts                 # Main application
│   ├── config/
│   │   └── database.ts        # Database configuration
│   ├── controllers/
│   │   ├── authController.ts  # Auth logic
│   │   └── transactionController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts  # JWT authentication
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── transactionRoutes.ts
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── utils/
│       └── fileUpload.ts      # File upload utilities
├── public/
│   ├── index.html             # Frontend HTML
│   ├── css/
│   │   └── styles.css         # Styles
│   └── js/
│       └── main.js            # Frontend JS
├── database/
│   └── schema.sql             # Database schema
├── uploads/                   # Uploaded files
├── package.json
├── tsconfig.json
└── .env                       # Environment variables
```

## Usage

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Add Transaction** - Fill in the form:
   - Date and time of purchase
   - Weight in kg
   - Price in Rupiah
   - Upload proof image (optional)
4. **View History** - See all your transactions
5. **Delete** - Remove transactions as needed

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email
- `password_hash` - Hashed password
- `name` - Full name
- `last_buy_date` - Last purchase date
- `created_at`, `updated_at` - Timestamps

### Transactions Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `date` - Transaction date
- `kg` - Weight in kilograms
- `price` - Price in currency
- `prove_image` - Image URL
- `created_at`, `updated_at` - Timestamps

## Security Notes

- Passwords are hashed with bcrypt
- JWT tokens expire in 7 days
- File uploads limited to 5MB
- Only JPEG/PNG images allowed
- SQL injection protected with parameterized queries

## Troubleshooting

**Database connection fails:**
- Check your `DATABASE_URL` is correct
- Ensure Supabase project is running
- Check firewall/network settings

**File upload fails:**
- Check `uploads/` directory exists and is writable
- Verify file size is under 5MB
- Ensure file is JPEG/PNG

**Token errors:**
- Generate a strong JWT_SECRET
- Check token hasn't expired
- Clear localStorage and login again

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for rice transaction management
