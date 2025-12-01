# In Progress - Social Media Web App (IdeaBox)

A modern social media application built with Next.js 15, TypeScript, Prisma, and PostgreSQL. This project is designed for learning web development and building a complete full-stack application.

Current Focus: **IdeaBox** - A platform for sharing ideas, getting feedback, and following inspiring projects and creators.

## 🚀 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Database:** PostgreSQL (via Supabase or Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Icons:** Lucide React

## 📋 Features

### ✅ Implemented
- IdeaBox feed with idea cards
- Create idea dialog (UI only, using mock data)
- User profile pages
- Idea detail pages
- Comment sections
- Following feed
- Project roadmap view
- Responsive header with navigation
- Dark mode support
- Beautiful UI with shadcn/ui components

### 🚧 Planned
- User authentication and profiles
- Backend API integration
- Database persistence
- Real-time updates
- Like and bookmark functionality
- User follow/unfollow
- Search functionality

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

#### Supabase 

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


### Step 4: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   # Works on all operating systems (Mac, Windows, Linux)
   npm run setup:env
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

- `npm run setup:env` - Create .env file from template (cross-platform)
- `npm run dev` - Start the development server
- `npm run dev:stop` - Stop the development server (cross-platform)
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
│   │   ├── page.tsx       # Home page (IdeaBox feed)
│   │   ├── following/     # Following feed page
│   │   ├── idea/[id]/     # Individual idea detail pages
│   │   └── profile/[username]/  # User profile pages
│   ├── api/               # ⚙️ Backend - API routes
│   │   └── auth/          # NextAuth API routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & theme variables
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components (button, card, dialog, etc.)
│   ├── header.tsx        # App header with navigation
│   ├── idea-feed.tsx     # Main idea feed component
│   ├── idea-card.tsx     # Individual idea card
│   ├── create-idea-dialog.tsx  # Create idea modal
│   └── ...               # Other feature components
├── lib/                   # Utility functions & configs
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # NextAuth configuration
│   └── utils.ts          # Utility functions (cn helper)
├── prisma/               # 🗄️ Database schema
│   └── schema.prisma     # Database models (User, Post, Like, Follow)
├── types/                # TypeScript type definitions
├── components.json       # shadcn/ui configuration
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Example environment variables
└── package.json          # Project dependencies and scripts
```

**Clear Separation:**

- 🎨 **Frontend** (what users see): `app/(frontend)/`
- ⚙️ **Backend** (API & logic): `app/api/`
- 🗄️ **Database** (schema): `prisma/schema.prisma`
- 🎭 **UI Components**: `components/ui/` (shadcn/ui) & `components/` (features)

📖 See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed structure explanation

## 📚 Documentation for Backend Team

The backend team should start here:

- **[Backend Development Guide](./docs/BACKEND_GUIDE.md)** - Complete guide for building API endpoints
- **[API Specification](./docs/api-specification.yaml)** - OpenAPI spec with all endpoints to build
- **[Supabase Setup Guide](./docs/SUPABASE_SETUP.md)** - How to set up PostgreSQL database
- **[Git Workflow](./docs/GIT_WORKFLOW.md)** - Team collaboration workflow
- **[Documentation Index](./docs/README.md)** - Overview of all documentation

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

Stop the development server and restart:

```bash
# Stop the development server (works on all operating systems)
npm run dev:stop

# Then restart
npm run dev

# Or run on a different port
npm run dev -- -p 3001
```

### Prisma errors

- Try running: `npm run db:generate`
- If that doesn't work, delete `node_modules` and run `npm install` again

### Cannot find module errors

- Delete `node_modules` folder and `.next` folder
- Run `npm install` again
- Run `npm run dev`

### npm install errors (ERESOLVE dependency conflicts)

If you see peer dependency errors during `npm install`:

- The project includes a `.npmrc` file that handles this automatically
- This file configures npm to use `legacy-peer-deps=true` for compatibility between Next.js 15 and NextAuth.js v4
- Simply run `npm install` - the configuration will be applied automatically
- If issues persist:
  ```bash
  # Delete node_modules and package-lock.json
  # Windows:
  rmdir /s /q node_modules
  del package-lock.json

  # Mac/Linux:
  rm -rf node_modules package-lock.json

  # Then reinstall
  npm install
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
