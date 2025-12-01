# IdeaBox Documentation

Welcome to the IdeaBox documentation! This folder contains all the guides you need to work on the backend.

## 📚 Documentation Overview

### For Backend Developers

1. **[Backend Development Guide](./BACKEND_GUIDE.md)** 👈 **START HERE**
   - Step-by-step guide for building API endpoints
   - Prisma database query examples
   - Common patterns and best practices
   - Perfect for beginners!

2. **[API Specification](./api-specification.yaml)**
   - Complete OpenAPI/Swagger documentation
   - All endpoints you need to build
   - Request/response formats
   - View in Swagger Editor: https://editor.swagger.io/

3. **[Supabase Database Setup](./SUPABASE_SETUP.md)**
   - How to set up your PostgreSQL database
   - Get your `DATABASE_URL`
   - Troubleshooting guide
   - Database management tips

### For Everyone

4. **[Git Workflow Guide](./GIT_WORKFLOW.md)**
   - How to create branches
   - Making pull requests
   - Team collaboration workflow
   - Fixing common Git issues

---

## 🚀 Quick Start for Backend Team

### 1. Set Up Database (One Time)

Follow: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

```bash
# Copy environment variables
npm run setup:env

# Edit .env with your Supabase credentials
# Then push schema to database
npm run db:push
```

### 2. Read the Backend Guide

Follow: [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)

This shows you:
- How to create API routes
- How to use Prisma
- Authentication patterns
- Testing your endpoints

### 3. Check the API Spec

Open: [api-specification.yaml](./api-specification.yaml)

This tells you:
- What endpoints to build
- What data each endpoint needs
- What responses to return
- Authentication requirements

### 4. Look at Examples

Check these files:
- `app/api/posts/route.ts` - List/Create posts
- `app/api/posts/[id]/route.ts` - Get/Update/Delete single post
- `lib/auth-helpers.ts` - Authentication helpers

### 5. Build Your Endpoints!

Use the examples as templates and build:
- User endpoints
- Comment endpoints
- Like endpoints
- Follow endpoints
- Project endpoints

---

## 📋 What You Need to Build

Based on the API specification, the backend team needs to implement:

### ✅ Already Done (Examples)
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create a post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/auth/signup` - User registration

### 🔨 To Be Built

#### User Endpoints (6 endpoints)
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/[id]`
- `PUT /api/users/[id]`
- `DELETE /api/users/[id]`

#### Comment Endpoints (5 endpoints)
- `GET /api/comments`
- `POST /api/comments`
- `GET /api/comments/[id]`
- `PUT /api/comments/[id]`
- `DELETE /api/comments/[id]`

#### Like Endpoints (2 endpoints)
- `POST /api/likes/[postId]`
- `DELETE /api/likes/[postId]`

#### Follow Endpoints (3 endpoints)
- `GET /api/follows`
- `POST /api/follows`
- `DELETE /api/follows`

#### Project Endpoints (5 endpoints)
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/[id]`
- `PUT /api/projects/[id]`
- `DELETE /api/projects/[id]`

**Total: ~26 endpoints to build** (Examples provided for pattern)

---

## 🎯 Workflow

### Daily Routine

1. **Morning:** Pull latest changes
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Start work:** Create a feature branch
   ```bash
   git checkout -b feature/user-endpoints
   ```

3. **Build:** Follow the backend guide and examples
   - Pick an endpoint from the API spec
   - Create the route file
   - Implement GET/POST/PUT/DELETE
   - Test with Thunder Client or browser

4. **Test:** Make sure it works
   ```bash
   npm run dev
   # Test in browser or Thunder Client
   ```

5. **Commit:** Save your work
   ```bash
   git add .
   git commit -m "feat: add user endpoints"
   git push origin feature/user-endpoints
   ```

6. **PR:** Create pull request on GitHub
   - Add description of what you built
   - Request review from teammates
   - Wait for approval
   - Merge!

---

## 🛠️ Development Tools

### Prisma Studio (Database Viewer)

```bash
npm run db:studio
```
- View all tables and data
- Add/edit/delete records
- Opens at http://localhost:5555

### Thunder Client (API Testing)

Install in VS Code:
1. Go to Extensions
2. Search "Thunder Client"
3. Install
4. Use to test your API endpoints

### Swagger Editor (View API Spec)

Visit: https://editor.swagger.io/
1. Copy contents of `api-specification.yaml`
2. Paste in left panel
3. See formatted docs on right

---

## 📖 Additional Resources

### Prisma Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [CRUD Operations](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

### Next.js API Routes
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js API Reference](https://nextjs.org/docs/app/api-reference)

### NextAuth.js
- [NextAuth.js Docs](https://next-auth.js.org/)
- [JWT Session](https://next-auth.js.org/configuration/options#session)

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL Cheat Sheet](https://www.sqltutorial.org/sql-cheat-sheet/)

---

## 💡 Tips for Success

### 1. Start Small
- Build one endpoint at a time
- Test thoroughly before moving on
- Use the example endpoints as templates

### 2. Ask Questions
- Stuck? Ask your team!
- Check the example code
- Read the guides

### 3. Test Everything
- Test with Thunder Client
- Check Prisma Studio to see data
- Make sure errors are handled

### 4. Commit Often
- Small, focused commits
- Clear commit messages
- Push regularly

### 5. Communicate
- Let team know what you're working on
- Review each other's PRs
- Share solutions to problems

---

## 🐛 Common Issues

### "Unauthorized" error
- Check JWT token is being sent
- Use `requireAuth()` helper

### "Table does not exist"
- Run `npm run db:push`
- Check Prisma schema

### "Cannot connect to database"
- Check `.env` file
- Verify `DATABASE_URL` is correct
- Make sure Supabase project is active

### Changes not showing up
- Restart dev server: `npm run dev`
- Clear browser cache
- Check Prisma Studio to verify data

---

## 🎓 Learning Path

### Week 1: Setup & Learn
- [ ] Set up Supabase database
- [ ] Read Backend Guide
- [ ] Understand example endpoints
- [ ] Test examples in Thunder Client

### Week 2-3: Build Endpoints
- [ ] Build User endpoints
- [ ] Build Comment endpoints
- [ ] Build Like endpoints
- [ ] Build Follow endpoints
- [ ] Build Project endpoints

### Week 4: Polish & Test
- [ ] Test all endpoints together
- [ ] Fix bugs
- [ ] Add error handling
- [ ] Write documentation

---

## 📞 Getting Help

1. **Read the docs** - Check this folder first
2. **Check examples** - Look at `app/api/posts/`
3. **Ask teammates** - Use team chat
4. **Google it** - Search for error messages
5. **Check Stack Overflow** - Likely someone had same issue

---

**Ready to build?** Start with [BACKEND_GUIDE.md](./BACKEND_GUIDE.md)!

Good luck! 🚀
