# BookLeaf - Author Support & Communication Portal

A full-stack publishing management portal built for **BookLeaf Publishing**, enabling authors to track their books and royalties, and admins to manage operations and respond to support tickets with AI-powered assistance.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [API Reference](#api-reference)
- [AI-Powered Ticket System](#ai-powered-ticket-system)
- [Authentication & Authorization](#authentication--authorization)
- [Sample Data](#sample-data)
- [Design Decisions](#design-decisions)

---

## Features

### Author Portal
- **Dashboard** - Personalized overview with published books, copies sold, total royalties, and open ticket count
- **My Books** - Detailed book cards with genre, ISBN, MRP, per-copy royalty, sales data, production status, and platform availability
- **Royalty Reports** - Earnings breakdown with summary cards (total earned, paid out, pending) and per-book tabular data with last payout dates
- **Support Tickets** - Create, view, and track support tickets with expandable message threads and status/priority filters

### Admin Dashboard
- **Platform Overview** - Aggregate metrics across all authors, books, sales, revenue, and ticket volume
- **Author Management** - Searchable author directory with profile cards showing book counts, sales figures, and pending royalties
- **Author Detail** - Full profile view with contact info, complete book portfolio, per-book royalty breakdown, and animated payment progress bar
- **Ticket Management** - Filterable ticket queue (by status and priority) with full conversation view, status controls, and AI-suggested responses

### AI-Powered Support (NVIDIA LLaMA 3.3 70B)
- **Auto-categorization** - Tickets are automatically classified into categories (Royalty Query, Book Status, Technical Issue, Account Update, General) based on content analysis
- **Priority Detection** - Automatic priority assignment (Low, Medium, High, Urgent) using keyword-based heuristics
- **Smart Response Suggestions** - Powered by NVIDIA NIM with Meta's LLaMA 3.3 70B Instruct model. The AI receives the full author profile (books, royalties, sales data) and ticket conversation history as context, generating accurate, personalized responses grounded in real data
- **Graceful Fallback** - If the NVIDIA API key is not configured or the API is unavailable, the system falls back to a rule-based response generator that still uses author data

### Design & UX
- Responsive layout with mobile sidebar drawer and desktop sticky sidebar
- Staggered mount animations and spring-based transitions via Framer Motion
- Skeleton loading states for all data-dependent views
- Monospace typography for all numerical/financial data
- Clean, minimal aesthetic following the taste-skill design system

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.6 |
| **Language** | TypeScript | 5.x |
| **UI Library** | React | 19.2.4 |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Icons** | Phosphor Icons | 2.x |
| **Auth (JWT)** | jose | 6.x |
| **AI Model** | Meta LLaMA 3.3 70B Instruct (via NVIDIA NIM) | - |
| **ID Generation** | uuid | 14.x |
| **Linting** | ESLint + eslint-config-next | 9.x |

---

## Project Structure

```
authorz-portel/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page (public)
│   ├── (portal)/
│   │   ├── layout.tsx                # Protected layout with AuthProvider + Sidebar
│   │   ├── author/
│   │   │   ├── dashboard/page.tsx    # Author dashboard
│   │   │   ├── books/page.tsx        # Author's book portfolio
│   │   │   ├── royalties/page.tsx    # Royalty reports & breakdown
│   │   │   └── support/
│   │   │       ├── page.tsx          # Ticket list
│   │   │       └── new/page.tsx      # Create new ticket
│   │   └── admin/
│   │       ├── dashboard/page.tsx    # Admin overview
│   │       ├── authors/
│   │       │   ├── page.tsx          # Author directory
│   │       │   └── [id]/page.tsx     # Author detail
│   │       └── tickets/
│   │           ├── page.tsx          # Ticket queue
│   │           └── [id]/page.tsx     # Ticket detail with AI
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST - authenticate
│   │   │   ├── logout/route.ts      # POST - clear session
│   │   │   └── me/route.ts          # GET  - current user
│   │   ├── authors/route.ts         # GET  - list/get authors
│   │   ├── books/route.ts           # GET  - list books
│   │   ├── royalties/route.ts       # GET  - royalty summary
│   │   ├── stats/route.ts           # GET  - dashboard stats
│   │   ├── tickets/
│   │   │   ├── route.ts             # GET/POST - list/create tickets
│   │   │   └── [id]/
│   │   │       ├── route.ts         # GET/PATCH - ticket detail/status
│   │   │       └── respond/route.ts # POST - add message
│   │   └── ai/
│   │       └── suggest/route.ts     # POST - AI response suggestion
│   ├── globals.css                   # Theme variables & global styles
│   ├── layout.tsx                    # Root layout with fonts
│   └── page.tsx                      # Root redirect
├── components/
│   ├── auth-provider.tsx             # Auth context & useAuth hook
│   └── sidebar.tsx                   # Navigation sidebar (responsive)
├── lib/
│   ├── auth.ts                       # JWT create/verify/getSession
│   ├── data.ts                       # In-memory data store with seed data
│   └── types.ts                      # TypeScript interfaces
├── proxy.ts                          # Route protection middleware
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd authorz-portel

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `bookleaf-secret-key-2024-change-in-production` | Secret key for JWT signing. Override in production. |
| `NVIDIA_API_KEY` | _(none)_ | NVIDIA NIM API key for LLaMA 3.3 70B AI suggestions. Get one at [build.nvidia.com](https://build.nvidia.com/). Starts with `nvapi-`. If not set, the system uses rule-based fallback responses. |

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@bookleaf.in` | `admin123` |
| **Author** (Priya Sharma) | `priya.sharma@email.com` | `author123` |
| **Author** (Rohit Kapoor) | `rohit.kapoor@email.com` | `author123` |
| **Author** (Sneha Kulkarni) | `sneha.kulkarni@email.com` | `author123` |
| **Author** (Diya Chatterjee) | `diya.chatterjee@email.com` | `author123` |

All 10 authors use the password `author123`.

---

## Architecture

### Data Flow

```
Browser ──> Proxy (proxy.ts) ──> Page / API Route
                │                       │
                │ validates JWT          │ calls lib/data.ts
                │ enforces roles         │ calls lib/auth.ts
                │                       │
                └── redirect if ────────└── returns JSON / HTML
                    unauthorized
```

### Authentication Flow

1. User submits credentials to `POST /api/auth/login`
2. Server validates credentials against in-memory user store
3. On success, a JWT token (HS256, 24h expiry) is set as an httpOnly cookie
4. The proxy (`proxy.ts`) intercepts all requests and validates the token
5. Role-based routing ensures authors cannot access `/admin/*` and vice versa
6. On logout, the cookie is cleared server-side and client-side as fallback

### State Management

- **Server state**: In-memory data store (`lib/data.ts`) with seeded sample data
- **Auth state**: React Context via `AuthProvider` wrapping the portal layout
- **UI state**: Local `useState` in individual components (no global state library needed)

---

## Pages & Routes

### Public Routes

| Path | Description |
|------|-------------|
| `/login` | Authentication page with split-screen layout |
| `/` | Redirects to appropriate dashboard or login |

### Author Routes (requires `role: "author"`)

| Path | Description |
|------|-------------|
| `/author/dashboard` | Personalized stats and book list |
| `/author/books` | Full book portfolio with detailed cards |
| `/author/royalties` | Earnings summary and per-book breakdown table |
| `/author/support` | Support ticket list with filters and expandable threads |
| `/author/support/new` | New ticket creation form |

### Admin Routes (requires `role: "admin"`)

| Path | Description |
|------|-------------|
| `/admin/dashboard` | Platform-wide metrics and author table |
| `/admin/authors` | Searchable author directory with stats |
| `/admin/authors/[id]` | Author profile, books, and payment summary |
| `/admin/tickets` | All tickets with status and priority filters |
| `/admin/tickets/[id]` | Ticket detail, conversation thread, AI suggestions, reply box |

---

## API Reference

### Authentication

#### `POST /api/auth/login`
Authenticate a user and receive a session cookie.

**Request Body:**
```json
{ "email": "admin@bookleaf.in", "password": "admin123" }
```

**Response (200):**
```json
{
  "user": {
    "id": "USR001",
    "email": "admin@bookleaf.in",
    "role": "admin",
    "name": "BookLeaf Admin"
  }
}
```

#### `POST /api/auth/logout`
Clear the session cookie.

#### `GET /api/auth/me`
Returns the currently authenticated user from the JWT cookie.

---

### Authors

#### `GET /api/authors`
Returns authors based on role. Admins see all, authors see only their own profile.

**Query Params:** `?id=AUTH001` (optional, returns single author)

---

### Books

#### `GET /api/books`
Returns books based on role. Admins see all books (with `author_name` and `author_id`), authors see only their own.

---

### Royalties

#### `GET /api/royalties`
Returns royalty summary with per-book breakdown.

**Response:**
```json
{
  "total_earned": 19908,
  "total_paid": 16338,
  "total_pending": 3570,
  "books": [
    {
      "book_id": "BK001",
      "title": "Whispers of the Ganges",
      "total_copies_sold": 342,
      "royalty_per_copy": 35,
      "total_earned": 11970,
      "paid": 8400,
      "pending": 3570,
      "last_payout": "2025-10-15"
    }
  ]
}
```

---

### Statistics

#### `GET /api/stats`
Returns dashboard statistics. Response shape differs by role.

**Admin Response:**
```json
{
  "totalAuthors": 10,
  "totalBooks": 18,
  "publishedBooks": 16,
  "inProductionBooks": 2,
  "totalCopiesSold": 6214,
  "totalRoyaltyEarned": 241462,
  "totalRoyaltyPaid": 198543,
  "totalRoyaltyPending": 42919,
  "openTickets": 3,
  "inProgressTickets": 1,
  "resolvedTickets": 1
}
```

---

### Tickets

#### `GET /api/tickets`
List tickets. Admins see all (enriched with `author_name`), authors see their own.

#### `POST /api/tickets` (Authors only)
Create a new support ticket.

**Request Body:**
```json
{
  "subject": "Royalty payment delay",
  "message": "I haven't received my pending royalty of Rs 3,570...",
  "category": "royalty_query"
}
```

Priority and category are auto-detected if not provided.

#### `GET /api/tickets/[id]`
Get ticket detail with full message thread.

#### `PATCH /api/tickets/[id]` (Admin only)
Update ticket status.

**Request Body:**
```json
{ "status": "resolved" }
```

#### `POST /api/tickets/[id]/respond`
Add a message to the ticket thread. Sender role is inferred from the authenticated user.

**Request Body:**
```json
{ "message": "Thank you for reaching out..." }
```

---

### AI Suggestions

#### `POST /api/ai/suggest` (Admin only)
Generate a contextual response suggestion for a ticket.

**Request Body:**
```json
{ "ticketId": "TKT001" }
```

**Response:**
```json
{
  "suggestion": "Dear Priya,\n\nThank you for reaching out regarding your royalty query.\n\nAs per our records, you have a total pending royalty of Rs 3,570 across 1 book(s):\n- \"Whispers of the Ganges\": Rs 3,570 pending\n\n..."
}
```

---

## AI-Powered Ticket System

### Architecture

The AI suggestion engine uses **NVIDIA NIM** with **Meta's LLaMA 3.3 70B Instruct** model, with an automatic fallback to rule-based generation if the API is unavailable.

```
Admin clicks "Generate Suggestion"
        │
        ▼
  POST /api/ai/suggest
        │
        ├── NVIDIA_API_KEY set?
        │     ├── YES ──> Build system prompt with author profile + book data
        │     │           Build user prompt with ticket conversation history
        │     │           Call NVIDIA NIM API (LLaMA 3.3 70B)
        │     │           Return AI-generated response
        │     │
        │     └── NO ───> Use rule-based fallback generator
        │
        └── API call fails? ──> Fallback to rule-based generator
```

### How It Works

#### 1. Auto-Categorization (on ticket creation)
When an author creates a ticket, keyword analysis classifies it:
- "royalty", "payment", "payout" -> `royalty_query`
- "book", "publish", "production" -> `book_status`
- "account", "profile", "phone" -> `account_update`
- "error", "bug", "technical" -> `technical_issue`

#### 2. Priority Detection (on ticket creation)
Keywords determine urgency:
- "urgent", "immediately", "critical" -> `urgent`
- "payment", "royalty", "delay", "not received" -> `high`
- "issue", "problem", "error" -> `medium`
- Everything else -> `low`

#### 3. AI Response Suggestion (NVIDIA LLaMA 3.3 70B)
When an admin clicks "Generate Suggestion", the system:

1. **Builds a system prompt** containing:
   - Role instructions (professional BookLeaf support agent)
   - Complete author profile (name, email, phone, city, join date)
   - Full book portfolio with royalties, sales, production status, availability
   - Business rules (quarterly payouts, Rs 1,000 minimum threshold)

2. **Builds a user prompt** containing:
   - Ticket metadata (ID, subject, category, priority, status)
   - Full conversation history with timestamps and sender labels

3. **Calls NVIDIA NIM API** (`https://integrate.api.nvidia.com/v1/chat/completions`) with:
   - Model: `meta/llama-3.3-70b-instruct`
   - Temperature: `0.7`
   - Max tokens: `1024`

4. **Returns the response** with a model badge showing whether LLaMA or fallback was used

The admin can review, optionally edit, and send the AI-generated reply.

### NVIDIA API Configuration

1. Visit [build.nvidia.com](https://build.nvidia.com/)
2. Create an account and generate an API key (starts with `nvapi-`)
3. Add to `.env.local`:
   ```
   NVIDIA_API_KEY=nvapi-your-key-here
   ```
4. Restart the dev server

---

## Authentication & Authorization

### JWT Token Structure

```json
{
  "id": "USR001",
  "email": "admin@bookleaf.in",
  "role": "admin",
  "name": "BookLeaf Admin",
  "exp": 1716300000
}
```

### Route Protection (proxy.ts)

The proxy file (Next.js 16 middleware) runs before every request:

- **Public routes** (bypassed): `/login`, `/api/auth/login`, `/api/auth/logout`, `/_next/*`, `/favicon*`
- **Protected page routes**: Redirect to `/login` if no valid token
- **Protected API routes**: Return `401 Unauthorized` if no valid token
- **Role enforcement**:
  - `/admin/*` routes require `role: "admin"` (authors are redirected to `/author/dashboard`)
  - `/author/*` routes require `role: "author"` (admins are redirected to `/admin/dashboard`)

### Security Measures

- JWT tokens stored in **httpOnly cookies** (not accessible via JavaScript)
- Tokens expire after **24 hours**
- CSRF protection via `sameSite: "lax"` cookie setting
- Role-based access enforced at both proxy and API route level

---

## Sample Data

The application is seeded with realistic data from Indian publishing:

- **10 Authors** from cities across India (Mumbai, Delhi, Hyderabad, Pune, Kochi, Chandigarh, Bangalore, Lucknow, Nagpur, Kolkata)
- **18 Books** across genres including Literary Fiction, Self-Help, Poetry, Romance, Business, Thriller, Memoir, and more
- **16 Published** books with sales and royalty tracking
- **2 In-Production** books (one in Cover Design, one in Typesetting)
- **5 Sample Tickets** demonstrating various categories, priorities, and statuses
- **6,214 total copies sold** across all titles
- **Rs 2,41,462 total royalties earned**

---

## Design Decisions

### Why In-Memory Data Store?
For a demo/assignment project, an in-memory store eliminates database setup complexity while demonstrating proper data access patterns, API design, and separation of concerns. The data layer (`lib/data.ts`) can be swapped for a real database (Prisma, Drizzle, etc.) without changing any API routes.

### Why JWT over NextAuth?
Keeping auth simple with raw JWT (via `jose`) demonstrates understanding of the underlying mechanism without framework abstraction. The implementation covers token creation, verification, cookie management, and middleware-based route protection.

### Why Framer Motion?
The taste-skill design system calls for spring-based physics animations, staggered reveals, and layout transitions. Framer Motion provides all of these with a declarative API that integrates naturally with React components.

### Why Phosphor Icons?
Phosphor Icons provide a consistent, high-quality icon set with multiple weight variants (regular, fill, duotone) that adapt to different UI contexts like active/inactive navigation states.

### Why Next.js 16 Proxy instead of Middleware?
Next.js 16 renamed `middleware.ts` to `proxy.ts`. The functionality is identical, but using the new convention avoids deprecation warnings and follows current best practices.
