# 👨‍💻 Development Guide

This guide explains the architecture and development patterns for the Social Life app.

**🎯 Quick Links:**
- **Backend Team (Beginners):** See [docs/BACKEND_GUIDE.md](./docs/BACKEND_GUIDE.md) for step-by-step instructions
- **Frontend Team:** Continue reading this guide for architecture overview
- **Git Workflow:** See [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)
- **API Specification:** See [docs/api-specification.yaml](./docs/api-specification.yaml)

## 📁 Project Structure

```
social-life-webapp/
├── app/                      # Next.js App Router
│   │
│   ├── (frontend)/          # 🎨 FRONTEND - User-facing pages
│   │   ├── page.tsx        # Home page (/)
│   │   └── README.md       # Frontend documentation
│   │
│   ├── api/                 # ⚙️ BACKEND - API routes & server logic
│   │   ├── auth/           # Authentication endpoints
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── README.md       # API documentation
│   │
│   ├── layout.tsx          # Root layout (wraps all pages)
│   ├── globals.css         # Global styles
│   └── favicon.ico         # App icon
│
├── components/              # Reusable React components
│   ├── ui/                 # UI components (buttons, cards, etc.)
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── providers.tsx       # Context providers (NextAuth, etc.)
│   └── README.md           # Component documentation
│
├── lib/                     # Utility functions & configs
│   ├── prisma.ts           # Database client instance
│   ├── auth.ts             # NextAuth configuration
│   └── auth-helpers.ts     # Helper functions for JWT authentication
│
├── prisma/                  # 🗄️ DATABASE - Schema & migrations
│   └── schema.prisma       # Database models (User, Post, Like, Follow)
│
├── types/                   # TypeScript type definitions
│   └── next-auth.d.ts      # NextAuth type extensions
│
└── public/                  # Static files (images, icons, etc.)
```

### 🎯 Quick Reference

| What are you building?                              | Where does it go?                      |
| --------------------------------------------------- | -------------------------------------- |
| 🎨 **User-facing page** (profile, feed, settings)   | `app/(frontend)/your-page/page.tsx`    |
| ⚙️ **API endpoint** (fetch data, create posts)      | `app/api/your-endpoint/route.ts`       |
| 💼 **Helper functions** (auth, validation, utils)   | `lib/your-helper.ts`                   |
| 🧩 **Reusable component** (button, card, modal)     | `components/your-component.tsx`        |
| 🗄️ **Database model** (new table/fields)            | `prisma/schema.prisma`                 |
| 🛠️ **Utility function** (helpers, configs)          | `lib/your-util.ts`                     |

**Note:** The `(frontend)` folder uses parentheses which is a Next.js Route Group - it organizes code without affecting URLs!

---

## 🎯 Frontend vs Backend - Clear Separation

```
apps/
│
├── (frontend)/              🎨 FRONTEND
│   ├── page.tsx            → What users SEE
│   ├── profile/            → User pages
│   ├── feed/               → Interactive UI
│   └── settings/           → Client components
│
└── api/                     ⚙️ BACKEND
    ├── auth/               → Authentication
    ├── posts/              → Data handling
    ├── users/              → Business logic
    └── likes/              → Database operations
```

### How They Work Together

1. **User visits** `/feed` → `app/(frontend)/feed/page.tsx` loads
2. **Page fetches data** → Calls `/api/posts`
3. **API processes** → `app/api/posts/route.ts` queries database
4. **Database returns data** → Via Prisma
5. **API sends JSON** → Back to frontend
6. **Frontend displays** → User sees posts!

```
User Browser
     ↓
Frontend (frontend)/page.tsx
     ↓ fetch('/api/posts')
Backend api/posts/route.ts
     ↓ prisma.post.findMany()
Database (PostgreSQL)
```

---

## 🏛️ Architecture & Modularity

### Why Modularity Matters

**Modularity** means organizing code into separate, focused pieces that each do one thing well. This makes your code:

- ✅ **Easier to understand** - Each file has a clear purpose
- ✅ **Easier to test** - Test business logic separately from API routes
- ✅ **Easier to maintain** - Fix bugs in one place without breaking others
- ✅ **Easier to scale** - Add features without spaghetti code

### 📐 Architecture Layers

We use a **layered architecture** to keep concerns separated:

