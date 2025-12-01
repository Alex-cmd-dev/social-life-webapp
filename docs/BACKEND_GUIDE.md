# Backend Development Guide for Beginners

Welcome! This guide will help you build the backend API endpoints for IdeaBox. Don't worry if you're new to this - we'll walk through everything step by step!

## 📚 Table of Contents

1. [What You Need to Know](#what-you-need-to-know)
2. [How API Routes Work](#how-api-routes-work)
3. [Step-by-Step: Building Your First Endpoint](#step-by-step-building-your-first-endpoint)
4. [Common Patterns](#common-patterns)
5. [Testing Your Endpoints](#testing-your-endpoints)
6. [Troubleshooting](#troubleshooting)

---

## What You Need to Know

### The Tech Stack (Simple Explanation)

- **Next.js** - Framework that handles routing (you create files, it creates URLs)
- **Prisma** - Tool to talk to the database (no need to write SQL!)
- **NextAuth** - Handles user login/logout and JWT tokens
- **PostgreSQL** - Database where all data is stored (on Supabase cloud)

### Files You'll Work With

```
app/api/
├── posts/
│   ├── route.ts          ← GET/POST all posts
│   └── [id]/
│       └── route.ts      ← GET/PUT/DELETE single post
├── comments/
│   └── route.ts          ← You'll create these!
└── users/
    └── route.ts          ← You'll create these!
```

**How it works:**
- `app/api/posts/route.ts` → becomes `/api/posts`
- `app/api/posts/[id]/route.ts` → becomes `/api/posts/123` (dynamic)

---

## How API Routes Work

### The Request-Response Cycle

```
User's Browser
    ↓ (sends request)
Your API Route (app/api/posts/route.ts)
    ↓ (queries database with Prisma)
Database (PostgreSQL on Supabase)
    ↓ (returns data)
Your API Route
    ↓ (sends response)
User's Browser (gets JSON data)
```

### HTTP Methods (Verbs)

- **GET** - Read/fetch data (like getting posts)
- **POST** - Create new data (like creating a post)
- **PUT** - Update existing data (like editing a post)
- **DELETE** - Remove data (like deleting a post)

---

## Step-by-Step: Building Your First Endpoint

Let's build `GET /api/comments` together!

### Step 1: Create the File

Create: `app/api/comments/route.ts`

### Step 2: Write the Code

```typescript
// app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/comments - Get all comments
export async function GET(request: NextRequest) {
  try {
    // Query the database
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: "desc"  // Newest first
      },
      include: {
        user: true,   // Include user info
        post: true,   // Include post info
      }
    });

    // Return the data as JSON
    return NextResponse.json(comments);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
```

### Step 3: Test It

1. Start your dev server: `npm run dev`
2. Open your browser to: `http://localhost:3000/api/comments`
3. You should see JSON data!

---

## Common Patterns

### Pattern 1: Protected Route (Requires Login)

Use this when only logged-in users can access the endpoint:

```typescript
import { requireAuth } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  // Check if user is logged in
  const session = await requireAuth();
  if (session instanceof NextResponse) return session; // Not logged in

  // User is logged in! Get their ID:
  const userId = session.user.id;

  // ... rest of your code
}
```

### Pattern 2: Owner-Only (Edit/Delete Own Content)

Use this when users can only modify their own posts/comments:

```typescript
import { requireAuth, checkOwnership } from "@/lib/auth-helpers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Must be logged in
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  // Find the resource
  const comment = await prisma.comment.findUnique({
    where: { id: params.id }
  });

  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check if current user owns it
  const isOwner = await checkOwnership(comment.userId);
  if (!isOwner) {
    return NextResponse.json(
      { error: "You can only delete your own comments" },
      { status: 403 }
    );
  }

  // Delete it
  await prisma.comment.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Deleted!" });
}
```

### Pattern 3: Getting Data from Request Body

When creating or updating, you need to read the request body:

```typescript
export async function POST(request: NextRequest) {
  // Get JSON from request body
  const body = await request.json();
  const { content, postId } = body;

  // Validate the data
  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  // Use the data...
}
```

### Pattern 4: Query Parameters (Pagination)

Get parameters from the URL (?limit=10&offset=0):

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const items = await prisma.post.findMany({
    take: limit,
    skip: offset,
  });

  return NextResponse.json(items);
}
```

---

## Prisma Database Queries (Cheat Sheet)

### Find Many (Get Multiple)

```typescript
// Get all posts
const posts = await prisma.post.findMany();

// Get posts with filters
const posts = await prisma.post.findMany({
  where: {
    userId: "user-123"  // Only posts by this user
  },
  orderBy: {
    createdAt: "desc"   // Newest first
  },
  take: 10,             // Limit to 10
  skip: 0,              // Start from beginning
  include: {
    user: true,         // Include related user data
    comments: true,     // Include related comments
  }
});
```

### Find One (Get Single Item)

```typescript
const post = await prisma.post.findUnique({
  where: { id: "post-123" }
});

// Returns null if not found
if (!post) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
```

### Create

```typescript
const newPost = await prisma.post.create({
  data: {
    content: "Hello world!",
    userId: "user-123",
    imageUrl: "https://...",
  }
});
```

### Update

```typescript
const updated = await prisma.post.update({
  where: { id: "post-123" },
  data: {
    content: "Updated content"
  }
});
```

### Delete

```typescript
await prisma.post.delete({
  where: { id: "post-123" }
});
```

### Count

```typescript
const count = await prisma.post.count({
  where: { userId: "user-123" }
});
```

---

## Testing Your Endpoints

### Option 1: Browser (For GET requests)

Just open: `http://localhost:3000/api/your-endpoint`

### Option 2: Thunder Client (VS Code Extension)

1. Install "Thunder Client" extension in VS Code
2. Create new request
3. Set method (GET, POST, etc.)
4. Set URL: `http://localhost:3000/api/posts`
5. For POST/PUT, add JSON body:
   ```json
   {
     "content": "Test post",
     "imageUrl": "https://example.com/image.jpg"
   }
   ```
6. Click "Send"

### Option 3: cURL (Terminal)

```bash
# GET request
curl http://localhost:3000/api/posts

# POST request
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"content": "Test post"}'
```

---

## Your Task: Endpoints to Build

Based on the API specification (`docs/api-specification.yaml`), you need to build:

### 1. User Endpoints
- ✅ `GET /api/users` - List all users
- ✅ `POST /api/users` - Create user (might not need this)
- ✅ `GET /api/users/[id]` - Get single user
- ✅ `PUT /api/users/[id]` - Update user profile
- ✅ `DELETE /api/users/[id]` - Delete user

### 2. Comment Endpoints
- ✅ `GET /api/comments` - List all comments
- ✅ `POST /api/comments` - Create comment
- ✅ `GET /api/comments/[id]` - Get single comment
- ✅ `PUT /api/comments/[id]` - Update comment
- ✅ `DELETE /api/comments/[id]` - Delete comment

### 3. Like Endpoints
- ✅ `POST /api/likes/[postId]` - Like a post
- ✅ `DELETE /api/likes/[postId]` - Unlike a post

### 4. Follow Endpoints
- ✅ `GET /api/follows` - Get followers/following
- ✅ `POST /api/follows` - Follow user
- ✅ `DELETE /api/follows` - Unfollow user

### 5. Project Endpoints
- ✅ `GET /api/projects` - List all projects
- ✅ `POST /api/projects` - Create project
- ✅ `GET /api/projects/[id]` - Get single project
- ✅ `PUT /api/projects/[id]` - Update project
- ✅ `DELETE /api/projects/[id]` - Delete project

**Follow the pattern from `app/api/posts/route.ts` and `app/api/posts/[id]/route.ts`!**

---

## Troubleshooting

### Error: "Unauthorized"
- Make sure you're using `requireAuth()` correctly
- Check that the JWT token is being sent from frontend

### Error: "Column does not exist" or "Table does not exist"
- Run `npm run db:push` to sync your Prisma schema with database

### Error: "Cannot find module '@/lib/prisma'"
- Make sure you're using `@/` (not `../`)
- Restart your dev server

### Error: "prisma.comment is not a function"
- Run `npm run db:generate` to regenerate Prisma Client
- Restart your dev server

### Data not showing up
- Check Prisma Studio to see what's in your database: `npm run db:studio`
- Make sure you're using correct field names (case-sensitive!)

---

## Quick Reference

### File Structure
```
app/api/
  resource/
    route.ts       ← GET /api/resource, POST /api/resource
    [id]/
      route.ts     ← GET/PUT/DELETE /api/resource/:id
```

### Common Imports
```typescript
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership } from "@/lib/auth-helpers";
```

### Response Codes
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (logged in but not allowed)
- `404` - Not Found
- `500` - Server Error

---

## Need Help?

1. Check the example files:
   - `app/api/posts/route.ts`
   - `app/api/posts/[id]/route.ts`

2. Check the API spec:
   - `docs/api-specification.yaml`

3. Check Prisma docs:
   - https://www.prisma.io/docs

4. Ask your team!

---

**Good luck! Start with one endpoint, test it, then move to the next. You've got this! 🚀**
