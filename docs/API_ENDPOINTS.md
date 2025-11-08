# API Documentation

Complete API surface documentation for the Full-Stack Next.js Cloudflare Demo application.

## Table of Contents

1. [REST API Endpoints](#rest-api-endpoints)
2. [Server Actions](#server-actions)
3. [Authentication](#authentication)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)

---

## REST API Endpoints

### POST /api/summarize

Summarize text using Cloudflare Workers AI.

**Purpose**: Generate summaries of text content with configurable length, style, and language.

**Authentication**: Required (session-based)

**Request Body**:
```typescript
{
  text: string;           // 50-50,000 characters
  config?: {
    maxLength?: number;   // 50-1000, default: 200
    style?: "concise" | "detailed" | "bullet-points"; // default: "concise"
    language?: string;    // default: "English"
  }
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  data: {
    summary: string;
    originalLength: number;
    summaryLength: number;
    tokensUsed: {
      input: number;
      output: number;
    }
  };
  error: null;
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
  ```json
  { "success": false, "error": "Authentication required", "data": null }
  ```
- `400 Bad Request`: Invalid input (via zod validation)
- `500 Internal Server Error`: AI service unavailable
  ```json
  { "success": false, "error": "AI service is not available", "data": null }
  ```

**Example Usage**:
```typescript
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Long article text here...',
    config: { maxLength: 150, style: 'bullet-points' }
  })
});
const result = await response.json();
```

---

### Better Auth Endpoints

All Better Auth endpoints are handled via `/api/auth/[...all]`.

**Base Path**: `/api/auth`

**Supported Methods**: GET, POST

**Available Routes** (handled by Better Auth):
- `POST /api/auth/sign-up/email` - Email/password sign up
- `POST /api/auth/sign-in/email` - Email/password sign in
- `POST /api/auth/sign-out` - Sign out current session
- `GET /api/auth/session` - Get current session
- `GET /api/auth/get-session` - Alternative session endpoint
- OAuth routes for Google sign-in (configured)

**Configuration**:
- Email/Password authentication: Enabled
- Google OAuth: Enabled (requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
- Session storage: D1 database via Drizzle adapter
- Cookie handling: Next.js cookies plugin

**Example - Get Session**:
```typescript
const response = await fetch('/api/auth/session');
const session = await response.json();
// Returns: { user: { id, name, email, ... }, session: { ... } }
```

---

## Server Actions

All server actions use Next.js Server Actions (`"use server"`) and return structured responses.

### Authentication Actions

#### signIn()

**Path**: `src/modules/auth/actions/auth.action.ts`

**Purpose**: Authenticate user with email and password.

**Parameters**:
```typescript
{
  email: string;     // Valid email format
  password: string;  // Minimum 8 characters
}
```

**Returns**:
```typescript
{
  success: boolean;
  message: string;  // "Signed in successfully" or error message
}
```

**Authentication**: No (this creates the session)

**Usage**:
```typescript
import { signIn } from '@/modules/auth/actions/auth.action';

const result = await signIn({ email: 'user@example.com', password: 'password123' });
if (result.success) {
  // Redirect to dashboard
}
```

---

#### signUp()

**Path**: `src/modules/auth/actions/auth.action.ts`

**Purpose**: Create new user account with email and password.

**Parameters**:
```typescript
{
  email: string;      // Valid email format
  password: string;   // Minimum 8 characters
  username: string;   // Minimum 3 characters
}
```

**Returns**:
```typescript
{
  success: boolean;
  message: string;  // "Signed up successfully" or error message
}
```

**Authentication**: No (creates new user)

**Usage**:
```typescript
import { signUp } from '@/modules/auth/actions/auth.action';

const result = await signUp({
  email: 'user@example.com',
  password: 'password123',
  username: 'johndoe'
});
```

---

#### signOut()

**Path**: `src/modules/auth/actions/auth.action.ts`

**Purpose**: End current user session.

**Parameters**: None

**Returns**:
```typescript
{
  success: boolean;
  message: string;  // "Signed out successfully" or error message
}
```

**Authentication**: Required (implicitly via session headers)

**Usage**:
```typescript
import { signOut } from '@/modules/auth/actions/auth.action';

