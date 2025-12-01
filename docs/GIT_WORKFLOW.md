# Git Workflow Guide - Team Collaboration

This guide shows you how to work with Git as a team without stepping on each other's toes!

## 🎯 The Golden Rules

1. **Never push directly to `main`** - Always use branches
2. **Always pull before you push** - Get latest changes first
3. **One feature = One branch** - Keep work separated
4. **Test before you push** - Make sure your code works

---

## 📋 Initial Setup (One Time Only)

### Step 1: Clone the Repository

If you haven't cloned the project yet:

```bash
# Clone the project
git clone <repository-url>
cd social-life-webapp

# Install dependencies
npm install
```

### Step 2: Configure Git

Set up your name and email (if not done already):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🔄 Daily Workflow

### Before You Start Working

**Always start by getting the latest code:**

```bash
# Make sure you're on main branch
git checkout main

# Get latest changes from remote
git pull origin main
```

---

## 🌿 Working on a Feature

### Step 1: Create a New Branch

**Branch naming convention:**
- `feature/your-feature-name` - For new features
- `fix/bug-description` - For bug fixes

```bash
# Create and switch to new branch
git checkout -b feature/user-endpoints

# Examples:
git checkout -b feature/comment-api
git checkout -b feature/like-functionality
git checkout -b fix/post-delete-error
```

### Step 2: Work on Your Code

Make your changes, create files, write code...

### Step 3: Check What Changed

```bash
# See what files you changed
git status

# See detailed changes
git diff
```

### Step 4: Stage Your Changes

```bash
# Add specific files
git add app/api/users/route.ts
git add app/api/users/[id]/route.ts

# Or add all changed files
git add .
```

### Step 5: Commit Your Changes

Write a clear commit message explaining what you did:

```bash
# Good commit messages:
git commit -m "feat: add GET and POST endpoints for users"
git commit -m "feat: add user profile update endpoint"
git commit -m "fix: correct authentication check in posts API"
git commit -m "docs: add comments to user endpoints"

# Bad commit messages (don't do this):
git commit -m "updates"
git commit -m "stuff"
git commit -m "idk"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code restructuring (no behavior change)
- `test:` - Adding tests

### Step 6: Push Your Branch

```bash
# Push your branch to remote repository
git push origin feature/user-endpoints

# If first time pushing this branch, Git might ask you to set upstream:
git push --set-upstream origin feature/user-endpoints
```

---

## 🔀 Creating a Pull Request (PR)

### Step 1: Go to GitHub

1. Go to your repository on GitHub
2. You'll see a yellow banner: "Compare & pull request"
3. Click that button

### Step 2: Fill Out PR Information

**Title:** Clear description of what you built
```
Add User API Endpoints (GET, POST, PUT, DELETE)
```

**Description:** Explain what you did
```markdown
## What I Built
- GET /api/users - List all users
- POST /api/users - Create user
- GET /api/users/[id] - Get single user
- PUT /api/users/[id] - Update user
- DELETE /api/users/[id] - Delete user

## Testing Done
- Tested all endpoints with Thunder Client
- Verified authentication works
- Checked error handling

## Notes
- Used the posts API as a template
- Added input validation for user updates
```

### Step 3: Request Review

- Assign reviewers (your teammates)
- Add labels if needed (e.g., "backend", "API")

### Step 4: Wait for Review

Your teammates will:
- Review your code
- Leave comments/suggestions
- Approve or request changes

### Step 5: Make Changes (if requested)

If reviewers request changes:

```bash
# Make the changes in your files
# Then commit and push again
git add .
git commit -m "fix: address PR review comments"
git push origin feature/user-endpoints
```

The PR will automatically update!

### Step 6: Merge

Once approved:
1. Click "Merge Pull Request" on GitHub
2. Click "Confirm Merge"
3. Delete the branch (GitHub will prompt you)

---

## 🔄 Staying Up to Date

### Pull Latest Changes from Main

**Do this often!** (Before starting work, during long features)

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Switch back to your feature branch
git checkout feature/your-feature

# Merge main into your branch (get latest changes)
git merge main
```

### If There Are Conflicts

Git will tell you which files have conflicts. Open those files and you'll see:

```
<<<<<<< HEAD
Your code
=======
Someone else's code
>>>>>>> main
```

