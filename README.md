# Hospital Management Microservice Platform

NestJS, TypeScript, Postgres, Drizzle ORM, and React/Vite scaffold for a hospital management system.

## Modules

- Appointment Scheduler: monthly bookings and resource assignment.
- Patient Registration: patient demographics and quick lookup records.
- Reporting: billing, medical, and operations report records.
- Indoor Management: beds, wards, OTs, asset status, and round notes.
- Clinical Modules: outpatient records, vaccine charts, prescriptions, investigations, and diagnosis.
- Accounting: invoices, billing totals, tax, and payment status.

## Architecture

- `apps/api-gateway`: NestJS HTTP gateway exposing module endpoints under `/api`.
- `packages/db`: shared Drizzle schema and Postgres client.
- `apps/web`: React dashboard using white and blue as primary UI colors.
- `docker-compose.yml`: local Postgres service.

The backend is organized around bounded service modules so each domain can be extracted to its own NestJS microservice transport later without changing the database package or frontend contract.

## Local Setup

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:migrate
npm run db:seed
npm run dev:api
npm run dev:web
```

Default URLs:

- API: `http://localhost:3000/api`
- Web: `http://localhost:5173`
- Postgres: `postgres://hospital:hospital@localhost:5433/hospital`

Demo login after seeding:

- Email: `admin@caregrid.test`
- Password: `admin12345`

## Authentication And Tenant Isolation

The API is hospital-scoped. Users belong to a hospital, and protected records include `hospitalId`.

- `POST /api/auth/login` returns a 15-minute access token and a rotating refresh token.
- `POST /api/auth/refresh` rotates the refresh token and returns a new access token.
- `POST /api/auth/logout` revokes the supplied refresh token.
- `POST /api/auth/register-hospital` creates a hospital and owner user.
- Protected requests use `Authorization: Bearer <token>`.

Roles are enforced per route:

- `owner` / `admin`: broad management access.
- `reception`: patient registration and appointments.
- `doctor` / `nurse` / `lab`: clinical workflows according to route.
- `billing`: accounting and billing reports.

## API Surface

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/register-hospital`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/appointments/calendar`
- `POST /api/appointments`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/indoor/assets`
- `POST /api/indoor/assets`
- `PATCH /api/indoor/assets`
- `GET /api/clinical/records`
- `POST /api/clinical/records`
- `GET /api/accounting/invoices`
- `POST /api/accounting/invoices`