const result = await signOut();
if (result.success) {
  // Redirect to login
}
```

---

### Todo Actions

#### getAllTodos()

**Path**: `src/modules/todos/actions/get-todos.action.ts`

**Purpose**: Fetch all todos for the authenticated user with category information.

**Parameters**: None

**Returns**:
```typescript
Todo[]  // Array of todos (see Data Models section)
```

**Authentication**: Yes (via requireAuth())

**Database Query**: 
- Joins todos with categories
- Filters by authenticated user ID
- Orders by creation date

**Error Handling**: Returns empty array on error

**Usage**:
```typescript
import getAllTodos from '@/modules/todos/actions/get-todos.action';

const todos = await getAllTodos();
// Returns: [{ id, title, description, categoryName, ... }, ...]
```

---

#### getTodoById()

**Path**: `src/modules/todos/actions/get-todo-by-id.action.ts`

**Purpose**: Fetch a single todo by ID for the authenticated user.

**Parameters**:
```typescript
id: number  // Todo ID
```

**Returns**:
```typescript
Todo | null  // Todo object or null if not found
```

**Authentication**: Yes (via requireAuth())

**Database Query**:
- Joins with categories
- Verifies todo belongs to authenticated user
- Returns null if not found or unauthorized

**Usage**:
```typescript
import { getTodoById } from '@/modules/todos/actions/get-todo-by-id.action';

const todo = await getTodoById(123);
if (todo) {
  // Display todo details
}
```

---

#### createTodoAction()

**Path**: `src/modules/todos/actions/create-todo.action.ts`

**Purpose**: Create a new todo with optional image upload to R2.

**Parameters**: `FormData` object with the following fields:
```typescript
{
  title: string;           // Required, 3-255 characters
  description?: string;    // Optional, max 1000 characters
  categoryId?: number;     // Optional category ID
  status?: "pending" | "in_progress" | "completed" | "archived";
  priority?: "low" | "medium" | "high" | "urgent";
  completed?: boolean;     // Default: false
  dueDate?: string;        // ISO date string
  imageUrl?: string;       // Optional image URL
  imageAlt?: string;       // Optional alt text
  image?: File;            // Optional image file for upload
}
```

**Returns**: Redirects to todo list on success

**Authentication**: Yes (via requireAuth())

**Side Effects**:
- Uploads image to R2 if provided (bucket: "todo-images")
- Revalidates `/dashboard/todos` path
- Redirects to todo list after creation

**Throws**:
- Zod validation errors for invalid data
- "Authentication required" error if not authenticated
- Generic error message for other failures

**Usage**:
```typescript
import { createTodoAction } from '@/modules/todos/actions/create-todo.action';

const formData = new FormData();
formData.append('title', 'New Task');
formData.append('description', 'Task description');
formData.append('priority', 'high');
formData.append('image', fileInput.files[0]);

await createTodoAction(formData);
// Automatically redirects on success
```

---

#### updateTodoAction()

**Path**: `src/modules/todos/actions/update-todo.action.ts`

**Purpose**: Update an existing todo with optional new image.

**Parameters**:
```typescript
todoId: number    // Todo ID to update
formData: FormData  // Form fields (all optional, partial update)
```

**FormData Fields** (all optional):
```typescript
{
  title?: string;
  description?: string;
  categoryId?: number;
  status?: "pending" | "in_progress" | "completed" | "archived";
  priority?: "low" | "medium" | "high" | "urgent";
  completed?: boolean;
  dueDate?: string;
  imageUrl?: string;
  imageAlt?: string;
  image?: File;  // New image file
}
```

**Returns**: Redirects to todo list on success

**Authentication**: Yes (via requireAuth())

**Database Query**:
- Verifies todo belongs to authenticated user
- Only updates provided fields
- Sets updatedAt timestamp

**Side Effects**:
- Uploads new image to R2 if provided
- Revalidates `/dashboard/todos` path
- Redirects to todo list

**Throws**:
- "Todo not found or unauthorized" if todo doesn't exist or belongs to another user
- Validation errors for invalid data

**Usage**:
```typescript
import { updateTodoAction } from '@/modules/todos/actions/update-todo.action';

const formData = new FormData();
formData.append('title', 'Updated Title');
formData.append('status', 'completed');

