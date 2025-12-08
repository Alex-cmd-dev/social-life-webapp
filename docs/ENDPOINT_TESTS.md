# API Endpoint Testing Guide

## 📋 Test Results - All Implemented Endpoints

This document contains test plans and expected behavior for all API endpoints based on `api-specification.yaml`.

---

## ✅ **ENDPOINT STRUCTURE (Now Matches Spec!)**

### Fixed Issues:
- ✅ Moved Like endpoints from `/api/posts/[id]/like` to `/api/likes/[postId]` to match spec

---

## 🧪 **TEST PLAN**

### **1. AUTHENTICATION ENDPOINTS**

#### `POST /api/auth/signup`
**Purpose**: Register a new user  
**Authentication**: None required  
**Request Body**:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123"
}
```
**Expected Response** (201):
```json
{
  "user": {
    "id": "clx...",
    "name": "Test User",
    "email": "test@example.com",
    "username": null,
    "image": null,
    "bio": null,
    "createdAt": "2024-12-08T..."
  }
}
```
**Error Cases**:
- 400: Email already exists
- 400: Invalid email format
- 400: Password missing

---

### **2. USER ENDPOINTS**

#### `GET /api/users`
**Purpose**: List all users with pagination  
**Authentication**: Required (JWT)  
**Query Parameters**: 
- `limit` (default: 20)
- `offset` (default: 0)

**Test URL**: `http://localhost:3000/api/users?limit=10&offset=0`

**Expected Response** (200):
```json
[
  {
    "id": "clx...",
    "name": "User Name",
    "email": "user@example.com",
    "username": "username",
    "image": null,
    "bio": null,
    "createdAt": "2024-12-08T...",
    "_count": {
      "posts": 5,
      "followers": 10,
      "following": 8
    }
  }
]
```

**Error Cases**:
- 401: Not authenticated

---

#### `POST /api/users`
**Purpose**: Create a new user (admin function)  
**Authentication**: Required (JWT)  
**Request Body**:
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "username": "newuser",
  "bio": "This is my bio"
}
```

**Expected Response** (201):
```json
{
  "id": "clx...",
  "name": "New User",
  "email": "newuser@example.com",
  "username": "newuser",
  "bio": "This is my bio",
  "createdAt": "2024-12-08T..."
}
```

**Error Cases**:
- 400: Email required
- 400: Email already exists
- 400: Username already taken
- 401: Not authenticated

---

#### `GET /api/users/[id]`
**Purpose**: Get a single user by ID  
**Authentication**: Required (JWT)  
**Test URL**: `http://localhost:3000/api/users/{USER_ID}`

**Expected Response** (200):
```json
{
  "id": "clx...",
  "name": "User Name",
  "email": "user@example.com",
  "username": "username",
  "image": null,
  "bio": "User bio",
  "createdAt": "2024-12-08T...",
  "_count": {
    "posts": 5,
    "followers": 10,
    "following": 8,
    "projects": 2
  }
}
```

**Error Cases**:
- 404: User not found
- 401: Not authenticated

---

#### `PUT /api/users/[id]`
**Purpose**: Update user profile (owner only)  
**Authentication**: Required (JWT)  
**Authorization**: Can only update own profile  
**Request Body**:
```json
{
  "name": "Updated Name",
  "username": "newusername",
  "bio": "New bio text",
  "image": "https://example.com/avatar.jpg"
}
```

**Expected Response** (200):
```json
{
  "id": "clx...",
  "name": "Updated Name",
  "email": "user@example.com",
  "username": "newusername",
  "image": "https://example.com/avatar.jpg",
  "bio": "New bio text",
  "createdAt": "2024-12-08T..."
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Forbidden - can only update own profile
- 404: User not found
- 400: Username already taken

---

#### `DELETE /api/users/[id]`
**Purpose**: Delete user account (owner only)  
**Authentication**: Required (JWT)  
**Authorization**: Can only delete own account

**Expected Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Forbidden - can only delete own account
- 404: User not found

---

### **3. POST ENDPOINTS**

#### `GET /api/posts`
**Purpose**: Get all posts with pagination  
**Authentication**: Not required (public feed)  
**Query Parameters**: 
- `limit` (default: 20)
- `offset` (default: 0)

**Test URL**: `http://localhost:3000/api/posts?limit=10&offset=0`

**Expected Response** (200):
```json
[
  {
    "id": "clx...",
    "content": "This is a post!",
    "imageUrl": "https://example.com/image.jpg",
    "userId": "clx...",
    "projectId": null,
    "createdAt": "2024-12-08T...",
    "updatedAt": "2024-12-08T...",
    "user": {
      "id": "clx...",
      "name": "User Name",
      "username": "username",
      "image": null
    },
    "likes": [...],
    "comments": [...],
    "_count": {
      "likes": 5,
      "comments": 3
    }
  }
]
```