**To resolve:**
1. Choose which code to keep (or combine both)
2. Delete the `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Save the file
4. Stage and commit:

```bash
git add conflicted-file.ts
git commit -m "fix: resolve merge conflicts"
```

---

## 📊 Common Scenarios

### Scenario 1: Starting a New Feature

```bash
# Get latest code
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/comment-endpoints

# Work on your code...
# When done:
git add .
git commit -m "feat: add comment API endpoints"
git push origin feature/comment-endpoints

# Create PR on GitHub
```

### Scenario 2: Someone Merged Code, I Need Those Changes

```bash
# Save your current work first
git add .
git commit -m "wip: save current progress"

# Get latest from main
git checkout main
git pull origin main

# Go back to your branch
git checkout feature/your-feature

# Merge the new changes
git merge main

# Continue working...
```

### Scenario 3: I Made a Mistake in My Last Commit

**If you haven't pushed yet:**

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Make your fixes
# Then commit again
git add .
git commit -m "feat: correct implementation"
```

**If you already pushed:**
- Just make a new commit with the fix
- Don't try to rewrite history that others might have pulled

### Scenario 4: I Want to Switch Branches But Have Uncommitted Changes

```bash
# Option 1: Commit your work
git add .
git commit -m "wip: save progress"

# Option 2: Stash your work (save temporarily)
git stash
git checkout other-branch
# ... do other work ...
git checkout your-original-branch
git stash pop  # Restore your work
```

---

## ⚠️ What NOT to Do

1. **❌ Don't force push** unless you know what you're doing
   ```bash
   git push --force  # DANGER!
   ```

2. **❌ Don't commit sensitive data**
   - Don't commit `.env` file
   - Don't commit passwords or API keys
   - Already in `.gitignore`

3. **❌ Don't work directly on main**
   ```bash
   git checkout main
   # Make changes...
   git push origin main  # DON'T DO THIS!
   ```

4. **❌ Don't commit `node_modules`**
   - Already in `.gitignore`
   - Others run `npm install` to get dependencies

---

## 🛠️ Useful Git Commands

### See What's Happening

```bash
# Current status
git status

# What branch am I on?
git branch

# See all branches (local and remote)
git branch -a

# See commit history
git log

# See commit history (pretty)
git log --oneline --graph
```

### Branches

```bash
# Create branch
git branch feature/new-feature

# Switch to branch
git checkout feature/new-feature

# Create and switch (shortcut)
git checkout -b feature/new-feature

# Delete branch (after merged)
git branch -d feature/old-feature

# List all branches
git branch
```

### Undoing Things

```bash
# Discard changes in a file (before staging)
git checkout -- filename.ts

# Unstage a file (after git add)
git reset filename.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See what changed in last commit
git show
```

---

## 🎓 Team Best Practices

### 1. **Pull Before Push**
Always get latest changes before pushing:
```bash
git pull origin main
# Or if on feature branch:
git pull origin feature/your-branch
```

### 2. **Commit Often**
- Small, focused commits are better than giant commits
- Each commit should be one logical change

### 3. **Write Good Commit Messages**
```
✅ Good:
feat: add user authentication endpoints
fix: resolve null error in post delete
docs: update API documentation for comments

❌ Bad:
update
changes
fix stuff
```

### 4. **Keep Branches Short-Lived**
- Work on feature for 1-3 days max
- Merge quickly
- Don't let branches get stale

### 5. **Review Code Together**
- Read teammates' PRs
- Give constructive feedback
- Learn from each other

---

## 📞 Getting Help

### Check Status
```bash
git status  # Always start here
```

### Made a Mistake?
1. **Don't panic!**
2. Git rarely loses your work
3. Ask a teammate for help
4. Google: "git how to undo [what you did]"

### Useful Resources
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fixing mistakes
- Ask your team!

---

## 📋 Quick Reference

### Starting Work
```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
```

### Saving Work
```bash
git add .
git commit -m "feat: description of what you did"
git push origin feature/my-feature
```

### Getting Latest Code
```bash
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
```

### Before Submitting PR
```bash
# Make sure code works
npm run dev  # Test your changes
npm run lint  # Check for errors

# Commit and push
git add .
git commit -m "feat: final changes"
git push origin feature/my-feature

# Then create PR on GitHub
```

---

**Remember:** Communication is key! Let your team know what you're working on to avoid conflicts. Use your team chat or GitHub issues to coordinate!

Happy coding! 🚀
