# Supabase Database Setup Guide

This guide will help you set up a PostgreSQL database on Supabase (free tier) for the IdeaBox project.

## Why Supabase?

- ✅ **Free** - Generous free tier
- ✅ **Cloud-hosted** - No local installation needed
- ✅ **PostgreSQL** - Production-ready database
- ✅ **Easy to use** - Web interface for managing data
- ✅ **Fast** - Good performance worldwide

---

## Step-by-Step Setup

### Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Step 2: Create a New Project

1. Click "New Project" button
2. Fill in the details:

   **Organization:** (Select or create)

   **Project Name:** `ideabox` (or any name you like)

   **Database Password:**
   - Create a STRONG password
   - **IMPORTANT:** Save this password somewhere safe!
   - You'll need it for the connection string
   - Example: `MyS3cur3P@ssw0rd!2024`

   **Region:**
   - Choose closest to your location
   - US: `East US (North Virginia)`
   - Europe: `West EU (Ireland)`
   - Asia: `Southeast Asia (Singapore)`

   **Pricing Plan:** Free

3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Step 3: Get Your Database Connection String

Once your project is ready:

1. In your Supabase dashboard, go to **Project Settings** (gear icon in sidebar)
2. Click on **Database** in the left menu
3. Scroll down to **Connection string** section
4. Select **URI** (not Session or Transaction)
5. You'll see something like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:5432/postgres
   ```

6. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with your actual password
   - If your password is `MyS3cur3P@ssw0rd!2024`, the connection string becomes:
   ```
   postgresql://postgres.xxxxx:MyS3cur3P@ssw0rd!2024@xxx.pooler.supabase.com:5432/postgres
   ```

7. Copy this complete connection string

### Step 4: Add Connection String to Your Project

1. In your project folder, copy `.env.example` to `.env`:
   ```bash
   npm run setup:env
   ```
   Or manually:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` file in your code editor

3. Replace the `DATABASE_URL` value with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres.xxxxx:MyPassword@xxx.pooler.supabase.com:5432/postgres"
   ```

4. Generate a `NEXTAUTH_SECRET`:
   - Visit: https://generate-secret.vercel.app/32
   - Copy the generated secret
   - Paste it in your `.env` file:
   ```env
   NEXTAUTH_SECRET="your-generated-secret-here"
   ```

5. **Save the `.env` file**

**Your `.env` should look like:**
```env
DATABASE_URL="postgresql://postgres.abcdefgh:MyPassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 5: Create Database Tables

Now that your `.env` is configured, push the Prisma schema to your Supabase database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates all tables)
npm run db:push
```

You should see output like:
```
🚀  Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

### Step 6: Verify Setup

1. **Option 1: Use Prisma Studio** (Recommended)
   ```bash
   npm run db:studio
   ```
   - Opens at http://localhost:5555
   - You should see all your tables: User, Post, Comment, Like, Follow, Project, etc.

2. **Option 2: Check Supabase Dashboard**
   - Go to your Supabase project
   - Click "Table Editor" in sidebar
   - You should see all your tables listed

### Step 7: Test the Connection

Start your development server:

```bash
npm run dev
```

If everything is set up correctly:
- Server starts without errors
- You can access http://localhost:3000
- No database connection errors in console

---

## Troubleshooting

### Error: "Can't reach database server"

**Solution 1:** Check your connection string
- Make sure password is correct (no spaces, special characters encoded)
- Make sure you replaced `[YOUR-PASSWORD]` with actual password

**Solution 2:** Check your internet connection
- Supabase is cloud-hosted, requires internet

**Solution 3:** Check Supabase project status
- Go to your Supabase dashboard
- Make sure project shows as "Active" (green)

### Error: "Authentication failed"

**Problem:** Wrong password in connection string

**Solution:**
1. Go to Supabase → Project Settings → Database
2. Click "Reset Database Password"
3. Create new password
4. Update your `.env` with new connection string

### Error: "SSL connection required"

**Problem:** Missing SSL parameter

**Solution:** Add `?sslmode=require` to end of connection string:
```env
DATABASE_URL="postgresql://...postgres?sslmode=require"
```

### Error: "Column does not exist"

**Problem:** Schema not pushed to database

**Solution:**
```bash
npm run db:push
```

### Special Characters in Password

If your password has special characters like `@`, `#`, `$`, etc., you need to encode them:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `!` becomes `%21`

Example:
- Password: `MyPass@123!`
- Encoded: `MyPass%40123%21`

Or use a simpler password without special characters!

---

## Managing Your Database

### View/Edit Data - Prisma Studio

```bash
npm run db:studio
```

Opens at http://localhost:5555

You can:
- View all tables and data
- Add/edit/delete records
- See relationships between data
- Test queries

### View Data - Supabase Dashboard

1. Go to your Supabase project
2. Click "Table Editor" in sidebar
3. Select a table to view
4. Can add/edit/delete rows directly

### Run SQL Queries - Supabase SQL Editor

1. Go to Supabase project
2. Click "SQL Editor"
3. Write and run SQL queries

Example:
```sql
-- See all users
SELECT * FROM "User";

-- Count posts
SELECT COUNT(*) FROM "Post";

-- See posts with user info
SELECT p.content, u.name
FROM "Post" p
JOIN "User" u ON p."userId" = u.id;
```

---

## Updating the Schema

When you make changes to `prisma/schema.prisma`:

```bash
# Push changes to database
npm run db:push

# Regenerate Prisma Client
npm run db:generate
```

**Note:** `db:push` is for development. For production, you'd use migrations.

---

## Free Tier Limits

Supabase free tier includes:
- ✅ 500 MB database space
- ✅ 5 GB bandwidth per month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ 2 GB file storage

**This is plenty for a school project!**

If you run out:
- Clean up test data
- Or upgrade (but you probably won't need to)

---

## Team Collaboration

### Each Team Member Should:

1. Create their own Supabase project (free)
2. Get their own `DATABASE_URL`
3. Each person has their own database for development
4. Don't share database connection strings (security risk!)

### For Production/Shared Database:

If you need a shared database:
1. One person creates the Supabase project
2. Share the `DATABASE_URL` securely (not in git!)
3. Consider using environment variables in your deployment platform

---

## Security Best Practices

1. ✅ **Never commit `.env` to git**
   - Already in `.gitignore`
   - Contains sensitive database credentials

2. ✅ **Use strong passwords**
   - Mix of letters, numbers, symbols
   - At least 16 characters

3. ✅ **Don't share connection strings**
   - Each team member should use their own database
   - Or share securely (encrypted chat, password manager)

4. ✅ **Restrict database access**
   - Supabase has built-in security
   - Use Row Level Security (RLS) for production

---

## Backup Your Data

Supabase free tier doesn't include automatic backups, so:

### Manual Backup

In Supabase Dashboard:
1. Go to "Database" → "Backups"
2. Click "Download backup"
3. Saves all your data

### Export with Prisma Studio

```bash
npm run db:studio
```
- Select table
- Export to CSV

---

## Need Help?

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Common Issues
- Check Supabase status: [status.supabase.com](https://status.supabase.com/)
- Check your connection string format
- Make sure project is "Active" in dashboard

### Still Stuck?
- Ask your team
- Check project Discord/Slack
- Search on Stack Overflow

---

**You're all set! Your database is ready for development.** 🎉

Next steps:
1. Start building API endpoints (see `docs/BACKEND_GUIDE.md`)
2. Test with Prisma Studio (`npm run db:studio`)
3. Build amazing features!
