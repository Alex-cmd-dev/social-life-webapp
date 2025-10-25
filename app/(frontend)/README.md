# 🎨 Frontend Directory

This folder contains all **frontend pages** (user-facing views) for the Social Life app.

## What Goes Here

- **Pages**: User interface pages (home, profile, feed, etc.)
- **Layouts**: Page-specific layouts
- **Client Components**: Interactive UI that runs in the browser

## How It Works

The folder name uses parentheses `(frontend)` which is a Next.js **Route Group**. This means:

- ✅ Organizes code clearly
- ✅ Doesn't affect the URL structure
- ✅ `(frontend)/page.tsx` → still shows at `/` (root URL)

## Current Pages

- `page.tsx` - Home/Landing page

## Adding New Pages

Create a new folder with a `page.tsx`:

```
app/(frontend)/
├── page.tsx              → / (home page)
├── profile/
│   └── page.tsx          → /profile
├── feed/
│   └── page.tsx          → /feed
└── settings/
    └── page.tsx          → /settings
```

## Example: Creating a Profile Page

```tsx
// app/(frontend)/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      {/* Your profile UI here */}
    </div>
  );
}
```

## Server vs Client Components

By default, components are **Server Components** (render on server):

```tsx
// Server Component (default)
export default function Page() {
  // Can directly fetch data here
  const data = await fetch("...");
  return <div>...</div>;
}
```

Add `'use client'` for **Client Components** (interactive, run in browser):

```tsx
"use client";

import { useState } from "react";

export default function InteractivePage() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Learn More

- [Next.js App Router](https://nextjs.org/docs/app)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
