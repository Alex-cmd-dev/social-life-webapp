# 👨‍💻 Development Guide

This guide explains how to extend and develop features for the Social Life app.

## 📁 Project Structure

```
social-life-webapp/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes (backend endpoints)
│   │   └── auth/           # NextAuth authentication
│   ├── layout.tsx          # Root layout (wraps all pages)
│   ├── page.tsx            # Home page (/)
│   └── globals.css         # Global styles
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
│   └── auth.ts             # NextAuth configuration
│
├── prisma/                  # Database schema & migrations
│   └── schema.prisma       # Database models
│
├── types/                   # TypeScript type definitions
│   └── next-auth.d.ts      # NextAuth type extensions
│
└── public/                  # Static files (images, icons, etc.)
```

## 🏗️ Building Features

### Adding a New Page

1. Create a new folder in `app/` with a `page.tsx` file:

```tsx
// app/profile/page.tsx
export default function ProfilePage() {
  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  )
}
```

Access at: `http://localhost:3000/profile`

### Creating an API Route

1. Create a new route in `app/api/`:

```tsx
// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return NextResponse.json(posts)
}

// POST /api/posts
export async function POST(request: Request) {
  const body = await request.json()
  
  const post = await prisma.post.create({
    data: {
      content: body.content,
      userId: body.userId,
    }
  })
  
  return NextResponse.json(post)
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
'use client'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import Button from '@/components/ui/button'

interface PostCardProps {
  content: string
  author: string
  timestamp: Date
  likes: number
  onLike: () => void
}

export default function PostCard({ 
  content, 
  author, 
  timestamp, 
  likes, 
  onLike 
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
  )
}
```

2. Use it in a page:

```tsx
// app/feed/page.tsx
import PostCard from '@/components/post-card'

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <PostCard 
        content="Hello World!"
        author="John Doe"
        timestamp={new Date()}
        likes={5}
        onLike={() => console.log('Liked!')}
      />
    </div>
  )
}
```

## 🔐 Working with Authentication

### Protecting Pages

```tsx
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
    </div>
  )
}
```

### Using Session in Client Components

```tsx
'use client'

import { useSession } from 'next-auth/react'

export default function ProfileButton() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  
  if (session) {
    return <div>Hello, {session.user.name}</div>
  }
  
  return <a href="/auth/signin">Sign In</a>
}
```

## 📊 Database Queries with Prisma

### Basic Queries

```tsx
import prisma from '@/lib/prisma'

// Find all posts
const posts = await prisma.post.findMany()

// Find one post by ID
const post = await prisma.post.findUnique({
  where: { id: 'post-id' }
})

// Create a post
const newPost = await prisma.post.create({
  data: {
    content: 'Hello!',
    userId: 'user-id'
  }
})

// Update a post
const updated = await prisma.post.update({
  where: { id: 'post-id' },
  data: { content: 'Updated content' }
})

// Delete a post
await prisma.post.delete({
  where: { id: 'post-id' }
})
```

### Advanced Queries

```tsx
// Include related data
const postsWithUser = await prisma.post.findMany({
  include: {
    user: true,
    likes: true,
  }
})

// Filter results
const userPosts = await prisma.post.findMany({
  where: {
    userId: 'user-id',
    createdAt: {
      gte: new Date('2024-01-01')
    }
  }
})

// Order results
const latestPosts = await prisma.post.findMany({
  orderBy: {
    createdAt: 'desc'
  },
  take: 10  // Limit to 10 posts
})

// Count records
const postCount = await prisma.post.count({
  where: { userId: 'user-id' }
})
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
  content: 'Hello',
  // Missing required fields!
}

// ✅ This is correct
const post: Post = {
  id: 'abc',
  content: 'Hello',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}
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

**Happy coding!** 🎉