```
┌─────────────────────────────────────────────┐
│  USER BROWSER                               │
│  Sees the UI and interacts                  │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  FRONTEND (app/frontend/)                   │
│  • React components                         │
│  • Pages users see                          │
│  • Makes fetch() calls to API               │
│  WHY: Separates UI from business logic      │
└──────────────┬──────────────────────────────┘
               ↓ HTTP Request (fetch)
┌─────────────────────────────────────────────┐
│  API ROUTES (app/api/)                      │
│  • Handles HTTP requests (GET, POST, etc.)  │
│  • Authentication & authorization           │
│  • Input validation                         │
│  • Business logic                           │
│  • Calls Prisma for database operations     │
│  WHY: Everything in one place, easy to find │
└──────────────┬──────────────────────────────┘
               ↓ Prisma function call
┌─────────────────────────────────────────────┐
│  PRISMA CLIENT (lib/prisma.ts)              │
│  • Database abstraction layer               │
│  • Converts JS/TS to SQL                    │
│  • Type-safe database queries               │
│  WHY: Don't write raw SQL, get type safety  │
└──────────────┬──────────────────────────────┘
               ↓ SQL Query
┌─────────────────────────────────────────────┐
│  DATABASE (PostgreSQL on Supabase/Neon)     │
│  • Stores all data                          │
│  • Tables: User, Post, Like, Follow         │
│  WHY: Persistent data storage               │
└─────────────────────────────────────────────┘
```

### 🏗️ Our Architecture (Simplified)

We use a **simple, direct approach** that's perfect for learning:

```
API Route → Prisma → Database
```

**Example:**
```typescript
// app/api/posts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET() {
  // Get data directly with Prisma
  const posts = await prisma.post.findMany({
    include: { user: true, likes: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  // Check authentication
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  // Get request data
  const body = await request.json();

  // Validate
  if (!body.content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  // Save to database
  const post = await prisma.post.create({
    data: {
      content: body.content,
      userId: session.user.id,
    }
  });

  return NextResponse.json(post, { status: 201 });
}
```

**Why this approach?**
- ✅ Simple and easy to understand
- ✅ Fewer files to manage
- ✅ Perfect for beginners
- ✅ Quick to build
- ✅ Easy to debug

**See working examples:** `app/api/posts/route.ts` and `app/api/posts/[id]/route.ts`

### 🗂️ File Naming Conventions

Follow these naming patterns to keep your codebase organized:

| File Type          | Naming Pattern    | Example                         | Why                                  |
| ------------------ | ----------------- | ------------------------------- | ------------------------------------ |
| **Frontend Pages** | `page.tsx`        | `app/(frontend)/feed/page.tsx`  | Next.js convention for routes        |
| **API Routes**     | `route.ts`        | `app/api/posts/route.ts`        | Next.js convention for API endpoints |
| **Helpers**        | `*-helpers.ts`    | `lib/auth-helpers.ts`           | Helper/utility functions             |
| **Components**     | `kebab-case.tsx`  | `components/post-card.tsx`      | Lowercase, descriptive               |
| **UI Components**  | `kebab-case.tsx`  | `components/ui/button.tsx`      | Generic, reusable components         |
| **Utilities**      | `kebab-case.ts`   | `lib/format-date.ts`            | Helper functions                     |
| **Types**          | `*.d.ts` or `.ts` | `types/api.ts`                  | TypeScript definitions               |

#### Naming Examples:

```
✅ GOOD:
lib/auth-helpers.ts                 → Authentication helper functions
lib/validation-helpers.ts           → Validation utilities
components/post-card.tsx            → Post card component
components/user-avatar.tsx          → User avatar component
lib/format-date.ts                  → Date formatting utility

❌ BAD:
lib/AuthHelpers.ts                  → Don't use PascalCase for files
components/PostCard.tsx             → Use kebab-case, not PascalCase
lib/dateUtils.ts                    → Use kebab-case, not camelCase
```

### 💾 How to Interact with Database Using Prisma

Prisma is your database client. It translates TypeScript code to SQL automatically!

#### Basic Pattern:

```typescript
import prisma from "@/lib/prisma";

// Prisma automatically connects to your database
// defined by DATABASE_URL in .env
```

#### CRUD Operations:

```typescript
// CREATE - Add new record
const post = await prisma.post.create({
  data: {
    content: "Hello World!",
    userId: "user-123",
  },
});

// READ - Get all records
const posts = await prisma.post.findMany();

// READ - Get one record
const post = await prisma.post.findUnique({
  where: { id: "post-123" },
});

// UPDATE - Modify a record
const updated = await prisma.post.update({
  where: { id: "post-123" },
  data: { content: "Updated!" },
});

// DELETE - Remove a record
await prisma.post.delete({
  where: { id: "post-123" },
});
```

