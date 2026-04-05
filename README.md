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