await updateTodoAction(123, formData);
```

---

#### updateTodoFieldAction()

**Path**: `src/modules/todos/actions/update-todo.action.ts`

**Purpose**: Update specific fields of a todo (optimized for checkbox toggles).

**Parameters**:
```typescript
{
  todoId: number;
  data: {
    completed?: boolean;  // Currently only supports completed field
  }
}
```

**Returns**:
```typescript
{
  success: boolean;
  data?: Todo;         // Updated todo object if successful
  error?: string;      // Error message if failed
}
```

**Authentication**: Yes (via requireAuth())

**Side Effects**:
- Auto-updates status to "completed" or "pending" based on completed field
- Revalidates `/dashboard/todos` path
- Does NOT redirect (returns data for optimistic UI updates)

**Usage**:
```typescript
import { updateTodoFieldAction } from '@/modules/todos/actions/update-todo.action';

const result = await updateTodoFieldAction(123, { completed: true });
if (result.success) {
  // Update UI optimistically
}
```

---

#### deleteTodoAction()

**Path**: `src/modules/todos/actions/delete-todo.action.ts`

**Purpose**: Delete a todo by ID.

**Parameters**:
```typescript
todoId: number  // Todo ID to delete
```

**Returns**:
```typescript
{
  success: boolean;
  message?: string;  // Success message
  error?: string;    // Error message if failed
}
```

**Authentication**: Yes (via requireAuth())

**Database Query**:
- Verifies todo exists and belongs to authenticated user
- Deletes todo record

**Side Effects**:
- Revalidates `/dashboard/todos` path

**Usage**:
```typescript
import { deleteTodoAction } from '@/modules/todos/actions/delete-todo.action';

const result = await deleteTodoAction(123);
if (result.success) {
  // Show success message
}
```

---

### Category Actions

#### getAllCategories()

**Path**: `src/modules/todos/actions/get-categories.action.ts`

**Purpose**: Fetch all categories for a specific user.

**Parameters**:
```typescript
userId: string  // User ID
```

**Returns**:
```typescript
Category[]  // Array of categories (see Data Models section)
```

**Authentication**: No (but requires userId parameter)

**Database Query**:
- Filters categories by userId
- Orders by creation date

**Error Handling**: Returns empty array on error

**Usage**:
```typescript
import { getAllCategories } from '@/modules/todos/actions/get-categories.action';

const categories = await getAllCategories(user.id);
```

---

#### createCategory()

**Path**: `src/modules/todos/actions/create-category.action.ts`

**Purpose**: Create a new category for the authenticated user.

**Parameters**:
```typescript
{
  name: string;          // Required
  color?: string;        // Optional, default: "#6366f1"
  description?: string;  // Optional
}
```

**Returns**:
```typescript
Category  // Created category object
```

**Authentication**: Yes (via requireAuth())

**Side Effects**:
- Revalidates `/dashboard/todos` and `/dashboard/todos/new` paths

**Throws**:
- Zod validation errors for invalid data
- "Failed to create category" if database operation fails

**Usage**:
```typescript
import { createCategory } from '@/modules/todos/actions/create-category.action';