#### With Relations (JOIN):

```typescript
// Get post WITH user data (JOIN)
const post = await prisma.post.findUnique({
  where: { id: "post-123" },
  include: {
    user: true, // Include related user
    likes: true, // Include related likes
  },
});

// Result:
// {
//   id: "post-123",
//   content: "Hello",
//   user: { id: "user-1", name: "John" },
//   likes: [{ id: "like-1", userId: "user-2" }]
// }
```

#### Filtering & Searching:

```typescript
// Find posts by user
const userPosts = await prisma.post.findMany({
  where: { userId: "user-123" },
});

// Search by content
const results = await prisma.post.findMany({
  where: {
    content: {
      contains: "hello", // LIKE '%hello%'
      mode: "insensitive", // Case insensitive
    },
  },
});

// Multiple conditions
const filtered = await prisma.post.findMany({
  where: {
    AND: [
      { userId: "user-123" },
      { createdAt: { gte: new Date("2024-01-01") } },
    ],
  },
});
```

### 🔧 Creating Helper Functions

For reusable logic (like authentication checks), create helper functions in `lib/`:

**Example: Authentication helpers**

```typescript
// lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return session;
}

export async function checkOwnership(resourceUserId: string) {
  const session = await getServerSession(authOptions);
  return session?.user?.id === resourceUserId;
}
```

**Using helpers in API routes:**

```typescript
// app/api/posts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  // Check if user is logged in
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  // Get request data and validate
  const { content } = await request.json();
  if (!content || content.length > 500) {
    return NextResponse.json(
      { error: "Invalid content" },
      { status: 400 }
    );
  }

  // Save to database
  const post = await prisma.post.create({
    data: {
      content,
      userId: session.user.id,
    }
  });

  return NextResponse.json(post, { status: 201 });
}
```

### 🎯 Best Practices Summary

| Layer          | Responsibility        | What It Does                                 | What It Doesn't Do                     |
| -------------- | --------------------- | -------------------------------------------- | -------------------------------------- |
| **Frontend**   | UI & User Interaction | Display data, handle clicks, forms           | Direct database access, business logic |
| **API Routes** | HTTP & Business Logic | Parse requests, validate, query DB, respond  | UI rendering                           |
| **Helpers**    | Reusable Utilities    | Auth checks, validation, formatting          | HTTP handling, database queries        |
| **Prisma**     | Database Access       | Query database, type safety                  | HTTP handling, UI rendering            |
| **Database**   | Data Storage          | Store and retrieve data                      | Business logic, validation             |

### 🚀 Example: Complete Feature Flow

**Feature:** Create a new post

**1. Frontend** (`app/(frontend)/feed/page.tsx`)

```typescript
async function handleCreatePost(content: string) {
  const response = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  const post = await response.json();
}
```

**2. API Route** (`app/api/posts/route.ts`)

```typescript
export async function POST(request: Request) {
  // Authenticate
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  // Validate
  const { content } = await request.json();
  if (!content || content.length > 500) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  // Save to database
  const post = await prisma.post.create({
    data: { content, userId: session.user.id }
  });

  return NextResponse.json(post, { status: 201 });
}
```

**3. Prisma** (`lib/prisma.ts`)

```typescript
// Prisma converts to SQL:
// INSERT INTO "Post" (id, content, userId) VALUES (...)
```

**4. Database**

```
Stores the data in PostgreSQL ✅
```

---

## 🏗️ Building Features

### Adding a New Page (Frontend)

1. Create a new folder in `app/(frontend)/` with a `page.tsx` file:

```tsx
// app/(frontend)/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <p>Your profile content here</p>
    </div>
  );
}
```

Access at: `http://localhost:3000/profile`

**Examples:**

- `app/(frontend)/feed/page.tsx` → `/feed`
- `app/(frontend)/profile/page.tsx` → `/profile`
- `app/(frontend)/settings/page.tsx` → `/settings`

💡 The `(frontend)` folder is a route group - it organizes your code but doesn't affect the URL!

### Creating an API Route (Backend)

1. Create a new route in `app/api/`:

```tsx
// app/api/posts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(posts);
}

// POST /api/posts
export async function POST(request: Request) {
  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      content: body.content,
      userId: body.userId,
    },
  });

  return NextResponse.json(post);
}
```

### Adding a Database Model

