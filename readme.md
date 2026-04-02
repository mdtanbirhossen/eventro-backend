# Eventro — Backend

A robust REST API for the Eventro event management platform, built with Express, Prisma, PostgreSQL, and TypeScript.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Language | TypeScript 5 |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Database | PostgreSQL |
| Auth | Better-Auth + JWT |
| File Storage | Cloudinary + Multer |
| Email | Nodemailer + EJS templates |
| Payment | SSLCommerz |
| PDF | PDFKit |
| Validation | Zod |
| Package Manager | pnpm |

---

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL database (local or hosted)
- Cloudinary account
- SSLCommerz sandbox / live credentials
- SMTP credentials (Gmail, Mailtrap, etc.)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mdtanbirhossen/eventro-backend.git
cd eventro-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/eventro"

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@eventro.com

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASS=your_store_pass
SSLCOMMERZ_IS_LIVE=false

# Frontend URL (for SSLCommerz redirect)
FRONTEND_URL=http://localhost:3000
```

### 4. Set up the database

```bash
# Push schema to database
pnpm push

# Or run migrations
pnpm migrate

# Generate Prisma client
pnpm generate
```

### 5. Start the dev server

```bash
pnpm dev
```

The API will be available at `http://localhost:5000`.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with hot reload (tsx watch) |
| `pnpm build` | Build for production (tsup + prisma generate) |
| `pnpm start` | Start production server |
| `pnpm migrate` | Run Prisma migrations |
| `pnpm generate` | Regenerate Prisma client |
| `pnpm studio` | Open Prisma Studio |
| `pnpm push` | Push schema directly to DB (no migration) |
| `pnpm pull` | Pull schema from existing DB |

---

## Project Structure

```
src/
├── config/
│   └── prisma.ts              # Prisma client instance
├── generated/
│   └── prisma/                # Generated Prisma client + enums
├── lib/
│   └── prisma.ts              # DB connection
├── middleware/
│   ├── checkAuth.ts           # JWT auth guard
│   ├── optionalCheckAuth.ts   # Optional auth (public routes)
│   └── restrictTo.ts          # Role-based guard
├── modules/
│   ├── auth/                  # Auth (register, login, OAuth, email verify)
│   ├── event/                 # Events CRUD, participation, invitations
│   ├── review/                # Event reviews
│   ├── payment/               # SSLCommerz payment sessions
│   ├── notification/          # User notifications
│   ├── upload/                # Cloudinary file upload/delete
│   ├── stats/                 # Admin dashboard stats
│   └── user/                  # User management
├── shared/
│   ├── catchAsync.ts          # Async error wrapper
│   └── sendResponse.ts        # Standardised API response
├── errorHelpers/
│   └── AppError.ts            # Custom error class
├── app.ts                     # Express app setup
└── server.ts                  # Server entry point
```

---

## API Overview

### Auth — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with email + password |
| POST | `/auth/logout` | Logout (clear session) |
| POST | `/auth/refresh-token` | Get new access token |
| POST | `/auth/verify-email` | Verify email with OTP |
| POST | `/auth/forget-password` | Send password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |
| POST | `/auth/change-password` | Change password (authenticated) |
| GET | `/auth/me` | Get current user profile |
| GET | `/auth/login/google` | Google OAuth login |

### Events — `/events`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/events` | Public | List all published public events |
| GET | `/events/featured` | Public | Get featured event |
| GET | `/events/categories` | Public | Get all categories |
| GET | `/events/:id` | Public / Auth | Get event by ID or slug |
| POST | `/events` | Auth | Create event |
| PUT | `/events/:id` | Owner | Update event |
| DELETE | `/events/:id` | Owner | Delete event (soft) |
| GET | `/events/me/events` | Auth | My created events |
| GET | `/events/me/joined` | Auth | My joined events |
| POST | `/events/:id/join` | Auth | Join / request to join |
| POST | `/events/:id/invite` | Owner | Send bulk invitations |
| GET | `/events/:id/invitations` | Owner | Get event invitations |
| GET | `/events/invitations/me` | Auth | My received invitations |
| PATCH | `/events/invitations/:id` | Auth | Accept / decline invitation |
| GET | `/events/:id/participants` | Owner | Get participants |
| PATCH | `/events/:id/participants/:userId/approve` | Owner | Approve participant |
| PATCH | `/events/:id/participants/:userId/reject` | Owner | Reject participant |
| PATCH | `/events/:id/participants/:userId/ban` | Owner | Ban participant |
| GET | `/events/admin/all` | Admin | All events (admin view) |
| DELETE | `/events/admin/:id` | Admin | Force delete event |
| PATCH | `/events/admin/:id/feature` | Admin | Set / unset featured |

### Reviews — `/reviews` & `/events/:id/reviews`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events/:id/reviews` | Get reviews for event |
| POST | `/events/:id/reviews` | Create review |
| PATCH | `/reviews/:id` | Update review |
| DELETE | `/reviews/:id` | Delete review |

### Payment — `/payment`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/payment/create-session` | Create SSLCommerz payment session |
| GET | `/payment/my` | My payment history |
| POST | `/payment/ipn` | SSLCommerz IPN webhook |
| GET | `/payment/success` | Payment success redirect |
| GET | `/payment/fail` | Payment fail redirect |
| GET | `/payment/cancel` | Payment cancel redirect |

### Notifications — `/notifications`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | Get my notifications |

### Upload — `/upload`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload/` | Upload file(s) to Cloudinary |
| DELETE | `/upload/delete-image` | Delete image(s) from Cloudinary |

### Admin — `/admins`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admins/` | Get all admins |
| GET | `/admins/:id` | Get admin by ID |
| POST | `/admins/create-admin` | Create new admin |

### Stats — `/stats`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Admin dashboard stats |

---

## Database Schema Overview

Core models: `User`, `Session`, `Account`, `Verification`, `Event`, `EventCategory`, `EventParticipant`, `Invitation`, `Review`, `Payment`, `Notification`, `FeaturedEvent`

Key enums: `Role`, `UserStatus`, `EventVisibility`, `EventFeeType`, `EventStatus`, `ParticipantStatus`, `InvitationStatus`, `PaymentStatus`, `PaymentProvider`, `NotificationType`

---

## Standard API Response

All endpoints return a consistent shape:

```json
{
  "success": true,
  "message": "Events fetched successfully",
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Event not found",
  "errorDetails": {}
}
```

---

## Deployment

### Build

```bash
pnpm build
```

Output is in the `api/` directory as ESM.

### Environment

Set `NODE_ENV=production` and all required env vars on your hosting platform (Railway, Render, AWS, etc.).

### Database

Run migrations before starting the server in production:

```bash
pnpm migrate
```

---

## License

ISC