const category = await createCategory({
  name: 'Work',
  color: '#ff6347',
  description: 'Work-related tasks'
});
```

---

## Authentication

### Better Auth Configuration

**Provider**: Better Auth library with Drizzle adapter
**Database**: Cloudflare D1 (SQLite)
**Session Storage**: Database-backed sessions

**Authentication Methods**:
1. Email/Password (enabled)
2. Google OAuth (enabled)

**Environment Variables Required**:
- `BETTER_AUTH_SECRET` - Secret key for signing tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Session Management**:
- Sessions stored in database with expiration
- Cookies managed by Better Auth Next.js plugin
- Automatic session refresh

### Auth Utility Functions

All utilities in `src/modules/auth/utils/auth-utils.ts`:

#### getCurrentUser()

Returns the current authenticated user or null.

```typescript
const user = await getCurrentUser();
// Returns: { id: string, name: string, email: string } | null
```

#### requireAuth()

Returns the current user or throws "Authentication required" error.

```typescript
const user = await requireAuth();
// Throws if not authenticated
```

#### isAuthenticated()

Check if user has valid session.

```typescript
const authenticated = await isAuthenticated();
// Returns: boolean
```

#### getSession()

Get full session object including user and session metadata.

```typescript
const session = await getSession();
// Returns session object or null
```

---

## Data Models

### Todo

```typescript
{
  id: number;
  title: string;
  description: string | null;
  categoryId: number | null;
  categoryName: string | null;  // Joined from categories table
  userId: string;
  status: "pending" | "in_progress" | "completed" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  imageUrl: string | null;
  imageAlt: string | null;
  completed: boolean;
  dueDate: string | null;  // ISO date string
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
```

**Validation Rules**:
- `title`: 3-255 characters
- `description`: max 1000 characters
- `imageUrl`: valid URL or empty string
- `status`: defaults to "pending"
- `priority`: defaults to "medium"
- `completed`: defaults to false

---

### Category

```typescript
{
  id: number;
  name: string;
  color: string;           // Hex color, default: "#6366f1"
  description: string | null;
  userId: string;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
```

**Validation Rules**:
- `name`: required, minimum 1 character
- `color`: optional, defaults to indigo
- `userId`: automatically set from authenticated user

---

### User (Auth)

```typescript
{
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Public Interface** (AuthUser):
```typescript
{
  id: string;
  name: string;
  email: string;
}
```

---

### Session

```typescript
{
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}
```

---

## Error Handling

### API Endpoint Errors

REST endpoints return standardized error responses:

```typescript
{
  success: false;
  error: string;    // Human-readable error message
  data: null;
}
```

**Common HTTP Status Codes**:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

### Server Action Errors

**Pattern 1: Return Object** (for UI handling)
```typescript
{
  success: false;
  error: string;
}
```

**Pattern 2: Throw Error** (for form actions with redirects)
```typescript
throw new Error("Specific error message");
```

**Pattern 3: Redirect on Success** (form actions)
- Uses Next.js `redirect()` after successful mutation
- Throws `NEXT_REDIRECT` error (normal behavior)
- Revalidates paths before redirect

### Authentication Errors

All protected actions check authentication:

```typescript
const user = await requireAuth();
// Throws "Authentication required" if not authenticated
```

Caller should handle:
```typescript
try {
  await protectedAction();
} catch (error) {
  if (error.message === "Authentication required") {
    // Redirect to login
  }
}
```

---

## Security Considerations

1. **Authorization**: All todo/category operations verify userId matches authenticated user
2. **File Uploads**: Images validated and uploaded to R2 with scoped paths
3. **SQL Injection**: Prevented by Drizzle ORM parameterized queries
4. **XSS**: React escapes output by default
5. **CSRF**: Better Auth handles CSRF tokens automatically
6. **Rate Limiting**: Not implemented (consider adding for production)

---

## Development Notes

### Revalidation Strategy

Actions that modify data revalidate affected paths:

```typescript
revalidatePath('/dashboard/todos');  // List page
revalidatePath('/dashboard/todos/new');  // New todo page
```

### Redirect Pattern

Form actions redirect after success:

```typescript
revalidatePath(todosRoutes.list);
redirect(todosRoutes.list);  // Throws NEXT_REDIRECT
```

### Image Upload Flow

1. Check if FormData contains image file
2. Upload to R2 bucket ("todo-images")
3. Store returned URL in database
4. Generate alt text from filename if not provided
5. Log errors but don't fail todo creation

### Database Adapter

- Uses Drizzle ORM with D1 adapter
- Better Auth uses Drizzle adapter for session storage
- All queries are type-safe with TypeScript

---

## Quick Reference

### Most Common Operations

**Create Todo**:
```typescript
const formData = new FormData();
formData.append('title', 'Task');
await createTodoAction(formData);
```

**Update Todo Checkbox**:
```typescript
await updateTodoFieldAction(todoId, { completed: true });
```

**Delete Todo**:
```typescript
await deleteTodoAction(todoId);
```

**Get All Todos**:
```typescript
const todos = await getAllTodos();
```

**Sign In**:
```typescript
const result = await signIn({ email, password });
```

**Check Authentication**:
```typescript
const user = await getCurrentUser();
if (!user) redirect('/login');
```

---

**Last Updated**: 2025-11-08
**API Version**: 1.0.0