1. Edit `prisma/schema.prisma`:

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  createdAt DateTime @default(now())

  postId    String
  post      Post     @relation(fields: [postId], references: [id])

  userId    String
  user      User     @relation(fields: [userId], references: [id])

  @@index([postId])
  @@index([userId])
}
```

2. Update related models:

```prisma
model Post {
  // ... existing fields
  comments  Comment[]  // Add this
}

model User {
  // ... existing fields
  comments  Comment[]  // Add this
}
```

3. Push to database:

```bash
npm run db:push
```

### Creating a Component

1. Create component file in `components/`:

```tsx
// components/post-card.tsx
"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Button from "@/components/ui/button";

interface PostCardProps {
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  onLike: () => void;
}

export default function PostCard({
  content,
  author,
  timestamp,
  likes,
  onLike,
}: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-gray-500">
            {timestamp.toLocaleDateString()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-800 dark:text-gray-200">{content}</p>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" onClick={onLike}>
          ❤️ {likes} Likes
        </Button>
      </CardFooter>
    </Card>
  );
}
```

2. Use it in a page:

```tsx
// app/feed/page.tsx
import PostCard from "@/components/post-card";

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <PostCard
        content="Hello World!"
        author="John Doe"
        timestamp={new Date()}
        likes={5}
        onLike={() => console.log("Liked!")}
      />
    </div>
  );
}
```

## 🔐 Working with Authentication

### Protecting Pages

```tsx
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
    </div>
  );
}
```

### Using Session in Client Components

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function ProfileButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (session) {
    return <div>Hello, {session.user.name}</div>;
  }

  return <a href="/auth/signin">Sign In</a>;
}
```

## 📊 Database Queries with Prisma

### Basic Queries

```tsx
import prisma from "@/lib/prisma";

// Find all posts
const posts = await prisma.post.findMany();

// Find one post by ID
const post = await prisma.post.findUnique({
  where: { id: "post-id" },
});

// Create a post
const newPost = await prisma.post.create({
  data: {
    content: "Hello!",
    userId: "user-id",
  },
});

// Update a post
const updated = await prisma.post.update({
  where: { id: "post-id" },
  data: { content: "Updated content" },
});

// Delete a post
await prisma.post.delete({
  where: { id: "post-id" },
});
```

### Advanced Queries

```tsx
// Include related data
const postsWithUser = await prisma.post.findMany({
  include: {
    user: true,
    likes: true,
  },
});

// Filter results
const userPosts = await prisma.post.findMany({
  where: {
    userId: "user-id",
    createdAt: {
      gte: new Date("2024-01-01"),
    },
  },
});

// Order results
const latestPosts = await prisma.post.findMany({
  orderBy: {
    createdAt: "desc",
  },
  take: 10, // Limit to 10 posts
});

// Count records
const postCount = await prisma.post.count({
  where: { userId: "user-id" },
});
```

## 🎨 Styling with Tailwind

### Common Patterns

```tsx
// Container
<div className="max-w-7xl mx-auto px-6">

// Card
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">

// Button
<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">

// Grid Layout
<div className="grid md:grid-cols-3 gap-6">

// Flex Layout
<div className="flex items-center justify-between">

// Responsive Text
<h1 className="text-2xl md:text-4xl lg:text-6xl">
```

## 🧪 Testing Your Code

### Manual Testing

1. **Test in browser:**

   - Check functionality works
   - Test on different screen sizes
   - Try dark mode

2. **Test database operations:**

   ```bash
   npm run db:studio
   ```

   - Verify data is saved correctly
   - Check relationships are working

3. **Check for errors:**
   - Look in browser console (F12)
   - Check terminal for server errors

### Using TypeScript

TypeScript will catch many errors before runtime:

```tsx
// ❌ This will show an error
const post: Post = {
  content: "Hello",
  // Missing required fields!
};

// ✅ This is correct
const post: Post = {
  id: "abc",
  content: "Hello",
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## 📝 Best Practices

### Code Organization

- Keep components small and focused
- One component per file
- Use meaningful names
- Add comments for complex logic

### Database

- Always use Prisma for database operations
- Use transactions for related operations
- Add indexes for frequently queried fields
- Validate data before saving

### Security

- Never expose sensitive data in client components
- Always validate user input
- Use server components for data fetching
- Check authentication before operations

### Performance

- Use server components when possible
- Fetch only the data you need
- Use pagination for long lists
- Optimize images with Next.js Image component

## 🚀 Deployment

When you're ready to deploy:

1. Set up a production database
2. Set environment variables on hosting platform
3. Build and deploy:

```bash
npm run build
npm start
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---