---

#### `POST /api/posts`
**Purpose**: Create a new post  
**Authentication**: Required (JWT)  
**Request Body**:
```json
{
  "content": "Check out my new project idea!",
  "imageUrl": "https://example.com/screenshot.png",
  "projectId": null
}
```

**Expected Response** (201):
```json
{
  "id": "clx...",
  "content": "Check out my new project idea!",
  "imageUrl": "https://example.com/screenshot.png",
  "userId": "clx...",
  "projectId": null,
  "createdAt": "2024-12-08T...",
  "updatedAt": "2024-12-08T...",
  "user": {
    "id": "clx...",
    "name": "User Name",
    "username": "username",
    "image": null
  }
}
```

**Error Cases**:
- 400: Content is required
- 400: Content too long (max 5000 characters)
- 401: Not authenticated

---

#### `GET /api/posts/[id]`
**Purpose**: Get a single post by ID  
**Authentication**: Not required (public)  
**Test URL**: `http://localhost:3000/api/posts/{POST_ID}`

**Expected Response** (200):
```json
{
  "id": "clx...",
  "content": "Post content",
  "imageUrl": null,
  "userId": "clx...",
  "projectId": null,
  "createdAt": "2024-12-08T...",
  "updatedAt": "2024-12-08T...",
  "user": {...},
  "comments": [...],
  "likes": [...],
  "project": null,
  "_count": {
    "likes": 5,
    "comments": 3
  }
}
```

**Error Cases**:
- 404: Post not found

---

