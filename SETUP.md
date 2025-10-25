# 🚀 Quick Setup Guide

This guide will help you get the Social Life app running on your machine in under 10 minutes!

## ✅ Pre-Setup Checklist

Before you start, make sure you have:

- [ ] Node.js v20+ installed (`node --version`)
- [ ] Git installed (`git --version`)
- [ ] A code editor (VS Code recommended)
- [ ] An internet connection

## 📝 Setup Steps

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd social-life-webapp

# Install dependencies
npm install
```

Wait for the installation to complete. This might take 1-2 minutes.

### 2. Set Up Database (3 minutes)

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** social-life-app
   - **Database Password:** (create a strong password and save it!)
   - **Region:** (choose closest to you)
5. Wait ~2 minutes for the project to initialize
6. Go to **Settings** → **Database**
7. Scroll to **Connection String** → Copy the **URI** format
8. Replace `[YOUR-PASSWORD]` with your actual password

#### Option B: Neon

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project
4. Copy the connection string from dashboard

### 3. Configure Environment Variables (2 minutes)

```bash
# On Mac/Linux
cp .env.example .env

# On Windows (Command Prompt)
copy .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env
```

Open `.env` in your code editor and fill in:

```env
# Paste your database connection string from step 2
DATABASE_URL="postgresql://postgres:..."

# Generate a random secret
# Visit: https://generate-secret.vercel.app/32
# Or run in terminal: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Keep this as is for development
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize Database (1 minute)

```bash
# Push the database schema
npm run db:push
```

You should see: ✅ "Your database is now in sync with your Prisma schema."

### 5. Start the App (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**You should see the Social Life landing page!** 🎉

## 🔍 Verify Everything Works

### Check 1: Database Connection

```bash
npm run db:studio
```

This should open Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Check 2: No Errors

Your terminal should show:

```
✓ Ready in Xms
○ Compiling / ...
✓ Compiled / in Xms
```

### Check 3: See the Landing Page

Visit [http://localhost:3000](http://localhost:3000) - you should see:

- "Social Life" header
- "Connect with Your Community" heading
- Three feature cards
- Tech stack badges at the bottom

## 🐛 Common Issues

### "Cannot find module '@prisma/client'"

**Solution:**

```bash
npm run db:generate
npm run dev
```

### "Error: PrismaClient is unable to connect to the database"

**Solution:**

- Check your `DATABASE_URL` in `.env`
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Verify your database is running (Supabase/Neon should always be running)

### "Port 3000 already in use"

**Solution:**

```bash
# Run on different port
npm run dev -- -p 3001
```

### "Command not found: npm"

**Solution:**

- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart your terminal
- Verify with `node --version`

## 🎓 Next Steps

Once everything is running:

1. **Explore the code:**

   - Check out `app/page.tsx` - the home page
   - Look at `prisma/schema.prisma` - the database models
   - Browse `components/` - reusable UI components

2. **View your database:**

   ```bash
   npm run db:studio
   ```

3. **Start building features:**

   - Add authentication providers
   - Create user profile pages
   - Build the post feed
   - Implement likes and follows

4. **Read the docs:**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Prisma Documentation](https://www.prisma.io/docs)
   - [Tailwind CSS](https://tailwindcss.com/docs)

## 📚 Available Commands

```bash
npm run dev         # Start development server
npm run lint        # Check for code issues
npm run db:push     # Sync database with schema
npm run db:studio   # Open database viewer
npm run db:generate # Generate Prisma Client
```

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review the [Components Guide](./components/README.md)

