# 📱 App Directory

This is the heart of your Next.js application. Everything related to routing, pages, and API endpoints lives here.

## 🗂️ Directory Structure

```
app/
│
├── (frontend)/              🎨 FRONTEND
│   ├── page.tsx            Home page - What users see at /
│   ├── README.md           Frontend documentation
│   │
│   └── (future pages)      Add more pages here:
│       ├── profile/        User profile pages
│       ├── feed/           Social feed
│       ├── settings/       User settings
│       └── ...
│
├── api/                     ⚙️ BACKEND
│   ├── auth/               Authentication endpoints
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── README.md           API documentation
│   │
│   └── (future APIs)       Add more APIs here:
│       ├── posts/          Post CRUD operations
│       ├── likes/          Like functionality
│       ├── users/          User operations
│       └── ...
│
├── layout.tsx              🎯 Root Layout
│   Wraps ALL pages with common structure
│   (header, footer, providers, fonts)
│
├── globals.css             🎨 Global Styles
│   Tailwind CSS configuration and global styles
│
└── favicon.ico             🖼️ App Icon
    Shows in browser tab
```

## 🎯 What Goes Where?

| I want to...             | Create this file             |
| ------------------------ | ---------------------------- |
| 🏠 Add a home page       | `(frontend)/page.tsx`        |
| 📄 Add a new page        | `(frontend)/[name]/page.tsx` |
| 🔌 Add an API endpoint   | `api/[name]/route.ts`        |
| 🎨 Add global styles     | `globals.css`                |
| 📐 Change page structure | `layout.tsx`                 |

## 🎨 Frontend `(frontend)/`

**Purpose:** User-facing pages that people see and interact with

**Examples:**

```tsx
// Home page
(frontend)/page.tsx → /

// Profile page
(frontend)/profile/page.tsx → /profile

// Feed page
(frontend)/feed/page.tsx → /feed

// Settings page
(frontend)/settings/page.tsx → /settings

// Nested page
(frontend)/profile/[id]/page.tsx → /profile/123
```

**Key Points:**

- The `(frontend)` parentheses are a **Route Group** - they organize code but don't affect URLs
- Each `page.tsx` becomes a route
- Can be Server Components (default) or Client Components (`'use client'`)

📖 **[Read Frontend Documentation](<./(frontend)/README.md>)**

## ⚙️ Backend `api/`

**Purpose:** Server-side endpoints that handle data, authentication, and business logic

**Examples:**

```tsx
// Posts API
api/posts/route.ts → /api/posts

// User API
api/users/route.ts → /api/users

// Likes API
api/likes/route.ts → /api/likes

// Dynamic API
api/posts/[id]/route.ts → /api/posts/123
```

**Key Points:**

- Each `route.ts` file becomes an API endpoint
- Export HTTP method functions: `GET`, `POST`, `PUT`, `DELETE`
- Returns JSON responses
- Handles database operations with Prisma

📖 **[Read API Documentation](./api/README.md)**

## 🔄 How They Work Together

### Example: Displaying User Posts

1. **User visits** → `http://localhost:3000/feed`

2. **Frontend loads** → `app/(frontend)/feed/page.tsx`

   ```tsx
   export default async function FeedPage() {
     // Fetch data from API
     const res = await fetch("/api/posts");
     const posts = await res.json();

     return (
       <div>
         {posts.map((post) => (
           <PostCard key={post.id} {...post} />
         ))}
       </div>
     );
   }
   ```

3. **API handles request** → `app/api/posts/route.ts`

   ```tsx
   export async function GET() {
     const posts = await prisma.post.findMany({
       include: { user: true, likes: true },
     });
     return Response.json(posts);
   }
   ```

4. **Database queries** → Via Prisma to PostgreSQL

5. **Data flows back** → Database → API → Frontend → User

```
👤 User
  ↓ visits /feed
🎨 Frontend (frontend)/feed/page.tsx
  ↓ fetch('/api/posts')
⚙️ Backend api/posts/route.ts
  ↓ prisma.post.findMany()
🗄️ Database (PostgreSQL)
  ↓ returns data
⚙️ Backend returns JSON
  ↓
🎨 Frontend displays posts
  ↓
👤 User sees feed!
```

## 📐 Root Layout `layout.tsx`

The root layout wraps **ALL pages** in your app. It's perfect for:

- Site-wide navigation
- Global providers (auth, theme, etc.)
- Common headers/footers
- Font configuration
- Metadata (title, description)

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children} {/* Your pages render here */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

## 🎨 Global Styles `globals.css`

Contains:

- Tailwind CSS directives
- CSS variables (colors, spacing, etc.)
- Global CSS rules
- Custom utility classes

## 🚀 Quick Start Examples

### Create a New Page

```bash
# Create profile page
mkdir -p app/\(frontend\)/profile
touch app/\(frontend\)/profile/page.tsx
```

### Create a New API Endpoint

```bash
# Create posts API
mkdir -p app/api/posts
touch app/api/posts/route.ts
```

### File Naming Convention

- `page.tsx` → Creates a page route
- `layout.tsx` → Creates a layout wrapper
- `route.ts` → Creates an API route
- `loading.tsx` → Loading UI
- `error.tsx` → Error UI
- `not-found.tsx` → 404 page

## 📚 Learn More

- **Frontend Guide:** [app/(frontend)/README.md](<./(frontend)/README.md>)
- **API Guide:** [app/api/README.md](./api/README.md)
- **Development Guide:** [../DEVELOPMENT.md](../DEVELOPMENT.md)
- **Next.js Docs:** [nextjs.org/docs/app](https://nextjs.org/docs/app)

---

**Now you can clearly see: Frontend in `(frontend)/`, Backend in `api/`!** 🎯
