# ⚙️ API Directory (Backend)

This folder contains all **backend API routes** for the Social Life app.

## What Goes Here

- **API Endpoints**: Server-side logic to handle data
- **Database Operations**: CRUD operations with Prisma
- **Authentication**: Login, signup, session management
- **Business Logic**: Data validation, processing, etc.

## How It Works

Any folder inside `app/api/` becomes an API endpoint:

```
app/api/
├── auth/[...nextauth]/
│   └── route.ts          → /api/auth/* (NextAuth)
├── posts/
│   └── route.ts          → /api/posts
├── users/
│   └── route.ts          → /api/users
└── likes/
    └── route.ts          → /api/likes
```

## Current API Routes

- `auth/[...nextauth]/route.ts` - NextAuth authentication endpoints

## Creating a New API Route

Create a `route.ts` file with HTTP method handlers:

### Example: Posts API

```tsx
// app/api/posts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/posts - Fetch all posts
export async function GET() {
  try {
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, userId } = body;

    // Validation
    if (!content || !userId) {
      return NextResponse.json(
        { error: "Content and userId are required" },
        { status: 400 }
      );
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        content,
        userId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
```

### Example: Dynamic Routes (with IDs)

```tsx
// app/api/posts/[id]/route.ts

// GET /api/posts/123
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { user: true, likes: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// DELETE /api/posts/123
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
```

## HTTP Methods Supported

- `GET` - Fetch data
- `POST` - Create new data
- `PUT` / `PATCH` - Update existing data
- `DELETE` - Delete data

## Best Practices

### 1. Always Handle Errors

```tsx
try {
  // Your code
} catch (error) {
  return NextResponse.json({ error: "Error message" }, { status: 500 });
}
```

### 2. Validate Input

```tsx
if (!requiredField) {
  return NextResponse.json({ error: "Field required" }, { status: 400 });
}
```

### 3. Use Proper HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

### 4. Protect Routes

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Proceed with authenticated logic
}
```

### 5. Use Prisma for Database Operations

```tsx
import prisma from '@/lib/prisma';

// Create
const user = await prisma.user.create({ data: { ... } });

// Read
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({ where: { id: '123' } });

// Update
const updated = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'New Name' }
});

// Delete
await prisma.user.delete({ where: { id: '123' } });
```

## Testing Your API

Use the browser, Postman, or curl:

```bash
# GET request
curl http://localhost:3000/api/posts

# POST request
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello!","userId":"user-id"}'
```

Or test in browser console:

```javascript
// GET
fetch("/api/posts")
  .then((r) => r.json())
  .then(console.log);

// POST
fetch("/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content: "Hello!", userId: "user-id" }),
})
  .then((r) => r.json())
  .then(console.log);
```

## Learn More

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
