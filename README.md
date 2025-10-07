# Social Life - Social Media Web App

A modern social media application built with Next.js 14, TypeScript, Prisma, and PostgreSQL. This project is designed for learning web development and building a complete full-stack application.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (via Supabase or Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js

## 📋 Features (Planned)

- User authentication and profiles
- Create, edit, and delete posts
- Like posts
- Follow/unfollow users
- User timeline/feed
- Beautiful, responsive UI

## 🛠️ Prerequisites

Before you begin, make sure you have the following installed on your computer:

### For Windows Users:

1. **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/download/win)
3. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### For Mac Users:

1. **Node.js** (v20 or higher) - [Download here](https://nodejs.org/) or use [Homebrew](https://brew.sh/): `brew install node`
2. **Git** (usually pre-installed) - Check with `git --version`
3. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Verify Installation

Open your terminal (Command Prompt on Windows, Terminal on Mac) and run:

```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
git --version   # Should show version info
```

## 📦 Getting Started

### Step 1: Clone the Repository

```bash
# Clone the project
git clone <your-repository-url>

# Navigate into the project folder
cd social-life-webapp
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all the required packages. It may take a few minutes.

### Step 3: Set Up Your Database (Cloud-Hosted, NOT Local!)

**Important:** The database runs **in the cloud**, not on your computer! You don't need to install PostgreSQL.

You'll sign up for a **free cloud database** that's always running online:

#### Option A: Supabase (Recommended for Beginners)

1. Go to [supabase.com](https://supabase.com/) and sign up for free
2. Click "New Project"
3. Fill in the project details:
   - Name: `social-life-app` (or any name you like)
   - Database Password: Create a strong password (save this!)
   - Region: Choose one close to you
4. Click "Create new project" and wait for it to initialize (~2 minutes)
5. Once ready, go to **Project Settings** → **Database**
6. Find the **Connection String** section
7. Copy the "URI" connection string (it starts with `postgresql://`)
8. Replace `[YOUR-PASSWORD]` in the string with your database password

#### Option B: Neon (Alternative)

1. Go to [neon.tech](https://neon.tech/) and sign up for free
2. Create a new project
3. Copy the connection string from the dashboard

**What you just did:** ✅ You now have a PostgreSQL database running 24/7 in the cloud! Your Next.js app will connect to it via the internet.

**How it works:**

```
Your Computer (localhost:3000)
       ↓
  (connects via DATABASE_URL)
       ↓
Supabase/Neon Cloud
       ↓
PostgreSQL Database
  (stores your data)
```

### Step 4: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   # On Mac/Linux:
   cp .env.example .env

   # On Windows (Command Prompt):
   copy .env.example .env

   # On Windows (PowerShell):
   Copy-Item .env.example .env
   ```

2. Open the `.env` file in your code editor

3. Replace the placeholder values:

   ```env
   # Paste your database connection string here
   DATABASE_URL="postgresql://..."

   # Generate a random secret for NextAuth
   # You can use: https://generate-secret.vercel.app/32
   # Or run in terminal: openssl rand -base64 32
   NEXTAUTH_SECRET="paste-your-random-secret-here"

   # Keep this as is for local development
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Step 5: Create Database Tables (In the Cloud!)

Push the database schema to your cloud database:

```bash
npm run db:push
```

This creates all the necessary tables (User, Post, Like, Follow) **in your cloud database** based on the Prisma schema.

**What just happened:**

- ✅ Prisma read your `schema.prisma` file
- ✅ Connected to your cloud database via `DATABASE_URL`
- ✅ Created all tables in **Supabase/Neon** (not on your computer!)
- ✅ Your database is now ready to store data!

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your app running! 🎉

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm start` - Run the production build
- `npm run lint` - Check code for errors
- `npm run db:push` - Push schema changes to the database
- `npm run db:studio` - Open Prisma Studio to view/edit database
- `npm run db:generate` - Generate Prisma Client (runs automatically after install)

## 🗄️ Database Management

### View Your Database (Prisma Studio)

To see and edit your database visually:

```bash
npm run db:studio
```

This opens a web interface at [http://localhost:5555](http://localhost:5555) where you can:

- View all your tables
- Add, edit, or delete records
- See relationships between data

### Update Database Schema

1. Edit the schema in `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes

## 📁 Project Structure

```
social-life-webapp/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # 🎨 Frontend - User pages (organized)
│   │   └── page.tsx       # Home page
│   ├── api/               # ⚙️ Backend - API routes
│   │   └── auth/          # NextAuth API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   └── ui/               # UI components (buttons, cards, etc.)
├── lib/                   # Utility functions & configs
│   ├── prisma.ts         # Database client
│   └── auth.ts           # NextAuth configuration
├── prisma/               # 🗄️ Database schema
│   └── schema.prisma     # Database models (User, Post, Like, Follow)
├── types/                # TypeScript type definitions
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Example environment variables
└── package.json          # Project dependencies and scripts
```

**Clear Separation:**

- 🎨 **Frontend** (what users see): `app/(frontend)/`
- ⚙️ **Backend** (API & logic): `app/api/`
- 🗄️ **Database** (schema): `prisma/schema.prisma`

📖 See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed structure explanation

## 🎓 Learning Resources

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial

### Prisma

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

### Tailwind CSS

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

## 🐛 Troubleshooting

### "Command not found" errors

- Make sure Node.js is installed: `node --version`
- Restart your terminal after installing Node.js

### Database connection errors

- Double-check your `DATABASE_URL` in `.env`
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Ensure your database is running (Supabase/Neon should always be running)

### Port 3000 already in use

- Stop the other application using port 3000
- Or run on a different port: `npm run dev -- -p 3001`

### Prisma errors

- Try running: `npm run db:generate`
- If that doesn't work, delete `node_modules` and run `npm install` again

### Cannot find module errors

- Delete `node_modules` folder and `.next` folder
- Run `npm install` again
- Run `npm run dev`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