#### `PUT /api/posts/[id]`
**Purpose**: Update a post (owner only)  
**Authentication**: Required (JWT)  
**Authorization**: Only post author can update  
**Request Body**:
```json
{
  "content": "Updated post content",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Expected Response** (200):
```json
{
  "id": "clx...",
  "content": "Updated post content",
  "imageUrl": "https://example.com/new-image.jpg",
  "userId": "clx...",
  "createdAt": "2024-12-08T...",
  "updatedAt": "2024-12-08T...",
  "user": {...}
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Forbidden - not the post author
- 404: Post not found
- 400: Content cannot be empty

---

#### `DELETE /api/posts/[id]`
**Purpose**: Delete a post (owner only)  
**Authentication**: Required (JWT)  
**Authorization**: Only post author can delete

**Expected Response** (200):
```json
{
  "message": "Post deleted successfully"
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Forbidden - not the post author
- 404: Post not found

---

### **4. LIKE ENDPOINTS** ✅ **NOW MATCHES SPEC!**

#### `POST /api/likes/[postId]`
**Purpose**: Like a post  
**Authentication**: Required (JWT)  
**Test URL**: `http://localhost:3000/api/likes/{POST_ID}`

**Expected Response** (201):
```json
{
  "id": "clx...",
  "postId": "clx...",
  "userId": "clx...",
  "createdAt": "2024-12-08T..."
}
```

**Error Cases**:
- 400: Already liked this post
- 401: Not authenticated
- 404: Post not found

---

#### `DELETE /api/likes/[postId]`
**Purpose**: Unlike a post  
**Authentication**: Required (JWT)  
**Test URL**: `http://localhost:3000/api/likes/{POST_ID}`

**Expected Response** (200):
```json
{
  "message": "Like removed"
}
```

**Error Cases**:
- 401: Not authenticated
- 404: Like not found

---

### **5. COMMENT ENDPOINTS**

#### `GET /api/comments`
**Purpose**: Get all comments with pagination  
**Authentication**: Required (JWT)  
**Query Parameters**: 
- `limit` (default: 50)
- `offset` (default: 0)
- `postId` (optional) - Filter by specific post

**Test URL**: `http://localhost:3000/api/comments?postId={POST_ID}`

**Expected Response** (200):
```json
[
  {
    "id": "clx...",
    "content": "Great post!",
    "postId": "clx...",
    "userId": "clx...",
    "parentId": null,
    "createdAt": "2024-12-08T...",
    "updatedAt": "2024-12-08T...",
    "user": {
      "id": "clx...",
      "name": "User Name",
      "username": "username",
      "image": null
    },
    "post": {
      "id": "clx...",
      "content": "Post content..."
    },
    "replies": [...],
    "_count": {
      "replies": 2
    }
  }
]
```

**Error Cases**:
- 401: Not authenticated

---

#### `POST /api/comments`
**Purpose**: Create a comment on a post  
**Authentication**: Required (JWT)  
**Request Body**:
```json
{
  "content": "This is a great idea!",
  "postId": "clx...",
  "parentId": null
}
```

**Expected Response** (201):
```json
{
  "id": "clx...",
  "content": "This is a great idea!",
  "postId": "clx...",
  "userId": "clx...",
  "parentId": null,
  "createdAt": "2024-12-08T...",
  "updatedAt": "2024-12-08T...",
  "user": {...},
  "post": {...}
}
```

**Error Cases**:
- 400: Content is required
- 400: Post ID is required
- 401: Not authenticated
- 404: Post not found
- 404: Parent comment not found (if parentId provided)

---

#### `GET /api/comments/[id]`
**Purpose**: Get a single comment by ID  
**Authentication**: Required (JWT)  
**Test URL**: `http://localhost:3000/api/comments/{COMMENT_ID}`

**Expected Response** (200):
```json
{
  "id": "clx...",
  "content": "Comment content",
  "postId": "clx...",
  "userId": "clx...",
  "parentId": null,
  "createdAt": "2024-12-08T...",
  "updatedAt": "2024-12-08T...",
  "user": {...},
  "post": {...},
  "replies": [...],
  "_count": {
    "replies": 2
  }
}
```

**Error Cases**:
- 401: Not authenticated
- 404: Comment not found

---

#### `PUT /api/comments/[id]`
**Purpose**: Update a comment (owner only)  
**Authentication**: Required (JWT)  
**Authorization**: Only comment author can update  
**Request Body**:
```json
{
  "content": "Updated comment text"
}
```

**Expected Response** (200):
```json
{
  "id": "clx...",
  "content": "Updated comment text",
  "postId": "clx...",
  "userId": "clx...",
  "parentId": null,
  "createdAt": "2024-12-08T...",
  "updatedAt": "2024-12-08T...",
  "user": {...},
  "post": {...}
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Forbidden - not the comment author
- 404: Comment not found
- 400: Content cannot be empty

---

#### `DELETE /api/comments/[id]`
**Purpose**: Delete a comment (owner only)  
**Authentication**: Required (JWT)  
**Authorization**: Only comment author can delete

**Expected Response** (200):
```json
{
  "message": "Comment deleted successfully"
}
```

**Error Cases**:
- 401: Not authenticated
- 403: Forbidden - not the comment author
- 404: Comment not found

---

## 🧪 **MANUAL TESTING STEPS**

### **Prerequisites:**
1. Start dev server: `npm run dev`
2. Sign up/sign in to get JWT token
3. Use Thunder Client or Postman

### **Testing Workflow:**

#### **Step 1: Create a User**
```
POST http://localhost:3000/api/auth/signup
Body: {
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "SecurePass123"
}
```

#### **Step 2: Sign In (Get JWT Token)**
Use Next Auth sign-in page or check browser cookies for `next-auth.session-token`

#### **Step 3: Test Protected Endpoints**
Add header to all requests:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### **Step 4: Test User Endpoints**
1. GET /api/users (list all)
2. GET /api/users/{your-user-id}
3. PUT /api/users/{your-user-id} (update your profile)

#### **Step 5: Test Post Endpoints**
1. POST /api/posts (create a post)
2. GET /api/posts (list all posts)
3. GET /api/posts/{post-id} (view single post)
4. PUT /api/posts/{post-id} (update your post)

#### **Step 6: Test Like Endpoints** ✅
1. POST /api/likes/{post-id} (like a post)
2. DELETE /api/likes/{post-id} (unlike the post)

#### **Step 7: Test Comment Endpoints**
1. POST /api/comments (create a comment)
2. GET /api/comments (list all comments)
3. GET /api/comments/{comment-id} (view single comment)
4. PUT /api/comments/{comment-id} (update your comment)
5. DELETE /api/comments/{comment-id} (delete your comment)

#### **Step 8: Test Error Cases**
1. Try updating someone else's post (should get 403)
2. Try accessing without token (should get 401)
3. Try accessing non-existent resource (should get 404)
4. Try sending invalid data (should get 400)

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] All endpoints return correct status codes
- [ ] Authentication is enforced on protected routes
- [ ] Ownership checks work (can't edit others' content)
- [ ] Pagination works correctly
- [ ] Validation errors return 400 with helpful messages
- [ ] Related data is included (user info, counts, etc.)
- [ ] Cascade deletes work (deleting user deletes their posts)
- [ ] Duplicate prevention works (can't like same post twice)

---

## 📊 **SUMMARY**

**Total Endpoints Implemented**: 17
- ✅ Auth: 1 endpoint (signup)
- ✅ Users: 5 endpoints
- ✅ Posts: 5 endpoints
- ✅ Likes: 2 endpoints (NOW MATCHES SPEC!)
- ✅ Comments: 5 endpoints

**All endpoints now match the API specification!** 🎉

---

## 🚀 **NEXT STEPS**

Still need to implement (from API spec):
1. Follow endpoints (`/api/follows`)
2. Project endpoints (`/api/projects`)

---

**Last Updated**: December 8, 2025  
**Status**: Ready for testing! ✅

