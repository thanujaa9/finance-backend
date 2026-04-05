# Finance Dashboard Backend

A RESTful backend API for a finance dashboard system with role-based access control, built with Node.js, Express, Prisma, and PostgreSQL.

## Live API
- **Swagger Docs**: https://finance-backend-production-3186.up.railway.app/api-docs
- **Base URL**: https://finance-backend-production-3186.up.railway.app

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin1234 |
| Analyst | analyst@test.com | analyst1234 |
| Viewer | viewer@test.com | viewer1234 |

## Tech Stack
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **ORM**: Prisma v5
- **Database**: PostgreSQL (hosted on Railway)
- **Auth**: JWT (access token 15m + refresh token 7d)
- **Validation**: Zod
- **Docs**: Swagger UI (swagger-jsdoc + swagger-ui-express)

## Role Permissions
| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View records | ✓ | ✓ | ✓ |
| View dashboard | ✗ | ✓ | ✓ |
| Create/Edit records | ✗ | ✗ | ✓ |
| Manage users | ✗ | ✗ | ✓ |

## Project Structure
src/
├── config/          # env, db, swagger config
├── middlewares/     # auth, role guard, validation, error handler
├── modules/
│   ├── auth/        # login, register, token refresh
│   ├── users/       # user CRUD and role management
│   ├── records/     # financial records CRUD + filters + categories
│   └── dashboard/   # summary, trends, category breakdown
└── utils/           # response formatter, error classes

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/refresh | Public |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/users | Admin |
| GET | /api/users/:id | Admin |
| PATCH | /api/users/:id/role | Admin |
| PATCH | /api/users/:id/status | Admin |
| DELETE | /api/users/:id | Admin |

### Records
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/records | All roles |
| POST | /api/records | Admin |
| GET | /api/records/:id | All roles |
| PATCH | /api/records/:id | Admin |
| DELETE | /api/records/:id | Admin |
| GET | /api/records/categories | All roles |
| POST | /api/records/categories | Admin |

### Dashboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/dashboard/summary | Analyst+ |
| GET | /api/dashboard/categories | Analyst+ |
| GET | /api/dashboard/trends | Analyst+ |
| GET | /api/dashboard/recent | Analyst+ |

## Record Filtering
`GET /api/records` supports these query params:
- `type` — INCOME or EXPENSE
- `categoryId` — filter by category UUID
- `startDate` — YYYY-MM-DD
- `endDate` — YYYY-MM-DD
- `page` — default 1
- `limit` — default 10

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL database

### Steps
```bash
# Clone the repo
git clone https://github.com/thanujaa9/finance-backend.git
cd finance-backend

# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Push schema to database
npx prisma db push

# Seed sample data
npm run db:seed

# Start dev server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
PORT=5555
NODE_ENV=development
```

## Assumptions & Design Decisions

1. **Soft delete** — Records are never permanently deleted. A `deletedAt` timestamp is set instead, keeping financial history intact.

2. **Role hierarchy** — Roles follow a strict hierarchy: VIEWER < ANALYST < ADMIN. A single `requireRole()` middleware handles this using numeric levels, so ADMIN automatically passes ANALYST-level checks.

3. **Categories as a separate entity** — Categories are managed independently so they can be reused across records and grouped in dashboard analytics.

4. **Decimal for amounts** — Used `Decimal(12,2)` in PostgreSQL to avoid floating point precision issues with financial data.

5. **Refresh tokens stored in DB** — Allows invalidation of sessions server-side if needed.

6. **UUID primary keys** — Used over auto-increment integers to avoid exposing sequential IDs in the API.

7. **Admin-only record creation** — Analysts can view and analyze but not modify financial data, keeping data integrity controlled.

## Tradeoffs

- **No rate limiting** — Not implemented to keep the scope focused, but would add `express-rate-limit` in production.
- **No email verification** — Registration is open for demo purposes.
- **JWT secret in env** — In production would use a secrets manager like AWS Secrets Manager.
